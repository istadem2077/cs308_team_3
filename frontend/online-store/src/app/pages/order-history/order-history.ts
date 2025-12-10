import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Required for standalone component features
import { RouterModule } from '@angular/router'; // Needed for routerLink, router directives
import { OrderService, OrderResponseDto } from '../../services/order';
import { AuthService } from '../../services/auth'; // Used to check which user is logged in

@Component({
  selector: 'app-order-history',
  standalone: true, // This component does not rely on an Angular module
  imports: [CommonModule, RouterModule, DatePipe], // All modules required for the template
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit {
  
  // List of orders returned by the backend
  orders: OrderResponseDto[] = [];

  // Used to show a loading spinner while data is being fetched
  isLoading: boolean = false;

  // Displays a friendly message if something goes wrong
  errorMessage: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    // Get the logged-in user's ID
    const userId = this.authService.getUserId();

    // If no user is logged in, stop here and show a message
    if (!userId) {
      this.errorMessage = "Please log in to view your order history.";
      return;
    }

    // If user exists, load their orders
    this.fetchOrders(userId);
  }

  // Fetch the user's order history from the backend
  fetchOrders(userId: number): void {
    this.isLoading = true; // Show loading indicator

    this.orderService.getUserOrders(userId).subscribe({
      next: (orders) => {
        // Successfully fetched orders
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => {
        // Something went wrong (network error, backend error, etc.)
        this.errorMessage = "Failed to load order history.";
        this.isLoading = false;
      }
    });
  }
}
