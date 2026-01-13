import { Product, CartItem } from '../App';

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for API calls
async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = localStorage.getItem('authToken');

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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle empty responses (like from DELETE)
    if (response.status === 204) return {} as T;

    // Check if content type is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      return {} as T;
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const products = await apiCall<any[]>('/products');

    // Mapper: Backend returns object for category, frontend expects string
    return products.map(p => ({
      id: p.id.toString(),
      name: p.name,
      category: p.category ? p.category.name : 'Uncategorized',
      price: p.price,
      image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', // Fallback image
      description: p.description,
      inStock: (p.quantity || 0) > 0,
      stockCount: p.quantity || 0,
      requiresPrescription: false,
      popularity: p.total_orders || 0,
      rating: p.averageRating, // Default or fetch from reviews
      reviewCount: 0,
      model: 'Standard',
      serialNumber: `SN-${p.id}`,
      warrantyStatus: '1 Year',
      distributor: 'Sabanci Pharmacy'
    }));
  },

  getById: async (id: string): Promise<Product> => {
    const p = await apiCall<any>(`/products/${id}`);
    return {
      id: p.id.toString(),
      name: p.name,
      category: p.category ? p.category.name : 'Uncategorized',
      price: p.price,
      image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
      description: p.description,
      inStock: (p.quantity || 0) > 0,
      stockCount: p.quantity || 0,
      requiresPrescription: false,
      popularity: 80,
      rating: 4.5,
      reviewCount: 0,
      model: 'Standard',
      serialNumber: `SN-${p.id}`,
      warrantyStatus: '1 Year',
      distributor: 'Sabanci Pharmacy'
    };
  },

  search: async (query: string): Promise<Product[]> => {
    // Perform client-side filtering since backend search endpoint wasn't provided in controllers
    const all = await productsAPI.getAll();
    return all.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    // Perform client-side filtering
    const all = await productsAPI.getAll();
    return all.filter(p => p.category === category);
  },
};

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
  status: 'processing' | 'in-transit' | 'delivered';
  estimatedDelivery: string;
  totalPrice: number;
  items: any[];
  date: string;
}

// Helper to map Database status to Frontend UI status
const mapStatus = (backendStatus: string): 'processing' | 'in-transit' | 'delivered' => {
  const status = backendStatus ? backendStatus.toUpperCase() : 'PENDING';
  if (status === 'IN_TRANSIT' || status === 'SHIPPED') return 'in-transit';
  if (status === 'DELIVERED') return 'delivered';
  return 'processing'; // Default for "PENDING" or unknown
};

