import { Product, CartItem } from '../App';

// Configuration - Replace these with your actual API endpoints
const API_BASE_URL = 'https://your-api-endpoint.com/api';
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };

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
    // Mock implementation - replace with real API call
    // return apiCall<Product[]>('/products');
    
    // For now, using mock data
    const { products } = await import('../data/products');
    return new Promise(resolve => setTimeout(() => resolve(products), 500));
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    // return apiCall<Product>(`/products/${id}`);
    
    const { products } = await import('../data/products');
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return new Promise(resolve => setTimeout(() => resolve(product), 300));
  },

  // Search products
  search: async (query: string): Promise<Product[]> => {
    // return apiCall<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
    
    const { products } = await import('../data/products');
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    return new Promise(resolve => setTimeout(() => resolve(filtered), 400));
  },

  // Get products by category
  getByCategory: async (category: string): Promise<Product[]> => {
    // return apiCall<Product[]>(`/products/category/${category}`);
    
    const { products } = await import('../data/products');
    const filtered = products.filter(p => p.category === category);
    return new Promise(resolve => setTimeout(() => resolve(filtered), 400));
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
  // Create new order
  create: async (orderData: OrderData): Promise<OrderResponse> => {
    // Real implementation:
    // const formData = new FormData();
    // formData.append('orderData', JSON.stringify(orderData));
    // if (orderData.prescriptionFile) {
    //   formData.append('prescription', orderData.prescriptionFile);
    // }
    // return apiCall<OrderResponse>('/orders', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {}, // Let browser set Content-Type for FormData
    // });

    // Mock implementation
    console.log('Creating order:', orderData);
    const orderId = `ORD-${Date.now()}`;
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            orderId,
            status: 'confirmed',
            estimatedDelivery: '2-4 hours',
            totalPrice: orderData.totalPrice,
            items: orderData.items.map(item => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
            date: new Date().toISOString(),
          }),
        1000
      )
    );
  },

  // Get order by ID
  getById: async (orderId: string): Promise<OrderResponse> => {
    // return apiCall<OrderResponse>(`/orders/${orderId}`);
    
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            orderId,
            status: 'confirmed',
            estimatedDelivery: '2-4 hours',
            totalPrice: 450,
            items: [
              {
                productId: '1',
                productName: 'Product 1',
                quantity: 2,
                price: 200,
              },
              {
                productId: '2',
                productName: 'Product 2',
                quantity: 1,
                price: 50,
              },
            ],
            date: new Date().toISOString(),
          }),
        500
      )
    );
  },

  // Get user's order history
  getHistory: async (): Promise<OrderResponse[]> => {
    // return apiCall<OrderResponse[]>('/orders/history');
    
    return new Promise(resolve => setTimeout(() => resolve([]), 500));
  },
};

// Cart API (if you want to persist cart on server)
export const cartAPI = {
  // Save cart to server
  save: async (items: CartItem[]): Promise<void> => {
    // return apiCall<void>('/cart', {
    //   method: 'POST',
    //   body: JSON.stringify({ items }),
    // });
    
    console.log('Saving cart:', items);
    return new Promise(resolve => setTimeout(resolve, 300));
  },

  // Load cart from server
  load: async (): Promise<CartItem[]> => {
    // return apiCall<CartItem[]>('/cart');
    
    return new Promise(resolve => setTimeout(() => resolve([]), 300));
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
    // return apiCall<User>('/user/profile');
    
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            id: '1',
            name: 'Student Name',
            email: 'student@sabanciuniv.edu',
            phone: '+90 555 123 4567',
            dormitory: 'A Block',
            roomNumber: '301',
          }),
        500
      )
    );
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    // return apiCall<User>('/user/profile', {
    //   method: 'PUT',
    //   body: JSON.stringify(userData),
    // });
    
    console.log('Updating profile:', userData);
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            id: '1',
            name: userData.name || 'Student Name',
            email: userData.email || 'student@sabanciuniv.edu',
            phone: userData.phone || '+90 555 123 4567',
            dormitory: userData.dormitory || 'A Block',
            roomNumber: userData.roomNumber || '301',
          }),
        500
      )
    );
  },
};

// Prescription Upload API
export const prescriptionAPI = {
  upload: async (file: File, orderId: string): Promise<{ url: string }> => {
    // const formData = new FormData();
    // formData.append('prescription', file);
    // formData.append('orderId', orderId);
    // return apiCall<{ url: string }>('/prescriptions/upload', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {}, // Let browser set Content-Type
    // });

    console.log('Uploading prescription:', file.name, 'for order:', orderId);
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            url: `https://storage.example.com/prescriptions/${orderId}/${file.name}`,
          }),
        1000
      )
    );
  },
};

// Inventory API (for real-time stock updates)
export const inventoryAPI = {
  checkStock: async (productId: string): Promise<{ inStock: boolean; quantity: number }> => {
    // return apiCall<{ inStock: boolean; quantity: number }>(`/inventory/${productId}`);
    
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            inStock: true,
            quantity: 50,
          }),
        300
      )
    );
  },
};