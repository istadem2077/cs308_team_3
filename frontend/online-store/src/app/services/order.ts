import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() {}

  // Return a list of orders for the current user
  getUserOrders(): Observable<any[]> {
    return of([
      {
        id: '1001',
        date: new Date('2025-02-03T12:45:00'),
        status: 'Processing',
        total: 129.97
      },
      {
        id: '1002',
        date: new Date('2025-02-04T09:30:00'),
        status: 'In-Transit',
        total: 89.99
      },
      {
        id: '1003',
        date: new Date('2025-02-05T15:10:00'),
        status: 'Delivered',
        total: 59.50
      }
    ]);
  }

  // Return details for a specific order
  getOrderById(id: string | null): Observable<any> {
    // You can switch on ID for more realism
    const orders: Record<string, any> = {
      '1001': {
        id: '1001',
        date: '2025-02-03T12:45:00',
        status: 'Processing',
        total: 129.97,
        items: [
          { productId: 101, productName: 'Aspirin 500mg', quantity: 2, price: 19.99 },
          { productId: 205, productName: 'Vitamin D3 1000IU', quantity: 1, price: 49.99 },
          { productId: 333, productName: 'Cough Syrup', quantity: 1, price: 39.99 }
        ]
      },
      '1002': {
        id: '1002',
        date: '2025-02-04T09:30:00',
        status: 'In-Transit',
        total: 89.99,
        items: [
          { productId: 410, productName: 'Ibuprofen', quantity: 3, price: 29.99 },
          { productId: 511, productName: 'Multivitamins', quantity: 1, price: 29.99 }
        ]
      },
      '1003': {
        id: '1003',
        date: '2025-02-05T15:10:00',
        status: 'Delivered',
        total: 59.50,
        items: [
          { productId: 601, productName: 'Antacid', quantity: 2, price: 19.99 },
          { productId: 602, productName: 'Vitamin C', quantity: 1, price: 19.52 }
        ]
      }
    };

    return of(orders[id || '1001']); // default to 1001
  }
}