export const ordersAPI = {
  // Complex Logic: Sync local cart to server, then checkout
  create: async (orderData: OrderData): Promise<OrderResponse> => {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error("User not logged in");

    // 1. Clear server cart to ensure it matches local checkout state
    // We try to clear it, but if it fails (empty), we ignore
    try {
      await apiCall(`/cart/${userId}`, { method: 'DELETE' });
    } catch (e) { console.log("Cart clear ignored or failed", e); }

    // 2. Add all items from checkout to server cart
    // This loops through items and adds them one by one
    for (const item of orderData.items) {
      await apiCall('/cart/add', {
        method: 'POST',
        body: JSON.stringify({
          userId: parseInt(userId),
          productId: parseInt(item.productId),
          quantity: item.quantity
        })
      });
    }

    // 3. Perform Checkout
    const order = await apiCall<any>(`/cart/checkout/${userId}`, {
      method: 'POST'
    });

    // 4. Return formatted response
    return {
      orderId: order.id.toString(),
      status: mapStatus(order.status), // Backend status is PENDING
      estimatedDelivery: '2 Days',
      totalPrice: orderData.totalPrice,
      items: orderData.items,
      date: order.createdAt || new Date().toISOString(),
    };
  },
  syncCart: async (userId: string, items: CartItem[]) => {
    // Loop through local items and send them to the server
    for (const item of items) {
      try {
        await apiCall('/cart/add', {
          method: 'POST',
          body: JSON.stringify({
            userId: parseInt(userId),
            productId: parseInt(item.id),
            quantity: item.quantity
          })
        });
      } catch (error) {
        console.error(`Failed to sync item ${item.name}`, error);
      }
    }
  },

  getById: async (orderId: string): Promise<OrderResponse> => {
    const order = await apiCall<any>(`/orders/${orderId}`);
    return {
      orderId: order.orderId.toString(),
      status: mapStatus(order.status), // <--- FIX: Use real status
      estimatedDelivery: order.status === 'DELIVERED' ? 'Delivered' : '2 Days',
      totalPrice: order.totalAmount,
      items: order.items.map((item: any) => ({
        productId: item.productId || '0', // Backend DTO doesn't send ID currently
        name: item.productName,           // Map productName to name
        productName: item.productName,
        quantity: item.quantity,
        price: item.unitPrice             // <--- CRITICAL FIX (was undefined before)
      })),
      date: order.orderDate
    };
  },

  getHistory: async (): Promise<OrderResponse[]> => {
    const userId = localStorage.getItem('userId');
    if (!userId) return [];

    const orders = await apiCall<any[]>(`/orders/user/${userId}`);
    return orders.map(order => ({
      orderId: order.orderId.toString(),
      status: mapStatus(order.status),
      estimatedDelivery: 'Delivered',
      totalPrice: order.totalAmount,
      items: order.items.map((item: any) => ({
        productId: item.productId || '0',
        name: item.productName,
        productName: item.productName,
        quantity: item.quantity,
        price: item.unitPrice             // <--- CRITICAL FIX
      })),
      date: order.orderDate
    }));
  },

  downloadInvoice: async (orderId: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8080/api/invoice/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to download invoice');

    // Convert response to blob and trigger download
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

// Reviews API
export const reviewsAPI = {
  add: async (productId: string, rating: number, comment: string) => {
    const userId = localStorage.getItem('userId');
    if(!userId) throw new Error("Must be logged in");


    const safeComment = comment === 0 ? "0" : String(comment || "");
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: parseInt(productId),
        userId: parseInt(userId),
        rating,
        comment: safeComment
      })
    });
  },

  getByProduct: async (productId: string) => {
    const reviews = await apiCall<any[]>(`/reviews/product/${productId}`);
    // Map the backend response to our frontend interface
    return reviews.map(r => ({
      id: r.id.toString(),
      productId: r.productId.toString(),
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt,
      status: r.status || 'APPROVED' // Default to APPROVED if missing for older data
    }));
  }
}

// User API
export const userAPI = {
  getProfile: async (): Promise<any> => {
    // Currently we rely on LocalStorage, but could fetch addresses here
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    return apiCall(`/addresses/${userId}`);
  },
};

export const wishlistAPI = {
  get: async (): Promise<Product[]> => {
    const data = await apiCall<any[]>('/wishlist');
    // Backend returns list of Wishlist objects { id, product: {...} }
    return data.map((w: any) => ({
          id: w.id.toString(),
          name: w.name,
          category: w.category ? w.category.name : 'Uncategorized',
          price: w.price,
          image: w.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
          description: w.description,
          inStock: (w.quantity || 0) > 0,
          stockCount: w.quantity || 0,
          requiresPrescription: false,
          popularity: 80,
          rating: 4.5,
          reviewCount: 0,
          model: 'Standard',
          serialNumber: `SN-${w.id}`,
          warrantyStatus: '1 Year',
          distributor: 'Sabanci Pharmacy'
    }));
  },

  add: async (productId: string): Promise<void> => {
    await apiCall(`/wishlist/add/${productId}`, { method: 'POST' });
  },

  remove: async (productId: string): Promise<void> => {
    await apiCall(`/wishlist/remove/${productId}`, { method: 'DELETE' });
  }
};