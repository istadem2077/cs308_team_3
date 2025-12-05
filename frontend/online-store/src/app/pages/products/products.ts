import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { GuestCartService } from '../../services/guest-cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent implements OnInit {  
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private guestCart: GuestCartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: data => this.products = data,
      error: () => console.error('Failed load products')
    });
  }
  
  viewDetails(product: Product) {
    this.router.navigate(['/product-detail', product.id]);
  }

  // ADD PRODUCT TO CART
  addToCart(product: Product): void {
    const userId = this.auth.getUserId();

    // 🚀 If NOT logged in — add to GUEST CART
    if (!userId) {
      this.guestCart.addItem(product.id, 1);
      alert(`${product.name} added to guest cart`);
      return;
    }

    // 🚀 If logged in — API call
    this.cartService.addItemOrUpdate(userId, product.id, 1).subscribe({
      next: () => alert(`${product.name} added to your cart`),
      error: err => console.error('Failed adding to cart', err)
    });
  }
}
