import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, of, switchMap } from 'rxjs';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { GuestCartService } from '../../services/guest-cart';
import { AuthService } from '../../services/auth';

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
    private auth: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (!id) {
            this.error = 'No product found.';
            this.loading = false;
            return of(null);
          }

          return this.productService.getProductById(+id).pipe(
            catchError(() => {
              this.error = 'Product not found.';
              this.loading = false;
              return of(null);
            })
          );
        })
      )
      .subscribe(product => {
        this.product = product;
        this.loading = false;
      });
  }

  // ADD ITEM TO CART
  addToCart(): void {
    if (!this.product) return;

    if (this.quantity < 1 || this.quantity > this.product.quantity) {
      this.error = 'Invalid quantity';
      return;
    }

    this.error = '';
    this.addedToCartMessage = '';

    const userId = this.auth.getUserId();

    // Guest user → LocalStorage
    if (!userId) {
      this.guestCart.addItem(this.product.id, this.quantity);
      this.addedToCartMessage = 'Added to cart!';
      setTimeout(() => this.router.navigate(['/cart']), 700);
      return;
    }

    // Logged-in user → Backend
    this.cartService.addItemOrUpdate(userId, this.product.id, this.quantity)
      .pipe(
        catchError(err => {
          console.error('Cart update failed', err);
          this.error = 'Unable to add item.';
          return of(null);
        })
      )
      .subscribe(() => {
        this.addedToCartMessage = 'Added to cart!';
        setTimeout(() => this.router.navigate(['/cart']), 700);
      });
  }

  updateQuantity(event: Event): void {
    const input = event.target as HTMLInputElement;
    let q = parseInt(input.value, 10);

    if (isNaN(q) || q < 1) q = 1;
    if (this.product && q > this.product.quantity) q = this.product.quantity;

    this.quantity = q;
  }
}
