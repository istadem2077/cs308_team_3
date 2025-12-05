import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, of, switchMap } from 'rxjs';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { GuestCartService } from '../../services/guest-cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  
  product: Product | null = null;
  loading = true;
  error = '';
  quantity = 1;

  addedToCartMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private guestCart: GuestCartService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const productId = params.get('id');
        if (!productId) {
          this.error = 'No product ID provided.';
          this.loading = false;
          return of(null);
        }
        return this.productService.getProductById(+productId).pipe(
          catchError(err => {
            console.error('Failed to load product:', err);
            this.error = 'Product not found.';
            this.loading = false;
            return of(null);
          })
        );
      })
    ).subscribe(product => {
      this.product = product;
      this.loading = false;
    });
  }

  addToCart(): void {
    if (!this.product) return;

    if (this.quantity <= 0 || this.quantity > this.product.quantity) {
      this.error = 'Invalid quantity.';
      return;
    }

    this.error = '';
    this.addedToCartMessage = '';

    const userId = localStorage.getItem('userId');

    // 🔥 If user is logged in → use API cart
    if (userId) {
      this.cartService.addItemOrUpdate(+userId, this.product.id, this.quantity)
        .pipe(
          catchError(err => {
            console.error('Cart error:', err);
            this.error = 'Could not update cart.';
            return of(null);
          })
        )
        .subscribe(() => {
          this.addedToCartMessage = 'Added to cart!';
          setTimeout(() => this.router.navigate(['/cart']), 700);
        });

      return;
    }

    // 🔥 Guest user → Use local storage guest cart
    this.guestCart.addItem(this.product.id, this.quantity);

    this.addedToCartMessage = 'Added to cart!';
    setTimeout(() => this.router.navigate(['/cart']), 700);
  }

  updateQuantity(event: Event): void {
    const input = event.target as HTMLInputElement;
    let qty = parseInt(input.value, 10);

    if (isNaN(qty) || qty < 1) qty = 1;
    if (this.product && qty > this.product.quantity) qty = this.product.quantity;

    this.quantity = qty;
  }
}
