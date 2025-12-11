package com.cs308_team_3.sabanci_pharmacy.dto.User;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private Integer phone;
    private Integer age;
    private String gender;

    private String password;
    private String confirmPassword;

    private String addressLine;
    private String city;
    private String province;
    private String zipCode;
}
