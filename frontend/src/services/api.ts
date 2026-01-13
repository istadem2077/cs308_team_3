import { User } from './auth';

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token' to match auth.ts
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
        // Try to parse error message from backend
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const errorBody = await response.text();
            if(errorBody) errorMessage = errorBody;
        } catch {}
        throw new Error(errorMessage);
    }

    // Handle empty responses (like from DELETE)
    if (response.status === 204) return {} as T;
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      // Handle simple string responses (like "Product added to wishlist")
      const text = await response.text();
      return text as unknown as T; 
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Interfaces matching your Backend DTOs/Entities
// --- NEW CART API ---
export const cartAPI = {
  getCart: async (userId: string): Promise<CartItem[]> => {
    try {
      // Backend returns a Cart object with a list of items
      const cart = await apiCall<any>(`/cart/${userId}`);
      if (!cart || !cart.items) return [];

      // Mapper: Backend (item.product.name) -> Frontend (item.name)
      return cart.items.map((item: any) => ({
        ...productsAPI.mapProduct(item.product), // Flatten the product details
        quantity: item.quantity,                 // Use the cart-specific quantity
      }));
    } catch (e) {
      console.warn("Could not fetch cart (maybe empty or user new)", e);
      return [];
    }
  },

  addToCart: async (userId: string, productId: string, quantity: number) => {
    return apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: quantity
      })
    });
  },

  removeFromCart: async (userId: string, productId: string, quantity: number) => {
    return apiCall('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: quantity
      })
    });
  },
  
  clearCart: async (userId: string) => {
    return apiCall(`/cart/${userId}`, { method: 'DELETE' });
  }
};

// ... (Keep existing ordersAPI, wishlistAPI, reviewsAPI) ...
// NOTE: I updated productsAPI in the previous step, make sure to include it.
export const productsAPI = {
  mapProduct: (p: any): Product => ({
    id: p.id.toString(),
    name: p.name,
    category: p.category ? p.category.name : 'Uncategorized',
    price: p.price,
    image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    description: p.description,
    inStock: (p.quantity || 0) > 0,
    stockCount: p.quantity || 0,
    requiresPrescription: false,
    popularity: p.total_orders || 0,
    rating: p.averageRating || 0,
    reviewCount: 0,
    model: 'Standard',
    serialNumber: `SN-${p.id}`,
    warrantyStatus: '1 Year',
    distributor: 'Sabanci Pharmacy'
  }),
  getAll: async (): Promise<Product[]> => {
    const products = await apiCall<any[]>('/products');
    return products.map(productsAPI.mapProduct);
  },
  getById: async (id: string): Promise<Product> => {
    const p = await apiCall<any>(`/products/${id}`);
    return productsAPI.mapProduct(p);
  },
  search: async (query: string): Promise<Product[]> => {
    const products = await apiCall<any[]>(`/products/search?query=${encodeURIComponent(query)}`);
    return products.map(productsAPI.mapProduct);
  },
};

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  stockCount: number;
  rating: number; 
  popularity: number;
  reviewCount: number;
  requiresPrescription: boolean;
  model: string;
  serialNumber: string;
  warrantyStatus: string;
  distributor: string;
}

export interface CartItem extends Product {
    quantity: number;
}

// Orders API
export interface OrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  deliveryAddress: any;
}

export interface OrderResponse {
  orderId: string;
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  totalPrice: number;
  items: any[];
  date: string;
}

const mapStatus = (backendStatus: string): any => {
    const status = backendStatus ? backendStatus.toUpperCase() : 'PENDING';
    if (status === 'IN_TRANSIT' || status === 'SHIPPED') return 'in-transit';
    if (status === 'DELIVERED') return 'delivered';
    if (status === 'CANCELLED') return 'cancelled';
    return 'processing'; 
};

export const ordersAPI = {
  create: async (orderData: OrderData): Promise<OrderResponse> => {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error("User not logged in");

    // 1. Sync Cart (Logic moved to Backend mostly, but we ensure backend cart is ready)
    // We send items to ensure backend cart has them before checkout
    for (const item of orderData.items) {
         // Backend CartRequest: { userId, productId, quantity }
        await apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({
                userId: parseInt(userId),
                productId: parseInt(item.productId),
                quantity: item.quantity
            })
        });
    }

    // 2. Checkout
    // Backend returns the 'Order' entity. Warning: OrderItems might be null in JSON (@JsonIgnore)
    const order = await apiCall<any>(`/cart/checkout/${userId}`, {
        method: 'POST'
    });

    // 3. Construct Response
    // Since backend Order entity might hide items via @JsonIgnore, we use local data for the immediate UI response
    return {
        orderId: order.id.toString(),
        status: 'processing',
        estimatedDelivery: '2 Days',
        totalPrice: orderData.totalPrice,
        items: orderData.items,
        date: order.createdAt || new Date().toISOString(),
    };
  },

  // Get History using OrderResponseDto
  getHistory: async (): Promise<OrderResponse[]> => {
    const userId = localStorage.getItem('userId');
    if (!userId) return [];

    const orders = await apiCall<any[]>(`/orders/user/${userId}`);
    return orders.map(order => ({
        orderId: order.orderId.toString(),
        status: mapStatus(order.status),
        estimatedDelivery: order.status === 'DELIVERED' ? 'Delivered' : '2 Days',
        totalPrice: order.totalAmount,
        items: order.items.map((item: any) => ({
            productId: item.productId.toString(),
            name: item.productName,
            quantity: item.quantity,
            price: item.unitPrice
        })),
        date: order.orderDate
    }));
  },

  downloadInvoice: async (orderId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/invoice/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error('Failed to download invoice');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};

// Wishlist API (NEW)
export const wishlistAPI = {
    getMyWishlist: async (): Promise<Product[]> => {
        // Backend returns List<Wishlist>, where Wishlist has a 'product' field
        const wishlistItems = await apiCall<any[]>('/wishlist');
        return wishlistItems.map(w => productsAPI.mapProduct(w.product));
    },

    add: async (productId: string) => {
        return apiCall(`/wishlist/add/${productId}`, { method: 'POST' });
    },

    remove: async (productId: string) => {
        return apiCall(`/wishlist/remove/${productId}`, { method: 'DELETE' });
    }
};

// Reviews API
export interface Review {
    id: string;
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    status: string;
}

export const reviewsAPI = {
    add: async (data: { productId: number; userId: number; rating: number; comment: string }) => {
        return apiCall('/reviews', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    getByProduct: async (productId: string): Promise<Review[]> => {
        const reviews = await apiCall<any[]>(`/reviews/product/${productId}`);
        return reviews.map(r => ({
            id: r.id.toString(),
            productId: r.productId.toString(),
            userName: r.userName || 'Anonymous',
            rating: r.rating,
            comment: r.comment,
            date: r.createdAt,
            status: r.status
        }));
    }
}