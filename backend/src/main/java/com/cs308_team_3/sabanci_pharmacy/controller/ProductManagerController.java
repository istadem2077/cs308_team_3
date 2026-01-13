package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.Product.DeliveryItemDto;
import com.cs308_team_3.sabanci_pharmacy.entity.Category;
import com.cs308_team_3.sabanci_pharmacy.entity.Product;
import com.cs308_team_3.sabanci_pharmacy.entity.Review;
import com.cs308_team_3.sabanci_pharmacy.service.ProductManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/pm")
@PreAuthorize("hasRole('PRODUCT_MANAGER')") // Security Lock
public class ProductManagerController {

    @Autowired
    private ProductManagerService pmService;

    // --- Product & Category ---
    @PostMapping("/product/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(pmService.saveProduct(product));
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id) {
        pmService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted");
    }

    @PostMapping("/category/add")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        return ResponseEntity.ok(pmService.saveCategory(category));
    }

    // --- Stock ---
    @PutMapping("/stock/{productId}")
    public ResponseEntity<String> updateStock(@PathVariable Integer productId, @RequestParam Integer quantity) {
        pmService.updateStock(productId, quantity);
        return ResponseEntity.ok("Stock updated");
    }

    // --- Delivery ---
    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryItemDto>> getDeliveries() {
        return ResponseEntity.ok(pmService.getDeliveryList());
    }

    @PutMapping("/order/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
        pmService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok("Order status updated to " + status);
    }

    // --- Reviews ---
    @GetMapping("/reviews/pending")
    public ResponseEntity<Optional<Review>> getPendingReviews() {
        return ResponseEntity.ok(pmService.getPendingReviews());
    }

    @PutMapping("/reviews/{reviewId}/approve")
    public ResponseEntity<String> approveReview(@PathVariable Integer reviewId, @RequestParam boolean approved) {
        pmService.moderateReview(reviewId, approved);
        return ResponseEntity.ok(approved ? "Review Approved" : "Review Rejected");
    }
}
