package com.cs308_team_3.sabanci_pharmacy.dto.User;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private Integer userId;
}
