package com.cs308_team_3.sabanci_pharmacy.dto.User;

import lombok.Data;

import java.math.BigInteger;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String confirmPassword;

    private String gender;
    private BigInteger phone;
    private Integer age;

    private String addressLine;
    private String city;
    private String province;
    private String zipCode;
}
