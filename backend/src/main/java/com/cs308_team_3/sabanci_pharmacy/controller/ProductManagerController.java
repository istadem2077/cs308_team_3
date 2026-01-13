package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.Product.*;
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
//@PreAuthorize("hasRole('PRODUCT_MANAGER')") // Security Lock
public class ProductManagerController {

    @Autowired
    private ProductManagerService pmService;

    // --- Product & Category ---
    //@PreAuthorize("hasRole('PRODUCT_MANAGER')")
    @PostMapping("/product/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(pmService.saveProduct(product));
    }


    @PutMapping("/product/update/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody ProductRequest productRequest) {
        return ResponseEntity.ok(pmService.updateProduct(id, productRequest));
    }
    
    //@PreAuthorize("hasRole('PRODUCT_MANAGER')")
    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id) {
        pmService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted");
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(pmService.getAllCategories());
    }

    //@PreAuthorize("hasRole('PRODUCT_MANAGER')")
    @PostMapping("/category/add")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        return ResponseEntity.ok(pmService.saveCategory(category));
    }

    //@PreAuthorize("hasRole('PRODUCT_MANAGER')")
    @PutMapping("/category/delete/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer categoryId){
	pmService.deleteCategory(categoryId);
	return ResponseEntity.ok("Category Deleted");
    }

    // --- Stock ---
    //@PreAuthorize("hasRole('PRODUCT_MANAGER')")
    @PutMapping("/stock/{productId}")
    public ResponseEntity<String> updateStock(@PathVariable Integer productId, @RequestParam Integer quantity) {
        pmService.updateStock(productId, quantity);
        return ResponseEntity.ok("Stock updated");
    }

    // --- Delivery ---
    //@PreAuthorize("hasAuthority('PRODUCT_MANAGER')")
    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryItemDto>> getDeliveries() {
        return ResponseEntity.ok(pmService.getDeliveryList());
    }

    //@PreAuthorize("hasAuthority('PRODUCT_MANAGER')")
    @PutMapping("/order/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
        pmService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok("Order status updated to " + status);
    }

    // --- Reviews ---
    //@PreAuthorize("hasAuthority('PRODUCT_MANAGER')")
    @GetMapping("/reviews/pending")
    public ResponseEntity<Optional<Review>> getPendingReviews() {
        return ResponseEntity.ok(pmService.getPendingReviews());
    }

    //@PreAuthorize("hasAuthority('PRODUCT_MANAGER')")
    @PutMapping("/reviews/{reviewId}/approve")
    public ResponseEntity<String> approveReview(@PathVariable Integer reviewId, @RequestParam boolean approved) {
        pmService.moderateReview(reviewId, approved);
        return ResponseEntity.ok(approved ? "Review Approved" : "Review Rejected");
    }
}
