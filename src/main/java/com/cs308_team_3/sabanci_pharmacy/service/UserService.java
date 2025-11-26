package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.User.AddressUpdateRequest;
import com.cs308_team_3.sabanci_pharmacy.dto.User.LoginRequest;
import com.cs308_team_3.sabanci_pharmacy.dto.User.PasswordUpdateRequest;
import com.cs308_team_3.sabanci_pharmacy.dto.User.RegisterRequest;
import com.cs308_team_3.sabanci_pharmacy.entity.Cart;
import com.cs308_team_3.sabanci_pharmacy.entity.User;
import com.cs308_team_3.sabanci_pharmacy.repository.CartRepository;
import com.cs308_team_3.sabanci_pharmacy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CartRepository cartRepository;

    //Registration
    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());

        User savedUser = userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(savedUser);
        cartRepository.save(cart);

        return savedUser;
    }

    public User loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        return user;
    }

    public User changeAddress(AddressUpdateRequest request){
        User user = userRepository.findById(request.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setAddress(request.getAddress());
        return userRepository.save(user);
    }

    public User updatePassword(PasswordUpdateRequest request){
        User user = userRepository.findById(request.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        if  (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        if (request.getNewPassword().equals(request.getConfirmPassword())) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        else  {
            throw new RuntimeException("Passwords don't match");
        }
        return userRepository.save(user);
    }


}
