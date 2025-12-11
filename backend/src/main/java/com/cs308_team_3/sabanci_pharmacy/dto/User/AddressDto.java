package com.cs308_team_3.sabanci_pharmacy.dto.User;

import lombok.Data;

@Data
public class AddressDto {
    private Integer id; // Null when creating new, present when editing
    private String addressLine;
    private String city;
    private String province;
    private String zipCode;
    private Boolean isDefault;
}