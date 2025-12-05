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
    this.fetchOrders();
  }

  fetchOrders(): void {
    const userId = this.authService.getUserId(); // Get ID from AuthService

    // If userId is null, we display the login prompt message
    if (userId === null) {
      this.errorMessage = "Please log in to view your order history.";
      return;
    }
    
    this.isLoading = true;
    
    // Call the correct API method from the OrderService
    this.orderService.getUserOrders(userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
        // console.log('Fetched Orders:', data); // Debugging
      },
      error: (err) => {
        this.errorMessage = 'Failed to load order history. Please try again.';
        this.isLoading = false;
        console.error('Order Fetch Error:', err);
      }
    });
  }
}