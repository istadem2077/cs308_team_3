// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// // Interface for the Category object nested within a Product response.
// export interface Category {
//   id: number;
//   name: string;
// }

// // Interface for the Product data object
// export interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   quantity: number; // Changed from 'stock' to 'quantity' based on user input
//   category: Category;
// }

// const PRODUCT_API_URL = '/api/products'; // Base URL for the ProductController

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {

//   constructor(private http: HttpClient) {}

//   /**
//    * Retrieves all products from the catalogue.
//    * Endpoint: GET /api/products
//    */
//   getAllProducts(): Observable<Product[]> {
//     return this.http.get<Product[]>(PRODUCT_API_URL);
//   }

//   /**
//    * Retrieves a single product by its ID.
//    * Endpoint: GET /api/products/{id}
//    */
//   getProductById(id: number): Observable<Product> {
//     return this.http.get<Product>(`${PRODUCT_API_URL}/${id}`);
//   }

//   /**
//    * Creates a new product with the provided details.
//    * Note: Uses Omit utility type to ensure 'id' and 'category' are not passed directly, 
//    * but 'categoryId' is required for the backend.
//    * Endpoint: POST /api/products
//    */
//   createProduct(product: Omit<Product, 'id' | 'category'> & { categoryId: number }): Observable<Product> {
//     // Assuming the backend expects the product details for creation.
//     return this.http.post<Product>(PRODUCT_API_URL, product);
//   }

//   /**
//    * Deletes a product by its ID (typically restricted to Admin roles).
//    * Endpoint: DELETE /api/products/{id}
//    */
//   deleteProduct(id: number): Observable<void> {
//     return this.http.delete<void>(`${PRODUCT_API_URL}/${id}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Category model
export interface Category {
  id: number;
  name: string;
}

// Product model
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category: Category;
}

const PRODUCT_API_URL = '/api/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // 🔥 Toggle mock data ON/OFF
  private USE_MOCK = true;

  // 🔥 MOCK PRODUCT LIST
  private mockProducts: Product[] = [
    {
      id: 101,
      name: 'Aspirin 500mg',
      description: 'Pain relief tablets.',
      price: 12.99,
      imageUrl: 'https://dummyimage.com/200x200/cccccc/000&text=Aspirin',
      quantity: 120,
      category: { id: 1, name: 'Pain Relief' }
    },
    {
      id: 102,
      name: 'Vitamin C 1000mg',
      description: 'Immune boosting vitamin supplement.',
      price: 24.50,
      imageUrl: 'https://dummyimage.com/200x200/cccccc/000&text=Vitamin+C',
      quantity: 200,
      category: { id: 2, name: 'Vitamins' }
    },
    {
      id: 103,
      name: 'Cough Syrup',
      description: 'Relieves cough and cold symptoms.',
      price: 9.99,
      imageUrl: 'https://dummyimage.com/200x200/cccccc/000&text=Cough+Syrup',
      quantity: 80,
      category: { id: 3, name: 'Cold & Flu' }
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * GET ALL PRODUCTS
   * If USE_MOCK = true → returns mock products instead of API call.
   */
  getAllProducts(): Observable<Product[]> {
    if (this.USE_MOCK) {
      return of(this.mockProducts);
    }
    return this.http.get<Product[]>(PRODUCT_API_URL);
  }

  /**
   * GET PRODUCT BY ID
   * Uses mock data if mock mode is active.
   */
  getProductById(id: number): Observable<Product> {
    if (this.USE_MOCK) {
      const product = this.mockProducts.find(p => p.id === id)!;
      return of(product);
    }
    return this.http.get<Product>(`${PRODUCT_API_URL}/${id}`);
  }

  /**
   * Create product (real API only)
   */
  createProduct(product: Omit<Product, 'id' | 'category'> & { categoryId: number }): Observable<Product> {
    return this.http.post<Product>(PRODUCT_API_URL, product);
  }

  /**
   * Delete product (real API only)
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${PRODUCT_API_URL}/${id}`);
  }
}
