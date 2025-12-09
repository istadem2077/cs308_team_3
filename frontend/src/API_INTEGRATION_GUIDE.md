# API Integration Guide

This guide explains how to connect the Sabanci University Pharmacy website to your backend API endpoints.

## Configuration

### 1. Update API Base URL and Credentials

Edit `/services/api.ts` and update these constants:

```typescript
const API_BASE_URL = 'https://your-api-endpoint.com/api';
const API_KEY = 'YOUR_API_KEY_HERE';
```

Replace with your actual backend URL and API key.

## API Endpoints Reference

### Products API

#### GET /products
Fetch all products
```typescript
const products = await productsAPI.getAll();
```

Expected Response:
```json
[
  {
    "id": "1",
    "name": "Paracetamol 500mg",
    "category": "pain relief",
    "price": 45.00,
    "image": "https://...",
    "description": "...",
    "inStock": true,
    "requiresPrescription": false
  }
]
```

#### GET /products/:id
Get product by ID
```typescript
const product = await productsAPI.getById('1');
```

#### GET /products/search?q=query
Search products
```typescript
const results = await productsAPI.search('paracetamol');
```

#### GET /products/category/:category
Filter by category
```typescript
const products = await productsAPI.getByCategory('vitamins');
```

### Orders API

#### POST /orders
Create a new order
```typescript
const orderData: OrderData = {
  name: 'Student Name',
  email: 'student@sabanciuniv.edu',
  phone: '+90 555 123 4567',
  dormitory: 'A Block',
  roomNumber: '301',
  notes: 'Please call on arrival',
  items: cartItems,
  totalPrice: 450.00,
  prescriptionFile: file // Optional File object
};

const response = await ordersAPI.create(orderData);
```

Expected Response:
```json
{
  "orderId": "ORD-12345",
  "status": "confirmed",
  "estimatedDelivery": "2-4 hours",
  "totalPrice": 450.00
}
```

#### GET /orders/:orderId
Get order details
```typescript
const order = await ordersAPI.getById('ORD-12345');
```

#### GET /orders/history
Get user's order history
```typescript
const orders = await ordersAPI.getHistory();
```

### Cart API (Optional - for server-side cart persistence)

#### POST /cart
Save cart to server
```typescript
await cartAPI.save(cartItems);
```

#### GET /cart
Load cart from server
```typescript
const savedCart = await cartAPI.load();
```

### User API

#### GET /user/profile
Get current user profile
```typescript
const user = await userAPI.getProfile();
```

Expected Response:
```json
{
  "id": "1",
  "name": "Student Name",
  "email": "student@sabanciuniv.edu",
  "phone": "+90 555 123 4567",
  "dormitory": "A Block",
  "roomNumber": "301"
}
```

#### PUT /user/profile
Update user profile
```typescript
await userAPI.updateProfile({
  name: 'New Name',
  phone: '+90 555 999 8888'
});
```

### Prescription Upload API

#### POST /prescriptions/upload
Upload prescription file
```typescript
const result = await prescriptionAPI.upload(file, orderId);
```

Expected Response:
```json
{
  "url": "https://storage.example.com/prescriptions/..."
}
```

### Inventory API

#### GET /inventory/:productId
Check stock availability
```typescript
const stock = await inventoryAPI.checkStock('1');
```

Expected Response:
```json
{
  "inStock": true,
  "quantity": 50
}
```

## Implementation Steps

### Step 1: Replace Mock Functions

In `/services/api.ts`, uncomment the real API calls and comment out the mock implementations:

```typescript
// Before (Mock):
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    // const products = await import('../data/products');
    // return new Promise(resolve => setTimeout(() => resolve(products), 500));
  }
}

// After (Real API):
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    return apiCall<Product[]>('/products');
  }
}
```

### Step 2: Handle Authentication

If your API requires authentication, update the `apiCall` function:

```typescript
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get auth token from localStorage or session
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  
  // ... rest of the function
}
```

### Step 3: Error Handling

The API calls already include error handling. Customize error messages as needed:

```typescript
try {
  const data = await productsAPI.getAll();
  // Success
} catch (error) {
  // Error is already logged
  // Show user-friendly message
  console.error('Failed to fetch products:', error);
}
```

### Step 4: File Upload Implementation

For prescription uploads, the real implementation uses FormData:

```typescript
export const prescriptionAPI = {
  upload: async (file: File, orderId: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('orderId', orderId);
    
    return apiCall<{ url: string }>('/prescriptions/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
};
```

## Testing

### Test with Mock Data
The current implementation uses mock data with simulated delays to test the UI.

### Test with Real API
1. Update `API_BASE_URL` and `API_KEY`
2. Uncomment real API calls
3. Test each feature:
   - Product browsing
   - Search
   - Add to cart
   - Checkout flow
   - Order submission

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement proper CORS on your backend
- Validate all user inputs on the backend
- Encrypt sensitive data (especially prescriptions)
- Use HTTPS for all API calls

## Environment Variables (Recommended)

Create a `.env` file:

```env
VITE_API_BASE_URL=https://your-api.com/api
VITE_API_KEY=your_api_key_here
```

Then update `/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
```

## Support

For questions or issues with the API integration:
1. Check the browser console for error messages
2. Verify API endpoint URLs
3. Test endpoints with tools like Postman
4. Ensure CORS is properly configured on your backend
