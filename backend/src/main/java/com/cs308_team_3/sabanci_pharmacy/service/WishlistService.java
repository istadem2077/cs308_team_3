package com.cs308_team_3.sabanci_pharmacy.service;

import com.sabanci.pharmacy.entity.Product;
import com.sabanci.pharmacy.entity.User;
import com.sabanci.pharmacy.entity.Wishlist;
import com.sabanci.pharmacy.repository.ProductRepository;
import com.sabanci.pharmacy.repository.UserRepository;
import com.sabanci.pharmacy.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Wishlist> getWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUserId(user.getId());
    }

    @Transactional
    public void addToWishlist(String userEmail, Integer productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new RuntimeException("Product already in wishlist");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = new Wishlist(user, product);
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(String userEmail, Integer productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wishlist wishlist = wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Item not found in wishlist"));

        wishlistRepository.delete(wishlist);
    }
}
