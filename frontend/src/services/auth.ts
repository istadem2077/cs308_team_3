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

// Base URL: берём из .env, как и в services/api.ts
const viteEnv = (import.meta as any).env as {
  VITE_API_BASE_URL?: string;
};
const API_BASE_URL = viteEnv.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Реальная имплементация, использующая backend /api/user/login и /api/user/register
export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }

    // Backend AuthResponse: { token, name, userId, address }
    const data: { token: string; name: string; userId: number; address: string } =
      await response.json();

    const user: User = {
      id: String(data.userId),
      name: data.name,
      email: credentials.email,
      age: 0,
      gender: 'other',
      phone: '',
      address: {
        city: '',
        province: '',
        postcode: '',
        addressLine: data.address,
      },
    };

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token: data.token };
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.password,
      gender: data.gender,
      phone: data.phone,
      age: data.age,
      addressLine: data.address.addressLine,
      city: data.address.city,
      province: data.address.province,
      zipCode: data.address.postcode,
    };

    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const res: { token: string; name: string; userId: number; address: string } =
      await response.json();

    const user: User = {
      id: String(res.userId),
      name: res.name,
      email: data.email,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      address: {
        city: data.address.city,
        province: data.address.province,
        postcode: data.address.postcode,
        addressLine: res.address,
      },
    };

    localStorage.setItem('authToken', res.token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token: res.token };
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
