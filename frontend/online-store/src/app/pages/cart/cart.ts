// import { Component, OnInit } from '@angular/core';
// import { CartService, CartItem, Cart } from '../../services/cart';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './cart.html',
//   styleUrls: ['./cart.css']
// })
// export class CartComponent implements OnInit {

//   cartItems: CartItem[] = [];
//   useMockData = true; // toggle mock vs real API
//   userId = 1; // TODO: Replace with actual logged-in user ID

//   constructor(private cartService: CartService) {}

//   ngOnInit(): void {
//     this.loadCart();
//   }

//   // Load from API or use mock data
//   loadCart(): void {
//     if (this.useMockData) {
//       this.cartItems = [
//         {
//           id: 1,
//           quantity: 2,
//           product: {
//             id: 101,
//             name: 'Aspirin 500mg',
//             price: 19.99,
//             description: 'Pain relief medication.',
//             imageUrl: '',
//             quantity: 100,
//             category: { id: 1, name: 'Pain Relief' }
//           }
//         },
//         {
//           id: 2,
//           quantity: 1,
//           product: {
//             id: 205,
//             name: 'Vitamin D3 1000IU',
//             price: 49.99,
//             description: 'Daily vitamin D supplement.',
//             imageUrl: '',
//             quantity: 100,
//             category: { id: 2, name: 'Vitamins' }
//           }
//         },
//         {
//           id: 3,
//           quantity: 3,
//           product: {
//             id: 333,
//             name: 'Cough Syrup',
//             price: 9.99,
//             description: 'Cough relief syrup.',
//             imageUrl: '',
//             quantity: 50,
//             category: { id: 3, name: 'Cold & Flu' }
//           }
//         }
//       ];
//       return;
//     }

//     this.cartService.getCart(this.userId).subscribe({
//       next: (cart: Cart) => {
//         this.cartItems = cart.items;
//       },
//       error: err => console.error('Failed to load cart:', err)
//     });
//   }

//   // Update item quantity
//   changeQuantity(item: CartItem, quantity: number): void {
//     if (quantity <= 0) {
//       this.removeItem(item);
//       return;
//     }

//     if (this.useMockData) {
//       const target = this.cartItems.find(ci => ci.id === item.id);
//       if (target) target.quantity = quantity;
//       return;
//     }

//     this.cartService
//       .addItemOrUpdate(this.userId, item.product.id, quantity)
//       .subscribe({
//         next: () => this.loadCart(),
//         error: err => console.error('Failed to update quantity:', err)
//       });
//   }

//   // Remove a product from the cart
//   removeItem(item: CartItem): void {
//     if (this.useMockData) {
//       this.cartItems = this.cartItems.filter(ci => ci.id !== item.id);
//       return;
//     }

//     this.cartService.removeItem(this.userId, item.product.id).subscribe({
//       next: () => this.loadCart(),
//       error: err => console.error('Failed to remove item:', err)
//     });
//   }
// }

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

  cartItems: CartItem[] = [];

  constructor(
    private productService: ProductService,
    private guestCart: GuestCartService
  ) {}

  ngOnInit(): void {
    this.loadGuestCart();
  }

  // 🔥 Load guest cart + merge with mock products
  loadGuestCart(): void {
    const guestItems = this.guestCart.getCartItems(); // [{ productId, qty }]

    this.productService.getAllProducts().subscribe(products => {
      this.cartItems = guestItems
        .map(gi => {
          const product = products.find(p => p.id === gi.productId);
          if (!product) return null;

          return {
            id: gi.productId,
            quantity: gi.quantity,
            product: product
          } as CartItem;
        })
        .filter(x => x !== null) as CartItem[];
    });
  }

  // Update quantity
  changeQuantity(item: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(item);
      return;
    }

    this.guestCart.updateQuantity(item.product.id, quantity);
    this.loadGuestCart();
  }

  // Remove from cart
  removeItem(item: CartItem): void {
    this.guestCart.removeItem(item.product.id);
    this.loadGuestCart();
  }
}
