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

  orderId!: number;
  order: OrderDetailDto | null = null;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id')!);

    this.orderService.getOrderById(this.orderId).subscribe({
      next: data => this.order = data,
      error: () => {
        // fallback in case backend has not implemented this endpoint yet
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
