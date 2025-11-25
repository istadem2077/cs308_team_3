package com.cs308_team_3.sabanci_pharmacy.dto;

import lombok.Data;

@Data
public class PasswordUpdateRequest {
    private Integer id;
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}
