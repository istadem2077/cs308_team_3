import { apiCall } from './api';

export interface User {
  id: string; 
  name: string;
  email: string;
  address: string;
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
  userId: number; 
  name: string;
  address: string;
}

// Helper to format frontend address object to backend string
const formatAddress = (addr: RegisterData['address']) => {
  return `${addr.addressLine}, ${addr.city}, ${addr.province} ${addr.postcode}`;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await apiCall<AuthResponse>('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const user: User = {
      id: data.userId.toString(),
      name: data.name,
      email: credentials.email,
      address: data.address || '',
    };

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', data.userId.toString());

    return data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const backendPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      // Backend User entity stores address as a single string
      address: formatAddress(data.address),
    };

    const response = await apiCall<AuthResponse>('/user/register', {
      method: 'POST',
      body: JSON.stringify(backendPayload),
    });

    const user: User = {
      id: response.userId.toString(),
      name: response.name,
      email: data.email,
      address: response.address || backendPayload.address,
    };

    if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', response.userId.toString());
    }

    return response;
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
  
  getUserId: (): number | null => {
      const id = localStorage.getItem('userId');
      return id ? parseInt(id) : null;
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