import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number; // backend field
  category: Category;
}

const PRODUCT_API_URL = '/api/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private USE_MOCK = false; // TURN OFF mock mode

  private mockProducts: Product[] = [
    {
      id: 101,
      name: 'Aspirin 500mg',
      description: 'Pain relief tablets.',
      price: 12.99,
      imageUrl: '',
      quantity: 120,
      category: { id: 1, name: 'Pain Relief' }
    }
  ];

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    if (this.USE_MOCK) return of(this.mockProducts);
    return this.http.get<Product[]>(PRODUCT_API_URL);
  }

  getProductById(id: number): Observable<Product> {
    if (this.USE_MOCK) {
      return of(this.mockProducts.find(p => p.id === id)!);
    }
    return this.http.get<Product>(`${PRODUCT_API_URL}/${id}`);
  }
  // Create product (real API only)
  createProduct(product: Omit<Product, 'id' | 'category'> & { categoryId: number }): Observable<Product> {
    return this.http.post<Product>(PRODUCT_API_URL, product);
  }

  // Delete product (real API only)
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${PRODUCT_API_URL}/${id}`);
  }
}
