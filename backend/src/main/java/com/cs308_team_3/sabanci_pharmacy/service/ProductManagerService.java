package com.cs308_team_3.sabanci_pharmacy.service;

import com.sabanci.pharmacy.dto.DeliveryItemDto;
import com.sabanci.pharmacy.entity.*;
import com.sabanci.pharmacy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductManagerService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ReviewRepository reviewRepository;

    // --- 1. Product & Category Management ---
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Integer productId) {
        productRepository.deleteById(productId);
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }
    
    public void deleteCategory(Integer categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    // --- 2. Stock Management ---
    @Transactional
    public void updateStock(Integer productId, Integer newQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setQuantity(newQuantity);
        productRepository.save(product);
    }

    // --- 3. Delivery Management ---
    public List<DeliveryItemDto> getDeliveryList() {
        return orderRepository.findAllDeliveryItems();
    }

    @Transactional
    public void updateOrderStatus(Integer orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus); // e.g., "SHIPPED", "DELIVERED"
        orderRepository.save(order);
    }

    // --- 4. Comment (Review) Moderation ---
    public List<Review> getPendingReviews() {
        // Assuming your Review entity uses an Enum, you might need ReviewStatus.PENDING
        // If it uses String as per DDL:
        return reviewRepository.findByStatus("PENDING");
    }

    @Transactional
    public void moderateReview(Integer reviewId, boolean isApproved) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setStatus(isApproved ? "APPROVED" : "REJECTED");
        reviewRepository.save(review);
    }
}
