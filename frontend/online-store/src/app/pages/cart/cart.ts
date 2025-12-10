import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../services/cart';
import { ProductService, Product } from '../../services/product';
import { GuestCartService } from '../../services/guest-cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {

  // List of items currently shown in the cart
  cartItems: CartItem[] = [];

  constructor(
    private productService: ProductService,
    private guestCart: GuestCartService
  ) {}

  ngOnInit(): void {
    // Load the cart as soon as the component appears
    this.loadGuestCart();
  }

  // Loads all items in the guest cart and attaches product details
  loadGuestCart(): void {
    // Get raw guest cart items (only contain productId + quantity)
    const guestItems = this.guestCart.getCartItems();

    // Fetch all available products so we can match them
    this.productService.getAllProducts().subscribe(products => {
      this.cartItems = guestItems
        .map(gi => {
          // Find the product that matches the cart item
          const product = products.find(p => p.id === gi.productId);
          if (!product) return null; // Ignore anything that doesn't match

          // Build a full CartItem with product details
          return {
            id: gi.productId,
            quantity: gi.quantity,
            product: product
          } as CartItem;
        })
        .filter(x => x !== null) as CartItem[];
    });
  }

  // Change the quantity of an item in the cart
  changeQuantity(item: CartItem, quantity: number): void {
    // If quantity goes to zero or lower, remove it entirely
    if (quantity <= 0) {
      this.removeItem(item);
      return;
    }

    // Update the stored cart and reload view
    this.guestCart.updateQuantity(item.product.id, quantity);
    this.loadGuestCart();
  }

  // Completely remove an item from the cart
  removeItem(item: CartItem): void {
    this.guestCart.removeItem(item.product.id);
    this.loadGuestCart(); // Refresh cart display
  }
}
