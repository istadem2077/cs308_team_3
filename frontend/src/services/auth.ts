import { User } from './api';

const API_BASE_URL = 'http://localhost:8080/api';

export interface AuthResponse {
  token: string;
  name: string;
  userId: number;
  address: string;
}

// Turkish Cities List (Kept as is...)
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

export const authService = {
  // Login
  login: async (credentials: {email: string, password: string}): Promise<AuthResponse> => {
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
    localStorage.setItem('userId', data.userId.toString()); // Store ID separately for easy access
    localStorage.setItem('user', JSON.stringify({
      id: data.userId.toString(),
      name: data.name,
      email: credentials.email,
      address: data.address
    }));
    return data;
  },

  // Register
  register: async (userData: any): Promise<AuthResponse> => {
    // Backend RegisterRequest expects: 
    // { name, email, password, confirmPassword, gender, phone, age, addressLine, city, province, zipCode }
    
    // Ensure numeric types are numbers
    const payload = {
        ...userData,
        age: parseInt(userData.age),
        phone: parseInt(userData.phone) // Backend uses BigInteger, JS number usually fine for simple check
    };

    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
       const errText = await response.text();
       throw new Error(errText || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId.toString());
    localStorage.setItem('user', JSON.stringify({
      id: data.userId.toString(),
      name: data.name,
      email: userData.email,
      address: data.address
    }));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/login';
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

  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};