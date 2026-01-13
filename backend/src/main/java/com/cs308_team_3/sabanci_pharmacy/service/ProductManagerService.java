package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Product.*;
import com.cs308_team_3.sabanci_pharmacy.entity.*;
import com.cs308_team_3.sabanci_pharmacy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductManagerService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private EmailService emailService;

    // --- 1. Product & Category Management ---
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Integer productId) {
        productRepository.deleteById(productId);
    }

    @Transactional
    public Product updateProduct(Integer id, ProductRequest request) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 1. Update simple fields
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setQuantity(request.getQuantity());
        existing.setImageUrl(request.getImageUrl());
        // existing.setRequiresPrescription(request.isRequiresPrescription()); // Uncomment if field exists in Entity

        // 2. Handle Category Logic
        if (request.getCategory() != null && !request.getCategory().isEmpty()) {
            String categoryName = request.getCategory();
            
            // Try to find existing category, or create new one if it doesn't exist
            Category category = categoryRepository.findByName(categoryName)
                    .orElseGet(() -> {
                        Category newCat = new Category();
                        newCat.setName(categoryName);
                        return categoryRepository.save(newCat);
                    });
            
            existing.setCategory(category);
        }

        return productRepository.save(existing);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
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
	User user = order.getUser();
        order.setStatus(newStatus); // e.g., "SHIPPED", "DELIVERED"
        orderRepository.save(order);
	if (newStatus == "REFUNDED"){
	    emailService.sendRefundNotif(user.getEmail());
	}
    }

    // --- 4. Comment (Review) Moderation ---
    public Optional<Review> getPendingReviews() {
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
