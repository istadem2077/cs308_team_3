import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe(data => {
      this.orders = data;
    });
  }
}
