import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  useMockData = true; // toggle this: true = mock, false = real data

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    if (this.useMockData) {
      this.cartItems = [
        { productId: 101, name: 'Aspirin 500mg', quantity: 2, price: 19.99 },
        { productId: 205, name: 'Vitamin D3 1000IU', quantity: 1, price: 49.99 },
        { productId: 333, name: 'Cough Syrup', quantity: 3, price: 9.99 }
      ];
    } else {
      this.cartItems = this.cartService.getCartItems();
    }
  }

  changeQuantity(item: any, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(item);
      return;
    }

    if (this.useMockData) {
      const target = this.cartItems.find(ci => ci.productId === item.productId);
      if (target) target.quantity = quantity;
    } else {
      this.cartService.updateQuantity(item.productId, quantity);
    }
  }

  removeItem(item: any) {
    if (this.useMockData) {
      this.cartItems = this.cartItems.filter(ci => ci.productId !== item.productId);
    } else {
      this.cartService.removeItem(item.productId);
      this.loadCart(); // reload real data from service
    }
  }
}
