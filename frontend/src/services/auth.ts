// Authentication Service

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Optional as backend doesn't strictly require it in AuthResponse
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  address: string; // Changed to string to match backend "address" field
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string; // Added to match backend RegisterRequest
  address: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  userId: number;
  address: string;
}

// Configuration
const API_BASE_URL = 'http://localhost:8080/api/user'; // Adjust port if needed

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Login failed');

      const data: AuthResponse = await response.json();
      
      // Map backend response to frontend User object
      const user: User = {
        id: data.userId.toString(),
        name: data.name,
        email: credentials.email,
        address: data.address
      };

      // Persist session
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token: data.token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Registration failed');

      const responseData: AuthResponse = await response.json();

      const user: User = {
        id: responseData.userId.toString(),
        name: responseData.name,
        email: data.email,
        address: responseData.address
      };

      localStorage.setItem('authToken', responseData.token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token: responseData.token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('cart'); // Clear local cart state if any
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Update user profile (Address specifically)
  updateAddress: async (userId: number, newAddress: string): Promise<User> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/mod-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId, address: newAddress }),
    });

    if (!response.ok) throw new Error('Update failed');

    // The backend returns the full User entity
    const updatedUserBackend = await response.json();
    
    // Update local storage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
        const updatedUser = { ...currentUser, address: updatedUserBackend.address };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
    }
    throw new Error("No local user found");
  },
};