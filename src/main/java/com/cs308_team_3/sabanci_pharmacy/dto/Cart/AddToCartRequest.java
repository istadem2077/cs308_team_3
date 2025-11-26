package com.cs308_team_3.sabanci_pharmacy.dto.Cart;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Integer userId;
    private Integer productId;
    private Integer quantity;
}
