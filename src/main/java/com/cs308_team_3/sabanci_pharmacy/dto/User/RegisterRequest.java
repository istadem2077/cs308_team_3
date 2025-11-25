package com.cs308_team_3.sabanci_pharmacy.dto.User;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String confirmPassword;
    private String address;
}
