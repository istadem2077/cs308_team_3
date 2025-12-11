import { Product as AppProduct, CartItem } from '../App';
import { authService } from './auth';

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for API calls
async function apiCall<T>(
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
        // Try to parse error message from backend if available
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text || response.statusText}`);
    }

    // Handle empty responses (like DELETE)
    if (response.status === 204) {
        return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Products API
export const productsAPI = {
  // Get all products from Backend
  getAll: async (): Promise<AppProduct[]> => {
    const products = await apiCall<any[]>('/products');
    // Map backend Product entity to frontend interface if needed
    return products.map(p => ({
        id: p.id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category?.name || 'General',
        image: p.imageUrl || 'placeholder.jpg', // Handle missing images
        rating: 0, // Backend doesn't send average rating yet
        reviews: 0,
        inStock: p.quantity > 0
    }));
  },

  getById: async (id: string): Promise<AppProduct> => {
    const p = await apiCall<any>(`/products/${id}`);
    return {
        id: p.id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category?.name || 'General',
        image: p.imageUrl || 'placeholder.jpg',
        rating: 0,
        reviews: 0,
        inStock: p.quantity > 0
    };
  },

  // Backend doesn't have dedicated search, so we fetch all and filter client-side
  search: async (query: string): Promise<AppProduct[]> => {
    const allProducts = await productsAPI.getAll();
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Backend doesn't have dedicated category filter endpoint, filter client-side
  getByCategory: async (category: string): Promise<AppProduct[]> => {
    const allProducts = await productsAPI.getAll();
    if (category === 'All') return allProducts;
    return allProducts.filter(p => p.category === category);
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
}

export const ordersAPI = {
  // Create Order: 
  // 1. Add items to backend Cart
  // 2. Trigger Checkout
  create: async (orderData: OrderData): Promise<any> => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User must be logged in to order");

    const userId = parseInt(user.id);

    // 1. Add items to backend cart
    // Note: This might be slow for many items as it's sequential. 
    // Ideally backend should have a 'bulk add' or 'create order from list' endpoint.
    for (const item of orderData.items) {
        await apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({
                userId: userId,
                productId: parseInt(item.productId),
                quantity: item.quantity
            })
        });
    }

    // 2. Checkout
    return await apiCall(`/cart/checkout/${userId}`, {
        method: 'POST'
    });
  },

  getUserOrders: async (): Promise<any[]> => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    return await apiCall(`/orders/user/${user.id}`);
  },

  getById: async (orderId: string): Promise<any> => {
    return await apiCall(`/orders/${orderId}`);
  }
};

// Cart API
export const cartAPI = {
  // Add single item (Used by "Add to Cart" buttons)
  addItem: async (productId: string, quantity: number): Promise<void> => {
    const user = authService.getCurrentUser();
    if (!user) return; // Or handle local cart for guests

    await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        userId: parseInt(user.id),
        productId: parseInt(productId),
        quantity: quantity
      }),
    });
  },

  // Load cart from server
  load: async (): Promise<CartItem[]> => {
    const user = authService.getCurrentUser();
    if (!user) return [];

    const cartData: any = await apiCall(`/cart/${user.id}`);
    
    if (!cartData || !cartData.items) return [];

    return cartData.items.map((item: any) => ({
      id: item.product.id.toString(),
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.imageUrl || 'placeholder.jpg'
    }));
  },

  clear: async (): Promise<void> => {
    const user = authService.getCurrentUser();
    if (!user) return;
    await apiCall(`/cart/${user.id}`, { method: 'DELETE' });
  },

  removeItem: async (productId: string): Promise<void> => {
      const user = authService.getCurrentUser();
      if(!user) return;

      // The backend 'remove' endpoint expects a CartRequest object
      await apiCall('/cart/remove', {
          method: 'POST',
          body: JSON.stringify({
              userId: parseInt(user.id),
              productId: parseInt(productId),
              quantity: 1 // Removing 1 or logic to remove all? Backend likely decrements or removes.
          })
      });
  }
};