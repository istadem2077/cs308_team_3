package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.User.*;
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
    public AuthResponse registerUser(@RequestBody RegisterRequest request){
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public AuthResponse loginUser(@RequestBody LoginRequest request){
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
