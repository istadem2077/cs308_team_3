package com.cs308_team_3.sabanci_pharmacy.dto.Support;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerContextDto {
    private String customerName;
    private String email;
    private int openOrdersCount;
    private String lastOrderStatus;
    private int cartItemCount;
    // You can add a list of wishlist items here too
}
