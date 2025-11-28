import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'guest_cart';

  // getCartItems() {
  //   return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  // }

  getCartItems() {
    return [
      { productId: 1, name: 'Aspirin', quantity: 2 },
      { productId: 2, name: 'Vitamin C', quantity: 1 },
    ];
  }


  updateQuantity(productId: string, quantity: number) {
    const cart = this.getCartItems();
    const item = cart.find((x: any) => x.productId === productId);
    if (item) item.quantity = quantity;
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  removeItem(productId: string) {
    let cart = this.getCartItems();
    cart = cart.filter((x: any) => x.productId !== productId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }
}
