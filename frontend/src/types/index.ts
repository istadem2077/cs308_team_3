// src/types/index.ts

// Matches com.cs308_team_3.sabanci_pharmacy.dto.User.AuthResponse
export interface AuthResponse {
    token: string;
    name: string;
    userId: number;
    address?: string;
}

// Matches com.cs308_team_3.sabanci_pharmacy.dto.User.RegisterRequest
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: string;
}

// Matches com.cs308_team_3.sabanci_pharmacy.dto.Order.OrderItemDto
export interface OrderItemDto {
    productName: string;
    quantity: number;
    unitPrice: number; // BigDecimal -> number
    subTotal: number;  // BigDecimal -> number
}

// Matches com.cs308_team_3.sabanci_pharmacy.dto.Order.OrderResponseDto
export interface OrderResponseDto {
    orderId: number;
    orderDate: string; // LocalDateTime comes as string "2023-10-25T10:00:00"
    status: string;
    totalAmount: number;
    items: OrderItemDto[];
}

// Product (Assumed based on previous context, as ProductDto wasn't uploaded)
export interface Product {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    quantity: number;
    price: number;
    // Fields required by PDF but not in DTO yet (Frontend Mock)
    distributorInfo?: string;
    warrantyStatus?: string;
}

// Cart Item (Frontend Helper)
export interface CartItem {
    product: Product;
    quantity: number;
}