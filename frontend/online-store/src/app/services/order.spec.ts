import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderService } from './order';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService, // Explicitly provide the service being tested
        provideHttpClientTesting() // Use the modern way to set up HTTP testing
      ]
    });
    // HttpClientTestingModule is no longer needed in imports
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a getUserOrders method', () => {
    expect(service.getUserOrders).toBeDefined();
  });

  it('should have an getOrderById method', () => {
    expect(service.getOrderById).toBeDefined();
  });
});