import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderResponseDto {
  orderId: number;
  orderDate: string; // ISO 8601 date string
  status: string;    // e.g., 'Processing', 'Delivered'
  totalAmount: number;
}

// Interface representing a single item within an order.
export interface OrderItemDto {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

// Interface representing the full details of a specific order.
export interface OrderDetailDto extends OrderResponseDto {
  shippingAddress: string;
  items: OrderItemDto[];
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