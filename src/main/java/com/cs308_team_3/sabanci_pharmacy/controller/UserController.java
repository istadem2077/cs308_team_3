package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.AddressUpdateRequest;
import com.cs308_team_3.sabanci_pharmacy.dto.PasswordUpdateRequest;
import com.cs308_team_3.sabanci_pharmacy.dto.RegisterRequest;
import com.cs308_team_3.sabanci_pharmacy.dto.LoginRequest;
import com.cs308_team_3.sabanci_pharmacy.entity.User;
import com.cs308_team_3.sabanci_pharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody RegisterRequest request){
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody LoginRequest request){
        return userService.loginUser(request);
    }

    @PostMapping("/mod-address")
    public User changeAddress(@RequestBody AddressUpdateRequest request){
        return userService.changeAddress(request);
    }

    @PostMapping("/passwd-upd")
    public User changePassword(@RequestBody PasswordUpdateRequest request){
        return userService.updatePassword(request);
    }
}
