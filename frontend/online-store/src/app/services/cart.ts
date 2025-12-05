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
  product: Product; // Full product detail object
}

export interface Cart {
  id: number;
  items: CartItem[];
}

// --- Cart Service ---

const CART_API_URL = '/api/cart'; // Base URL for the CartController

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  // Retrieves the current cart for a specific user ID.
  getCart(userId: number): Observable<Cart> {
    // The API documentation specified this as a POST, we adhere to that.
    return this.http.post<Cart>(`${CART_API_URL}/${userId}`, {}); 
  }

  // Used for adding a new item or updating the total quantity of an existing item.
  addItemOrUpdate(userId: number, productId: number, quantity: number): Observable<Cart> {
    const data: CartRequest = { userId, productId, quantity };
    return this.http.post<Cart>(`${CART_API_URL}/add`, data);
  }

  // We set quantity to 1, assuming the backend logic handles the removal by product ID.
  removeItem(userId: number, productId: number): Observable<Cart> {
    const data: CartRequest = { userId, productId, quantity: 1 };
    return this.http.post<Cart>(`${CART_API_URL}/remove`, data);
  }

  // Clears all items from the user's cart.
  clearCart(userId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${CART_API_URL}/${userId}`);
  }

  // Converts the cart into an order and returns the new Order object.
  checkout(userId: number): Observable<any> {
    // Returns the created Order object (we use 'any' since Order is defined in order.ts)
    return this.http.post<any>(`${CART_API_URL}/checkout/${userId}`, {});
  }
}