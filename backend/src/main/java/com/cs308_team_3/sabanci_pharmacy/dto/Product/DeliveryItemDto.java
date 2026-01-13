package com.cs308_team_3.sabanci_pharmacy.dto.Product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryItemDto {
    private Integer deliveryId;      // Maps to Order ID
    private Integer customerId;
    private Integer productId;
    private String productName;      // Added for convenience
    private Integer quantity;
    private BigDecimal totalPrice;   // Unit Price * Quantity
    private String deliveryAddress;  // Full address string
    private String status;           // PENDING, SHIPPED, DELIVERED
}
