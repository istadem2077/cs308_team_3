import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, OrderDetailDto } from '../../services/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.html',
  styleUrls: ['./order-confirmation.css']
})
export class OrderConfirmationComponent implements OnInit {

  // The ID of the order we are displaying
  orderId!: number;

  // Full order details once loaded
  order: OrderDetailDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Get the order ID from the URL / route parameters
    this.orderId = Number(this.route.snapshot.paramMap.get('id')!);

    // Request order details from backend using the order ID
    this.orderService.getOrderById(this.orderId).subscribe({
      next: data => {
        // Successfully received order data
        this.order = data;
      },
      error: () => {
        // If the API isn't ready yet, use a temporary fallback
        // This keeps the UI functional while backend is incomplete
        this.order = {
          orderId: this.orderId,
          orderDate: new Date().toISOString(),
          status: 'Processing',
          totalAmount: 42,
          shippingAddress: 'N/A',
          items: [
            { productId: 1, productName: 'Aspirin', quantity: 2, price: 20 }
          ]
        };
      }
    });
  }
}
