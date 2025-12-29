import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderResponseDto {
  orderId: number;
  orderDate: string; // ISO 8601 date string
  status: string;    // e.g., 'Processing', 'Delivered'
  totalAmount: number;
  items?: OrderItemDto[]; // Optional items for order history
}

// Interface representing a single item within an order.
export interface OrderItemDto {
  productName: string;
  quantity: number;
  unitPrice: number; // Backend uses unitPrice
  subTotal: number;  // Backend uses subTotal
}

// Interface representing the full details of a specific order.
export interface OrderDetailDto extends OrderResponseDto {
  shippingAddress?: string; // Optional, backend may not include this
  items: OrderItemDto[]; // Required for order details
}

const ORDER_API_URL = '/api/orders'; // Base URL for the OrderController

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  constructor(private http: HttpClient) {}

  getUserOrders(userId: number): Observable<OrderResponseDto[]> {
    return this.http.get<OrderResponseDto[]>(`${ORDER_API_URL}/user/${userId}`);
  }

  getOrderById(orderId: string | number): Observable<OrderDetailDto> {
    return this.http.get<OrderDetailDto>(`${ORDER_API_URL}/${orderId}`);
  }
}