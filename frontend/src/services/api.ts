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

// --- Products API ---
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    return apiCall<Product[]>('/products');
  },

  getById: async (id: string): Promise<Product> => {
    return apiCall<Product>(`/products/${id}`);
  },

  search: async (query: string): Promise<Product[]> => {
    const allProducts = await apiCall<Product[]>('/products');
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const allProducts = await apiCall<Product[]>('/products');
    if (category === 'All') return allProducts;
    return allProducts.filter(p => p.category === category);
  },
};

// --- Orders API ---
export interface OrderData {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  deliveryAddress: {
    name: string;
    phone: string;
    city: string;
    province: string;
    postcode: string;
    addressLine: string;
    notes: string;
  };
  // Removed prescriptionRequired
}

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
  create: async (orderData: any): Promise<any> => {
    const userId = authService.getUserId();
    return apiCall<any>(`/cart/checkout/${userId}`, {
        method: 'POST'
    });
  },

  getById: async (orderId: string): Promise<any> => {
    return apiCall<any>(`/orders/${orderId}`);
  },

  getHistory: async (): Promise<any[]> => {
    const userId = authService.getUserId();
    return apiCall<any[]>(`/orders/user/${userId}`);
  },
};

// --- Cart API ---
export const cartAPI = {
  addToCart: async (productId: string, quantity: number): Promise<void> => {
    const userId = authService.getUserId();
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
    await apiCall('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        productId: parseInt(productId),
        quantity: 1
      }),
    });
  },

  clearCart: async (): Promise<void> => {
      const userId = authService.getUserId();
      await apiCall(`/cart/${userId}`, { method: 'DELETE' });
  },

  load: async (): Promise<CartItem[]> => {
    const userId = authService.getUserId();
    const cart = await apiCall<any>(`/cart/${userId}`);
    
    if (!cart || !cart.cartItems) return [];
    
    return cart.cartItems.map((item: any) => ({
        id: item.product.id.toString(),
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        category: item.product.category,
        description: item.product.description,
        inStock: item.product.stockCount > 0,
        stockCount: item.product.stockCount,
        rating: item.product.rating || 0,
        reviewCount: item.product.reviewCount || 0
    }));
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
        return apiCall(`/reviews/product/${productId}`);
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