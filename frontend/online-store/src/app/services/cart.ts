import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';

export interface CartRequest {
  userId: number;
  productId: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

const CART_API_URL = '/api/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) {}

  /** ✔ Matches: GET /api/cart/{userId} */
  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${CART_API_URL}/${userId}`);
  }

  /** ✔ Matches: POST /api/cart/add */
  addItemOrUpdate(userId: number, productId: number, quantity: number): Observable<Cart> {
    const body: CartRequest = { userId, productId, quantity };
    return this.http.post<Cart>(`${CART_API_URL}/add`, body);
  }

  /** ✔ Matches: POST /api/cart/remove */
  removeItem(userId: number, productId: number): Observable<Cart> {
    const body: CartRequest = { userId, productId, quantity: 1 };
    return this.http.post<Cart>(`${CART_API_URL}/remove`, body);
  }

  /** ✔ Matches: DELETE /api/cart/{userId} */
  clearCart(userId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${CART_API_URL}/${userId}`);
  }

  /** ✔ Matches: POST /api/cart/checkout/{userId} */
  checkout(userId: number): Observable<any> {
    return this.http.post<any>(`${CART_API_URL}/checkout/${userId}`, {});
  }
}
