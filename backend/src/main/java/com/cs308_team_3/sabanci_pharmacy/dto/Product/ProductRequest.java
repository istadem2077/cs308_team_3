package com.cs308_team_3.sabanci_pharmacy.dto.Product;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String imageUrl;
    private Integer quantity; // Backend uses 'quantity', Frontend sends this mapped from 'stockCount'
    private BigDecimal price;
    private String category;  // Accepts the category NAME as a String
    private boolean requiresPrescription;
}
