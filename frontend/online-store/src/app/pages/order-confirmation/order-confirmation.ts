import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.html',
  styleUrls: ['./order-confirmation.css']
})
export class OrderConfirmationComponent implements OnInit {
  orderId!: string;
  order: any;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getOrderById(this.orderId).subscribe(data => {
      // fallback mock order if none returned
      this.order = data ?? {
        id: this.orderId,
        date: '2025-02-03T12:45:00',
        status: 'Processing',
        total: 42,
        items: [
          { productName: 'Aspirin', quantity: 2, price: 20 }
        ]
      };
    });
  }
}
