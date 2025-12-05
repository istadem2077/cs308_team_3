// src/api/client.ts
// src/api/client.ts
import type {AuthResponse, Product, CartItem, RegisterRequest, OrderResponseDto} from '../types';

const BASE_URL = '/api';

// --- Helper: Get Headers with JWT ---
const getHeaders = (isMultipart = false): HeadersInit => {
    const headers: HeadersInit = {};

    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }

    const stored = localStorage.getItem('user');
    if (stored) {
        try {
            const user: AuthResponse = JSON.parse(stored);
            if (user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error("Error parsing user token", e);
        }
    }
    return headers;
};

// --- Helper: Handle Response Errors ---
const handleResponse = async (res: Response) => {
    if (!res.ok) {
        // If 401 Unauthorized, maybe redirect to login?
        if (res.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        const errorText = await res.text();
        throw new Error(errorText || `Request failed: ${res.status}`);
    }
    return res.json();
};

export const api = {
    // --- Auth (Public endpoints, but we use standard headers) ---
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const res = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // No token needed yet
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(res);
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const res = await fetch(`${BASE_URL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    // --- Products ---
    getProducts: async (): Promise<Product[]> => {
        const res = await fetch(`${BASE_URL}/products`, {
            method: 'GET',
            headers: getHeaders() // Token attached
        });
        return handleResponse(res);
    },

    getProductById: async (id: number): Promise<Product> => {
        const res = await fetch(`${BASE_URL}/products/${id}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return handleResponse(res);
    },

    // --- Cart ---
    addToCart: async (userId: number, productId: number, quantity: number) => {
        // Note: API expects CartRequest { userId, productId, quantity }
        const res = await fetch(`${BASE_URL}/cart/add`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ userId, productId, quantity }),
        });
        return handleResponse(res);
    },

    getCart: async (userId: number): Promise<{ items: CartItem[] }> => {
        const res = await fetch(`${BASE_URL}/cart/${userId}`, {
            method: 'GET', // Matches CartController @GetMapping
            headers: getHeaders()
        });
        return handleResponse(res);
    },

    removeFromCart: async (userId: number, productId: number, quantity: number = 1) => {
        const res = await fetch(`${BASE_URL}/cart/remove`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ userId, productId, quantity }), // Now sends dynamic quantity
        });
        return handleResponse(res);
    },

    clearCart: async (userId: number) => {
        await fetch(`${BASE_URL}/cart/${userId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
    },

    checkout: async (userId: number) => {
        const res = await fetch(`${BASE_URL}/cart/checkout/${userId}`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(res);
    },

    // --- Orders ---
    getUserOrders: async (userId: number): Promise<OrderResponseDto[]> => {
        const res = await fetch(`${BASE_URL}/orders/user/${userId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return handleResponse(res);
    },

    // --- Invoice ---
    downloadInvoice: async (orderId: number) => {
        const res = await fetch(`${BASE_URL}/invoice/${orderId}`, {
            method: 'GET',
            headers: getHeaders() // Required for security
        });

        if (!res.ok) throw new Error("Failed to download invoice");

        // Convert response to Blob and trigger download
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    },


    updateAddress: async (userId: number, newAddress: string) => {
        const res = await fetch(`${BASE_URL}/user/mod-address`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ id: userId, address: newAddress }), // Matches AddressUpdateRequest
        });
        return handleResponse(res);
    },

    updatePassword: async (userId: number, oldPass: string, newPass: string, confirmPass: string) => {
        const res = await fetch(`${BASE_URL}/user/passwd-upd`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                id: userId,
                oldPassword: oldPass,
                newPassword: newPass,
                confirmPassword: confirmPass
            }), // Matches PasswordUpdateRequest
        });
        return handleResponse(res);
    }
};