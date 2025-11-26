package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.Cart.CartRequest;
import com.cs308_team_3.sabanci_pharmacy.entity.Cart;
import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import com.cs308_team_3.sabanci_pharmacy.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public Cart addToCart(@RequestBody CartRequest request) {
        return cartService.addToCart(request);
    }

    @DeleteMapping("/{userId}")
    public Cart clearCart(@PathVariable Integer userId) {
        return cartService.clearCart(userId);
    }

    @PostMapping("/remove")
    public Cart removeFromCart(@RequestBody CartRequest request) {
        return cartService.removeFromCart(request);
    }

    @PostMapping("/{userId}")
    public Cart getCart(@PathVariable Integer userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/checkout/{userId}")
    public Order checkout(@PathVariable Integer userId) {
        return cartService.checkout(userId);
    }

}
