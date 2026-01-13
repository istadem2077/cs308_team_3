import { User } from './api';

const API_BASE_URL = 'http://localhost:8080/api';

export interface AuthResponse {
  token: string;
  name: string;
  userId: number;
  address: string;
}

export const authService = {
  // Login
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      id: data.userId.toString(),
      name: data.name,
      email: credentials.email, // Backend doesn't return email in AuthResponse, so we preserve it
      address: data.address
    }));
    return data;
  },

  // Register
  register: async (userData: any): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      id: data.userId.toString(),
      name: data.name,
      email: userData.email,
      address: data.address
    }));
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get Current Token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Get Current User
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};