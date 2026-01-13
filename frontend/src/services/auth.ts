// Authentication Service

// Matches Backend DTO: AddressDto.java
export interface Address {
  id?: number;
  addressLine: string;
  city: string;
  province: string;
  zipCode: string;
  isDefault?: boolean;
  phone?: number;
}

// Matches frontend expectations + Backend data
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

// Matches Backend DTO: AuthResponse.java
export interface AuthResponse {
  user: User;
  token: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Login failed');

    // Backend returns { token, name, userId, address (string) }
    const data = await response.json();

    // We construct a User object compatible with the frontend
    const user: User = {
      id: data.userId.toString(),
      name: data.name,
      email: credentials.email,
      age: 0, // Not returned in login response, would need profile fetch
      gender: 'other',
      phone: '',
      address: {
        city: '',
        province: '',
        postcode: '',
        addressLine: data.address || '',
      }
    };

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', data.userId.toString()); // Save ID separately for API calls

    return { user, token: data.token };
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Backend expects flattened address fields and integer phone
    // See RegisterRequest.java
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.password, // Backend requires this field
      age: data.age,
      gender: data.gender,
      phone: parseInt(data.phone.replace(/\D/g, '')) || 0, // Strip non-digits

      // Flattened address
      addressLine: data.address.addressLine,
      city: data.address.city,
      province: data.address.province,
      zipCode: data.address.postcode
    };

    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Registration failed');

    const responseData = await response.json();

    // Map response to frontend User
    const user: User = {
      id: responseData.userId.toString(),
      name: data.name,
      email: data.email,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
    };

    const token = responseData.token;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', responseData.userId.toString());

    return { user, token };
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  },

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
    return !!localStorage.getItem('authToken');
  },

  // Update user profile - Placeholder as backend doesn't show a direct "update profile" endpoint
  // other than password update or address update.
  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    // For now, just update local storage to reflect changes in UI
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  },
};

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