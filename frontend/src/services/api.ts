// Configuration - values берём из .env (Vite)
// В корне фронта создайте файл .env с переменными:
// VITE_API_BASE_URL=https://your-backend-url.com/api
// VITE_API_KEY=your_api_key_here
// Приведение к any нужно, чтобы линтер не ругался на import.meta.env в TypeScript-конфигурации.
const viteEnv = (import.meta as any).env as {
  VITE_API_BASE_URL?: string;
  VITE_API_KEY?: string;
};
const API_BASE_URL = viteEnv.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_KEY = viteEnv.VITE_API_KEY || '';

// Берём токен авторизации из localStorage (ставится после логина)
const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken') || '';
  } catch {
    return '';
  }
};

// Type definitions
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stockCount: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isPrescriptionRequired?: boolean;
  popularity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock data exports
export { products as mockProducts } from '../data/products';
export { mockReviews } from '../data/reviews';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = getAuthToken();
  const authHeader = token ? `Bearer ${token}` : API_KEY ? `Bearer ${API_KEY}` : undefined;
  const isFormData = options.body instanceof FormData;

  const defaultHeaders: Record<string, string> = {};
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  if (authHeader) {
    defaultHeaders['Authorization'] = authHeader;
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Products API
export const productsAPI = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    // Реальный запрос к вашему backend
    return apiCall<Product[]>('/products');
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    return apiCall<Product>(`/products/${id}`);
  },

  // Search products
  search: async (query: string): Promise<Product[]> => {
    return apiCall<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  },

  // Get products by category
  getByCategory: async (category: string): Promise<Product[]> => {
    return apiCall<Product[]>(`/products/category/${category}`);
  },
};

// Orders API
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
  prescriptionRequired: boolean;
}

export interface OrderResponse {
  orderId: string;
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded';
  estimatedDelivery: string;
  totalPrice: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    discount?: number;
  }>;
  date: string;
}

export const ordersAPI = {
  // Create new order
  create: async (orderData: OrderData): Promise<OrderResponse> => {
    // Реальный запрос на создание заказа
    return apiCall<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get order by ID
  getById: async (orderId: string): Promise<OrderResponse> => {
    return apiCall<OrderResponse>(`/orders/${orderId}`);
  },

  // Get user's order history
  getHistory: async (): Promise<OrderResponse[]> => {
    return apiCall<OrderResponse[]>('/orders/history');
  },
};

// Cart API (if you want to persist cart on server)
export const cartAPI = {
  // Save cart to server
  save: async (items: CartItem[]): Promise<void> => {
    return apiCall<void>('/cart', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  // Load cart from server
  load: async (): Promise<CartItem[]> => {
    return apiCall<CartItem[]>('/cart');
  },
};

// User API
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dormitory: string;
  roomNumber: string;
}

export const userAPI = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    return apiCall<User>('/user/profile');
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return apiCall<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Prescription Upload API
export const prescriptionAPI = {
  upload: async (file: File, orderId: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('orderId', orderId);
    return apiCall<{ url: string }>('/prescriptions/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type
    });
  },
};

// Inventory API (for real-time stock updates)
export const inventoryAPI = {
  checkStock: async (productId: string): Promise<{ inStock: boolean; quantity: number }> => {
    return apiCall<{ inStock: boolean; quantity: number }>(`/inventory/${productId}`);
  },
};