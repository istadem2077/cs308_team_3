import { Component } from '@angular/core';
import { PRODUCTS } from '../../data/products';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent {
  products = PRODUCTS;

  constructor(private router: Router) {}

  viewDetails(product: any) {
    this.router.navigate(['/product-detail', product.id]);
  }
}
