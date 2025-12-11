import { apiCall } from './api';

export interface User {
  id: string; // Backend uses Integer, but frontend handles IDs as strings usually
  name: string;
  email: string;
  // age: number; // MISSING IN BACKEND
  // gender: 'male' | 'female' | 'other'; // MISSING IN BACKEND
  // phone: string; // MISSING IN BACKEND
  address: string; // Backend uses a single string for address
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
  token: string;
  // Backend AuthResponse might differ, adjust based on actual JSON
  userId?: number; 
  name?: string;
  email?: string;
}

// Helper to format frontend address object to backend string
const formatAddress = (addr: RegisterData['address']) => {
  return `${addr.addressLine}, ${addr.postcode}, ${addr.province}, ${addr.city}`;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await apiCall<any>('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Assuming backend returns { token: "...", name: "..." }
    // If backend only returns token, you might need to decode JWT or fetch profile
    const user: User = {
      id: data.userId || '0', // Backend needs to return ID or we extract from token
      name: data.name || '',
      email: credentials.email,
      address: '', // Login response usually doesn't have address unless added
    };

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(user));
    if (data.userId) localStorage.setItem('userId', data.userId.toString());

    return { token: data.token, ...user };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Note: confirmPassword is required by backend DTO
    const backendPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.password, 
      address: formatAddress(data.address),
      // Backend ignores age, gender, phone currently
    };

    const response = await apiCall<any>('/user/register', {
      method: 'POST',
      body: JSON.stringify(backendPayload),
    });

    // Auto-login after register if backend returns token
    const user: User = {
      id: response.userId || '0',
      name: data.name,
      email: data.email,
      address: backendPayload.address,
    };

    if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(user));
        if (response.userId) localStorage.setItem('userId', response.userId.toString());
    }

    return { token: response.token, ...user };
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
  
  getUserId: (): number => {
      const id = localStorage.getItem('userId');
      return id ? parseInt(id) : 0;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
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