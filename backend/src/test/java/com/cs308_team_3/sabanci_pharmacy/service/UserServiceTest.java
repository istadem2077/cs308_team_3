package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.User.*;
import com.cs308_team_3.sabanci_pharmacy.entity.Cart;
import com.cs308_team_3.sabanci_pharmacy.entity.User;
import com.cs308_team_3.sabanci_pharmacy.repository.CartRepository;
import com.cs308_team_3.sabanci_pharmacy.repository.UserRepository;
import com.cs308_team_3.sabanci_pharmacy.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private CartRepository cartRepository;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private UserService userService;

    // --- Registration Tests ---

    @Test
    void registerUser_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");
        request.setName("Test User");
        request.setAddress("Test Address");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPwd");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(1);
            return u;
        });
        when(jwtUtil.generateToken(anyString())).thenReturn("jwt-token");

        AuthResponse response = userService.registerUser(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    void registerUser_EmailAlreadyInUse() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@test.com");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(new User()));

        assertThrows(RuntimeException.class, () -> userService.registerUser(request));
    }

    @Test
    void registerUser_EmptyEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("");

        when(userRepository.findByEmail("")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.registerUser(request));
    }

    @Test
    void registerUser_WeakPassword() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("123"); // Too short

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.registerUser(request));
    }

    @Test
    void registerUser_EmptyName() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");
        request.setName("");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.registerUser(request));
    }

    // --- Login Tests ---

    @Test
    void loginUser_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("encodedPwd");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPwd")).thenReturn(true);
        when(jwtUtil.generateToken("test@test.com")).thenReturn("jwt-token");

        AuthResponse response = userService.loginUser(request);

        assertEquals("jwt-token", response.getToken());
    }

    @Test
    void loginUser_UserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@test.com");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.loginUser(request));
    }

    @Test
    void loginUser_WrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("wrong");

        User user = new User();
        user.setPassword("encodedPwd");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encodedPwd")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.loginUser(request));
    }

    // --- Password & Address Tests ---

    @Test
    void updatePassword_Success() {
        PasswordUpdateRequest request = new PasswordUpdateRequest();
        request.setId(1);
        request.setOldPassword("old");
        request.setNewPassword("new");
        request.setConfirmPassword("new");

        User user = new User();
        user.setPassword("encodedOld");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "encodedOld")).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("encodedNew");
        when(userRepository.save(user)).thenReturn(user);

        User updated = userService.updatePassword(request);
        assertEquals("encodedNew", updated.getPassword());
    }

    @Test
    void updatePassword_OldPasswordIncorrect() {
        PasswordUpdateRequest request = new PasswordUpdateRequest();
        request.setId(1);
        request.setOldPassword("wrong");

        User user = new User();
        user.setPassword("encodedOld");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encodedOld")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.updatePassword(request));
    }

    @Test
    void changeAddress_Success() {
        AddressUpdateRequest request = new AddressUpdateRequest();
        request.setId(1);
        request.setAddress("New Address");

        User user = new User();
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        User updated = userService.changeAddress(request);
        assertEquals("New Address", updated.getAddress());
    }
}