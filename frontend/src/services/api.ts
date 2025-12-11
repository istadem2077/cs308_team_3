import { Product, CartItem } from '../App';
import { authService } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
        const text = await response.text();
        try {
            const json = JSON.parse(text);
            throw new Error(json.message || `API Error: ${response.status}`);
        } catch (e) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {} as T;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// --- Helper for Product Mapping ---
const mapBackendProductToFrontend = (p: any): Product => ({
    id: p.id.toString(),
    name: p.name,
    // Backend returns a Category object, frontend expects a string name
    category: p.category ? p.category.name : 'Uncategorized',
    price: p.price,
    // Backend uses 'imageUrl', frontend uses 'image'
    image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 
    description: p.description || '',
    // Backend uses 'quantity', frontend uses 'stockCount' and 'inStock'
    stockCount: p.quantity || 0,
    inStock: (p.quantity || 0) > 0,
    // Default values for fields missing in backend
    popularity: 0, 
    rating: 0, 
    reviewCount: 0,
    model: 'Standard',
    serialNumber: `SN-${p.id}`,
    warrantyStatus: 'Standard Warranty',
    distributor: 'Sabanci Pharmacy'
});

// --- Products API ---
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const backendProducts = await apiCall<any[]>('/products');
    return backendProducts.map(mapBackendProductToFrontend);
  },

  getById: async (id: string): Promise<Product> => {
    const p = await apiCall<any>(`/products/${id}`);
    return mapBackendProductToFrontend(p);
  },

  search: async (query: string): Promise<Product[]> => {
    // Backend doesn't have a direct search endpoint shown, so we filter client-side 
    // or you could implement a search endpoint in backend.
    const allProducts = await productsAPI.getAll();
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const allProducts = await productsAPI.getAll();
    if (category === 'All') return allProducts;
    return allProducts.filter(p => p.category === category);
  },
};

// --- Orders API ---
export interface OrderResponse {
  orderId: string;
  status: 'processing' | 'in-transit' | 'delivered';
  estimatedDelivery: string;
  totalPrice: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  date: string;
}

export const ordersAPI = {
  create: async (userId: number): Promise<any> => {
    return apiCall<any>(`/cart/checkout/${userId}`, {
        method: 'POST'
    });
  },

  getById: async (orderId: string): Promise<any> => {
    return apiCall<any>(`/orders/${orderId}`);
  },

  getHistory: async (): Promise<OrderResponse[]> => {
    const userId = authService.getUserId();
    if (!userId) return [];
    
    const orders = await apiCall<any[]>(`/orders/user/${userId}`);
    
    // Map backend OrderResponseDto to frontend OrderResponse
    return orders.map(o => ({
        orderId: o.orderId.toString(),
        status: o.status ? o.status.toLowerCase() : 'processing',
        estimatedDelivery: '3-5 Business Days', // Mocked as backend doesn't provide this
        totalPrice: o.totalAmount,
        date: o.orderDate,
        items: o.items ? o.items.map((item: any) => ({
            productId: item.productId?.toString() || '0',
            productName: item.productName || 'Unknown Product',
            quantity: item.quantity,
            price: item.price
        })) : []
    }));
  },
};

// --- Cart API ---
export const cartAPI = {
  addToCart: async (productId: string, quantity: number): Promise<void> => {
    const userId = authService.getUserId();
    if(!userId) return;
    
    await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        productId: parseInt(productId),
        quantity: quantity
      }),
    });
  },

  removeFromCart: async (productId: string): Promise<void> => {
    const userId = authService.getUserId();
    if(!userId) return;

    await apiCall('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        productId: parseInt(productId),
        quantity: 1 // Default to removing 1 or specific logic
      }),
    });
  },

  clearCart: async (): Promise<void> => {
      const userId = authService.getUserId();
      if(!userId) return;
      await apiCall(`/cart/${userId}`, { method: 'DELETE' });
  },

  load: async (): Promise<CartItem[]> => {
    const userId = authService.getUserId();
    if(!userId) return [];

    try {
        const cart = await apiCall<any>(`/cart/${userId}`);
        
        if (!cart || !cart.items) return []; // Check for 'items' or 'cartItems' depending on backend entity
        
        // Assuming backend Cart entity has a list named 'items' or 'cartItems'
        const itemsList = cart.items || cart.cartItems || [];

        return itemsList.map((item: any) => {
            // Check if product is nested object or flattened
            const prod = item.product; 
            return {
                id: prod.id.toString(),
                name: prod.name,
                price: prod.price,
                quantity: item.quantity,
                image: prod.imageUrl || 'https://via.placeholder.com/150',
                category: prod.category ? prod.category.name : 'General',
                description: prod.description,
                inStock: (prod.quantity || 0) > 0,
                stockCount: prod.quantity || 0,
                rating: 0,
                reviewCount: 0,
                model: 'Standard',
                serialNumber: 'N/A',
                warrantyStatus: 'N/A',
                distributor: 'N/A'
            };
        });
    } catch (e) {
        console.warn("Cart load failed or empty", e);
        return [];
    }
  },
};

// --- Reviews API ---
export const reviewsAPI = {
    addReview: async (reviewData: {productId: number, rating: number, comment: string}) => {
        const userId = authService.getUserId();
        return apiCall('/reviews', {
            method: 'POST',
            body: JSON.stringify({
                userId,
                productId: reviewData.productId,
                rating: reviewData.rating,
                comment: reviewData.comment
            })
        });
    },

    getByProduct: async (productId: string) => {
        const reviews = await apiCall<any[]>(`/reviews/product/${productId}`);
        // Map backend ReviewResponseDto
        return reviews.map(r => ({
            id: r.id.toString(),
            productId: r.productId.toString(),
            userName: r.userName || 'Anonymous',
            rating: r.rating,
            comment: r.comment,
            date: r.createdAt
        }));
    }
};

// --- User API ---
export const userAPI = {
  updateAddress: async (addressData: any): Promise<any> => {
      return apiCall('/user/mod-address', {
          method: 'POST',
          body: JSON.stringify(addressData)
      });
  },
  
  updatePassword: async (passwordData: any): Promise<any> => {
      return apiCall('/user/passwd-upd', {
          method: 'POST',
          body: JSON.stringify(passwordData)
      });
  }
};