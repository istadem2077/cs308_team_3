import { Product } from '../App';

const API_BASE_URL = 'http://localhost:8080/api';

// --- Helper for authenticated calls ---
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) return {} as T;

    // FIX: Check Content-Type before parsing JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    }

    // Fallback: Return text for endpoints that return string messages (like setDiscount)
    const text = await response.text();
    return text as unknown as T;
}

// --- Sales Manager API ---
export const salesManagerAPI = {
    // Matches SalesManagerController: setDiscount
    setDiscount: async (productId: string, rate: number) => {
        // Backend expects rate as RequestParam
        return apiCall(`/sales/discount/${productId}?rate=${rate}`, {
            method: 'POST'
        });
    },

    // Matches SalesManagerController: getReport
    getFinancialReport: async (start: string, end: string) => {
        // Backend expects ISO DateTime strings
        return apiCall<any>(`/sales/report?start=${start}&end=${end}`);
    }
};

// --- Product Manager API ---
export const productManagerAPI = {
    // Matches ProductManagerController
    addProduct: async (product: Partial<Product>) => {
        return apiCall<Product>('/pm/product/add', {
            method: 'POST',
            body: JSON.stringify(product)
        });
    },

    deleteProduct: async (id: string) => {
        return apiCall(`/pm/product/${id}`, { method: 'DELETE' });
    },

    getAllCategories: async () => {
        return apiCall<any[]>('/pm/categories');
    },

    addCategory: async (categoryName: string) => {
        return apiCall('/pm/category/add', {
            method: 'POST',
            body: JSON.stringify({ name: categoryName })
        });
    },
    deleteCategory: async (categoryId: string) => {
        return apiCall(`/pm/category/delete/${categoryId}`, {
            method: 'PUT',
        });
    },

    updateProduct: async (id: string, product: Partial<Product>) => {
        return apiCall<Product>(`/pm/product/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product)
        });
    },

    updateStock: async (productId: string, quantity: number) => {
        return apiCall(`/pm/stock/${productId}?quantity=${quantity}`, {
            method: 'PUT'
        });
    },

    getDeliveries: async () => {
        return apiCall<any[]>('/pm/deliveries');
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        return apiCall(`/pm/order/${orderId}/status?status=${status}`, {
            method: 'PUT'
        });
    },

    getPendingReviews: async () => {
        return apiCall<any[]>('/pm/reviews/pending');
    },

    moderateReview: async (reviewId: string, approved: boolean) => {
        return apiCall(`/pm/reviews/${reviewId}/approve?approved=${approved}`, {
            method: 'PUT'
        });
    }
};

// --- Support Manager API ---
export const supportManagerAPI = {
    // Get unclaimed waiting sessions
    getQueue: async () => {
        return apiCall<any[]>('/support/queue');
    },

    // Get sessions claimed by the current agent
    getMySessions: async () => {
        // Requires backend endpoint: GET /api/support/my-sessions
        return apiCall<any[]>('/support/my-sessions');
    },

    // Get closed/resolved sessions history
    getHistory: async () => {
        // Requires backend endpoint: GET /api/support/history
        return apiCall<any[]>('/support/history');
    },

    // Get all customers for the directory
    getCustomers: async () => {
        // Requires backend endpoint: GET /api/support/customers
        return apiCall<any[]>('/support/customers');
    },

    getCustomerContext: async (email: string) => {
        return apiCall<any>(`/support/context/${email}`);
    },

    claimSession: async (sessionId: string) => {
        const agentEmail = localStorage.getItem('userEmail') || 'agent@sabanci.edu';
        return apiCall(`/support/session/${sessionId}/claim?agentEmail=${agentEmail}`, {
            method: 'POST'
        });
    },

    resolveSession: async (sessionId: string) => {
        // Requires backend endpoint: PUT /api/support/session/{id}/resolve
        return apiCall(`/support/session/${sessionId}/resolve`, {
            method: 'PUT'
        });
    }
};