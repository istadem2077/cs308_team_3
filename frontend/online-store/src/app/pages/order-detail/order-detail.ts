import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService, OrderDetailDto } from '../../services/order';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css']
})
export class OrderDetailComponent implements OnInit {

  // Will hold the fetched order details
  order: OrderDetailDto | null = null;

  // Controls the loading spinner in the UI
  isLoading: boolean = true;

  // Stores any error message to show on the page
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {

    // Listen for route param changes, get order ID, then fetch order details
    this.route.paramMap.pipe(
      switchMap(params => {

        const param = params.get('id');

        // If no ID is present in the URL
        if (!param) {
          this.errorMessage = 'No order ID provided.';
          this.isLoading = false;
          return of(null);
        }

        // Convert the ID from a string to a number
        const orderId = Number(param);

        // If conversion fails → ID is not numeric
        if (isNaN(orderId)) {
          this.errorMessage = 'Invalid order ID.';
          this.isLoading = false;
          return of(null);
        }

        // Reset UI state since a valid request will be made
        this.isLoading = true;
        this.errorMessage = '';

        // Fetch the order details from backend
        return this.orderService.getOrderById(orderId);
      })
    ).subscribe({
      next: (data) => {
        // Successfully received order details
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        // Handle any API or network error
        console.error('Order Detail Fetch Error:', err);
        this.errorMessage = 'Failed to load order details. The order may not exist.';
        this.isLoading = false;
        this.order = null;
      }
    });
  }
}
