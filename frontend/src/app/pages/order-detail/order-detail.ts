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

  order: OrderDetailDto | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {

        const param = params.get('id');

        if (!param) {
          this.errorMessage = 'No order ID provided.';
          this.isLoading = false;
          return of(null);
        }

        // convert id from string ➝ number
        const orderId = Number(param);

        if (isNaN(orderId)) {
          this.errorMessage = 'Invalid order ID.';
          this.isLoading = false;
          return of(null);
        }

        this.isLoading = true;
        this.errorMessage = '';

        return this.orderService.getOrderById(orderId);
      })
    ).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Order Detail Fetch Error:', err);
        this.errorMessage = 'Failed to load order details. The order may not exist.';
        this.isLoading = false;
        this.order = null;
      }
    });
  }
}
