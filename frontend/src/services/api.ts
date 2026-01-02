<<<<<<< HEAD
// Configuration - Replace these with your actual API endpoints
const API_BASE_URL = 'https://your-api-endpoint.com/api';
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

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
=======
import { Product, CartItem } from '../App';

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';

<<<<<<< HEAD
// Helper function for API calls
async function apiCall<T>(
=======
export async function apiCall<T>(
>>>>>>> master
>>>>>>> nazim
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
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded';
  estimatedDelivery: string;
  totalPrice: number;
<<<<<<< HEAD
  items: any[];
=======
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    discount?: number;
  }>;
>>>>>>> nazim
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
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
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
            status: 'processing',
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
            status: 'processing',
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
=======
  create: async (userId: number): Promise<any> => {
    return apiCall<any>(`/cart/checkout/${userId}`, {
>>>>>>> nazim
        method: 'POST'
    });

<<<<<<< HEAD
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
=======
  getById: async (orderId: string): Promise<any> => {
    return apiCall<any>(`/orders/${orderId}`);
>>>>>>> master
>>>>>>> nazim
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
    },

    getByUser: async (userId: string) => {
        // Calls the new backend endpoint
        const reviews = await apiCall<any[]>(`/reviews/user/${userId}`);
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
     // Currently we rely on LocalStorage, but could fetch addresses here
     const userId = localStorage.getItem('userId');
     if (!userId) return null;
     return apiCall(`/addresses/${userId}`);
  },
};