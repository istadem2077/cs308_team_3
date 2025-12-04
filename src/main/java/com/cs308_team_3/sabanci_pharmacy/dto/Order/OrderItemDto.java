package com.cs308_team_3.sabanci_pharmacy.dto.Order;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal; // Calculated field (price * quantity)
}
