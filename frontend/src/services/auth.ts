// Authentication Service

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  address: {
    city: string;
    province: string;
    postcode: string;
    addressLine: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  address: {
    city: string;
    province: string;
    postcode: string;
    addressLine: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

const API_BASE_URL = 'https://your-api-endpoint.com/api';

// Mock implementation - Replace with real API calls
export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Real implementation:
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // });
    // if (!response.ok) throw new Error('Login failed');
    // return await response.json();

    // Mock implementation
    console.log('Login attempt:', credentials.email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: credentials.email,
      age: 22,
      gender: 'male',
      phone: '+90 555 123 4567',
      address: {
        city: 'Istanbul',
        province: 'Tuzla',
        postcode: '34956',
        addressLine: 'Sabanci University Campus, A Block, Room 301',
      },
    };

    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(mockUser));

    return { user: mockUser, token };
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Real implementation:
    // const response = await fetch(`${API_BASE_URL}/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!response.ok) throw new Error('Registration failed');
    // return await response.json();

    // Mock implementation
    console.log('Registration attempt:', data.email);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
    };

    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(mockUser));

    return { user: mockUser, token };
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
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

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    // Real implementation:
    // const token = localStorage.getItem('authToken');
    // const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(updates),
    // });
    // if (!response.ok) throw new Error('Update failed');
    // return await response.json();

    // Mock implementation
    console.log('Updating profile:', updates);
    await new Promise(resolve => setTimeout(resolve, 500));

    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return updatedUser;
  },
};

// Turkish cities for address selection
export const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
  'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
  'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır',
  'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun',
  'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta', 'Mersin', 'Istanbul', 'İzmir',
  'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya',
  'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop',
  'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
  'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale',
  'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük',
  'Kilis', 'Osmaniye', 'Düzce',
];
