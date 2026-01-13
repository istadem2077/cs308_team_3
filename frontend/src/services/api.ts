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

    if (response.status === 204) return {} as T;

    // FIX: Robust Content-Type check
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    }

    // Fallback for text responses
    const text = await response.text();
    return text as unknown as T;

  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const products = await apiCall<any[]>('/products');

    // Safe mapper with fallbacks
    return Array.isArray(products) ? products.map(p => ({
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
    })) : [];
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
    const all = await productsAPI.getAll();
    return all.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  },

  getByCategory: async (category: string): Promise<Product[]> => {
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
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded';
  estimatedDelivery: string;
  totalPrice: number;
  items: any[];
  date: string;
}

const mapStatus = (backendStatus: string): 'processing' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded' => {
  const status = backendStatus ? backendStatus.toUpperCase() : 'PENDING';
  if (status === 'IN_TRANSIT' || status === 'SHIPPED') return 'in-transit';
  if (status === 'DELIVERED') return 'delivered';
  if (status === 'CANCELLED') return 'cancelled';
  if (status === 'REFUNDED' || status === 'RETURNED' || status === 'RETURN_REQUESTED') return 'refunded';
  return 'processing';
};

export const ordersAPI = {
  create: async (orderData: OrderData): Promise<OrderResponse> => {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error("User not logged in");

    try {
      await apiCall(`/cart/${userId}`, { method: 'DELETE' });
    } catch (e) { console.log("Cart clear ignored or failed", e); }

    for (const item of orderData.items) {
      try {
        await apiCall('/cart/add', {
          method: 'POST',
          body: JSON.stringify({
            userId: parseInt(userId),
            productId: parseInt(item.productId),
            quantity: item.quantity
          })
        });
      } catch (e) { console.error(e) }
    }

    const order = await apiCall<any>(`/cart/checkout/${userId}`, { method: 'POST' });

    return {
      orderId: order.id.toString(),
      status: mapStatus(order.status),
      estimatedDelivery: '2 Days',
      totalPrice: orderData.totalPrice,
      items: orderData.items,
      date: order.createdAt || new Date().toISOString(),
    };
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return apiCall(`/pm/order/${orderId}/status?status=${status}`, {
      method: 'PUT'
    });
  },

  syncCart: async (userId: string, items: CartItem[]) => {
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
      status: mapStatus(order.status),
      estimatedDelivery: order.status === 'DELIVERED' ? 'Delivered' : '2 Days',
      totalPrice: order.totalAmount,
      items: order.items.map((item: any) => ({
        productId: item.productId || '0',
        name: item.productName,
        productName: item.productName,
        quantity: item.quantity,
        price: item.unitPrice
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
        price: item.unitPrice
      })),
      date: order.orderDate
    }));
  },

  cancel: async (orderId: string): Promise<OrderResponse> => {
    const response = await apiCall<any>(`/orders/${orderId}/cancel`, { method: 'PUT' });
    return {
      orderId: response.orderId.toString(),
      status: mapStatus(response.status),
      estimatedDelivery: 'Cancelled',
      totalPrice: response.totalAmount,
      items: response.items || [],
      date: response.orderDate
    };
  },

  returnOrder: async (orderId: string): Promise<OrderResponse> => {
    // Hits the authenticated-allowed endpoint
    const response = await apiCall<any>(`/orders/${orderId}/return`, { method: 'PUT' });
    return {
      orderId: response.orderId.toString(),
      status: mapStatus(response.status),
      estimatedDelivery: 'Return Requested',
      totalPrice: response.totalAmount,
      items: response.items || [],
      date: response.orderDate
    };
  },

  downloadInvoice: async (orderId: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8080/api/invoice/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
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
    return reviews.map(r => ({
      id: r.id.toString(),
      productId: r.productId.toString(),
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt,
      status: r.status || 'APPROVED'
    }));
  }
}

// User API
export const userAPI = {
  getProfile: async (): Promise<any> => {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    return apiCall(`/addresses/${userId}`);
  },
};

// Wishlist API
export const wishlistAPI = {
  get: async (): Promise<Product[]> => {
    const data = await apiCall<any[]>('/wishlist');
    // Ensure we handle the nested structure correctly as per previous fix
    return Array.isArray(data) ? data.map((w: any) => ({
      id: w.product.id.toString(),
      name: w.product.name,
      category: w.product.category ? w.product.category.name : 'Uncategorized',
      price: w.product.price,
      image: w.product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
      description: w.product.description,
      inStock: (w.product.quantity || 0) > 0,
      stockCount: w.product.quantity || 0,
      requiresPrescription: false,
      popularity: w.product.total_orders || 0,
      rating: w.product.averageRating || 0,
      reviewCount: 0,
      model: w.product.model || 'Standard',
      serialNumber: w.product.serialNumber || `SN-${w.product.id}`,
      warrantyStatus: w.product.warrantyStatus || '1 Year',
      distributor: w.product.distributor || 'Sabanci Pharmacy'
    })) : [];
  },

  add: async (productId: string): Promise<void> => {
    await apiCall(`/wishlist/add/${productId}`, { method: 'POST' });
  },

  remove: async (productId: string): Promise<void> => {
    await apiCall(`/wishlist/remove/${productId}`, { method: 'DELETE' });
  }
};