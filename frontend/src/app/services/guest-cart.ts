import { Injectable } from '@angular/core';

export interface LocalCartItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class GuestCartService {
  private cartKey = 'guest_cart';

  // Get items from local storage
  getCartItems(): LocalCartItem[] {
    const cartJson = localStorage.getItem(this.cartKey);
    try {
      return JSON.parse(cartJson || '[]');
    } catch (e) {
      console.error('Error parsing guest cart from localStorage', e);
      return [];
    }
  }

  // Save items to local storage
  private saveCart(cart: LocalCartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  // 🔥 Add full working addItem() method
  addItem(productId: number, quantity: number = 1): void {
    const cart = this.getCartItems();
    let item = cart.find(x => x.productId === productId);

    if (item) {
      // Increase quantity
      item.quantity += quantity;
    } else {
      // Add new item
      cart.push({ productId, quantity });
    }

    this.saveCart(cart);
  }
  

  // Set a NEW quantity (replace)
  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCartItems();
    let item = cart.find(x => x.productId === productId);

    if (item) {
      item.quantity = quantity;
    } else if (quantity > 0) {
      cart.push({ productId, quantity });
    }

    this.saveCart(cart.filter(x => x.quantity > 0));
  }

  // Remove item
  removeItem(productId: number): void {
    const updated = this.getCartItems().filter(x => x.productId !== productId);
    this.saveCart(updated);
  }

  // Clear cart
  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }
}
