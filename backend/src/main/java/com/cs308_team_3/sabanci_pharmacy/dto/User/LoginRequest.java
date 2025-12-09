package com.cs308_team_3.sabanci_pharmacy.dto.User;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}

