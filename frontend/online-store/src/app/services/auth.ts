import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartService } from './cart';
import { GuestCartService, LocalCartItem } from '../services/guest-cart';

// --- DTO Interfaces ---

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  userId: number;
}

export interface AddressUpdateRequest {
  id: number;
  address: string;
}

export interface PasswordUpdateRequest {
  id: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// --- Authentication Service ---

const AUTH_API_URL = '/api/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 🔥 Reactive login state shared across the entire app
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private guestCartService: GuestCartService
  ) {}

  // --- Helpers ---

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  // --- Register ---

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_API_URL}/register`, data);
  }

  // --- Login (includes the Guest Cart Merge logic) ---

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_API_URL}/login`, data).pipe(
      tap(response => {
        // Save auth info
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.userId.toString());

        // 🔥 Notify the app that login happened
        this.loggedIn.next(true);

        // --- Merge guest cart into user cart ---
        const guestItems = this.guestCartService.getCartItems();

        if (guestItems.length > 0) {
          this.mergeGuestCart(response.userId, guestItems);
        }
      })
    );
  }

  // --- Merge Guest Cart into User Cart ---

  private mergeGuestCart(userId: number, items: LocalCartItem[]): void {
    let pending = items.length;

    items.forEach(item => {
      this.cartService.addItemOrUpdate(userId, item.productId, item.quantity).subscribe({
        next: () => {
          pending--;
          if (pending === 0) this.guestCartService.clearCart();
        },
        error: err => {
          console.error(`Failed merging product ${item.productId}`, err);
          pending--;
          if (pending === 0) this.guestCartService.clearCart();
        }
      });
    });
  }

  // --- Profile Management ---

  updateAddress(data: AddressUpdateRequest): Observable<any> {
    return this.http.post<any>(`${AUTH_API_URL}/mod-address`, data);
  }

  updatePassword(data: PasswordUpdateRequest): Observable<any> {
    return this.http.post<any>(`${AUTH_API_URL}/passwd-upd`, data);
  }

  // --- Logout ---

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.loggedIn.next(false);   // 🔥 Logout event for navbar etc.
  }
}
