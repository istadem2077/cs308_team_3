import { authService } from './auth';

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Type definitions matching Frontend Components
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stockCount: number;
  inStock: boolean;
  rating: number; // Mapped from backend reviews or defaulted
  reviewCount: number;
  isPrescriptionRequired?: boolean;
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
  status?: string;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = authService.getToken();
  
  const defaultHeaders: Record<string, string> = {
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

    if (response.status === 401) {
      authService.logout();
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : {} as T;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// --- Data Mappers (Backend -> Frontend) ---

const mapProduct = (p: any): Product => ({
  id: p.id.toString(),
  name: p.name,
  description: p.description || p.name, // Fallback if no desc
  price: p.price,
  image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', // Fallback image
  category: p.category ? p.category.name : 'General',
  stockCount: p.quantity, // Backend uses 'quantity' for stock
  inStock: p.quantity > 0,
  rating: 4.5, // Backend might not calculate this yet, default for UI
  reviewCount: 0,
  isPrescriptionRequired: false // Backend needs this field, defaulting to false
});

const mapOrder = (o: any): OrderResponse => ({
  orderId: o.orderId.toString(),
  status: o.status.toLowerCase(),
  estimatedDelivery: '3-5 Days',
  totalPrice: o.totalAmount,
  items: o.items.map((i: any) => ({
    productId: i.productId.toString(),
    productName: i.productName,
    quantity: i.quantity,
    price: i.unitPrice
  })),
  date: o.orderDate
});

// --- API Exports ---

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const data = await apiCall<any[]>('/products');
    return data.map(mapProduct);
  },

  getById: async (id: string): Promise<Product> => {
    const data = await apiCall<any>(`/products/${id}`);
    return mapProduct(data);
  },

  search: async (query: string): Promise<Product[]> => {
    const data = await apiCall<any[]>(`/products/search?query=${encodeURIComponent(query)}`);
    return data.map(mapProduct);
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    // Backend doesn't have a direct 'get by category name' endpoint visible
    // So we fetch all and filter client side for now, or you can add the endpoint
    const all = await productsAPI.getAll();
    return all.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
};

export const reviewsAPI = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    const data = await apiCall<any[]>(`/reviews/product/${productId}`);
    return data.map((r: any) => ({
      id: r.id.toString(),
      productId: r.productId.toString(),
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt,
      status: r.status
    }));
  },

  add: async (review: { productId: number, userId: number, rating: number, comment: string }) => {
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(review)
    });
  }
};

export interface OrderData {
  items: Array<{ productId: string; quantity: number }>;
  totalPrice: number;
}

export interface OrderResponse {
  orderId: string;
  status: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded';
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
  // Create Order (Sync Cart -> Checkout)
  create: async (orderData: OrderData): Promise<OrderResponse> => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not logged in");
    
    // 1. Ensure backend cart matches frontend order
    // We clear the backend cart and re-add items to ensure sync
    await cartAPI.clear(parseInt(user.id));
    
    for (const item of orderData.items) {
      await cartAPI.addToCart({
        userId: parseInt(user.id),
        productId: parseInt(item.productId),
        quantity: item.quantity
      });
    }

    // 2. Checkout
    // The backend checkout creates the order from the Cart
    const response = await apiCall<any>(`/cart/checkout/${user.id}`, {
      method: 'POST'
    });

    // Map the backend Order entity to OrderResponse
    // Note: The backend checkout returns the Order entity
    // We need to fetch the mapped DTO or map it manually here
    // Assuming backend returns Order entity structure:
    return {
       orderId: response.id.toString(),
       status: response.status.toLowerCase(),
       estimatedDelivery: 'Pending',
       totalPrice: response.orderItems.reduce((acc: number, item: any) => acc + (item.unitPrice * item.quantity), 0),
       items: response.orderItems.map((i: any) => ({
         productId: i.product.id.toString(),
         productName: i.product.name,
         quantity: i.quantity,
         price: i.unitPrice
       })),
       date: response.createdAt
    };
  },

  getHistory: async (): Promise<OrderResponse[]> => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    const data = await apiCall<any[]>(`/orders/user/${user.id}`);
    return data.map(mapOrder);
  },

  cancel: async (orderId: string): Promise<void> => {
    await apiCall(`/orders/${orderId}/cancel`, { method: 'PUT' });
  },

  refund: async (orderId: string): Promise<void> => {
    await apiCall(`/orders/${orderId}/return`, { method: 'PUT' });
  }
};

export const cartAPI = {
  // Clear cart
  clear: async (userId: number) => {
    await apiCall(`/cart/${userId}`, { method: 'DELETE' });
  },

  // Add single item
  addToCart: async (data: { userId: number, productId: number, quantity: number }) => {
    await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Save full cart (Strategy: Clear then Add All)
  // This is inefficient but ensures state sync if frontend is "master"
  save: async (items: CartItem[]): Promise<void> => {
    const user = authService.getCurrentUser();
    if (!user) return;

    await cartAPI.clear(parseInt(user.id));
    for (const item of items) {
      await cartAPI.addToCart({
        userId: parseInt(user.id),
        productId: parseInt(item.id),
        quantity: item.quantity
      });
    }
  },

  load: async (): Promise<CartItem[]> => {
    const user = authService.getCurrentUser();
    if (!user) return [];

    try {
      const cart = await apiCall<any>(`/cart/${user.id}`);
      if (!cart || !cart.items) return [];

      return cart.items.map((item: any) => ({
        ...mapProduct(item.product),
        quantity: item.quantity
      }));
    } catch (e) {
      console.warn("Could not load cart", e);
      return [];
    }
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export const userAPI = {
  getProfile: async (): Promise<User> => {
    // If backend doesn't have a /me endpoint, return stored user
    // Otherwise: return apiCall<User>('/user/me');
    const user = authService.getCurrentUser();
    if (!user) throw new Error("Not logged in");
    return Promise.resolve(user);
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    // Backend doesn't show a generic update profile, only password
    // Implement if backend adds it. For now, return input.
    console.log("Update profile not fully supported by backend yet");
    return Promise.resolve({ ...authService.getCurrentUser()!, ...userData });
  }
};