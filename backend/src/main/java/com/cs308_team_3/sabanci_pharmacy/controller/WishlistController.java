package com.cs308_team_3.sabanci_pharmacy.controller;

import com.sabanci.pharmacy.entity.Wishlist;
import com.sabanci.pharmacy.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Get user's wishlist
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Wishlist>> getMyWishlist(Principal principal) {
        return ResponseEntity.ok(wishlistService.getWishlist(principal.getName()));
    }

    // Add product to wishlist
    @PostMapping("/add/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> addToWishlist(@PathVariable Integer productId, Principal principal) {
        wishlistService.addToWishlist(principal.getName(), productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    // Remove product from wishlist
    @DeleteMapping("/remove/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Integer productId, Principal principal) {
        wishlistService.removeFromWishlist(principal.getName(), productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }
}
