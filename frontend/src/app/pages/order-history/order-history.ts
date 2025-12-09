import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Required for standalone component
import { RouterModule } from '@angular/router'; // Required for standalone component
import { OrderService, OrderResponseDto } from '../../services/order';
import { AuthService } from '../../services/auth'; // Used to fetch the logged-in user ID

@Component({
  selector: 'app-order-history',
  standalone: true, // Making it a modern Angular standalone component
  imports: [CommonModule, RouterModule, DatePipe], // Required Angular imports
  templateUrl: './order-history.html', // Now pointing to the separate HTML file
  styleUrls: ['./order-history.css'] // Now pointing to the separate CSS file
})
export class OrderHistoryComponent implements OnInit {
  
  orders: OrderResponseDto[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService // <-- Inject AuthService to get userId
  ) { }

  ngOnInit(): void {
  const userId = this.authService.getUserId();

  if (!userId) {
    this.errorMessage = "Please log in to view your order history.";
    return;
  }

  this.fetchOrders(userId);
}

  fetchOrders(userId: number): void {
    this.isLoading = true;
    this.orderService.getUserOrders(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Failed to load order history.";
        this.isLoading = false;
      }
    });
  }
}