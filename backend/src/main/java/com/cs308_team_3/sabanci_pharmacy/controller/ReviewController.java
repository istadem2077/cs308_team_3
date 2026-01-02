package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.Reviews.ReviewRequestDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Reviews.ReviewResponseDto;
import com.cs308_team_3.sabanci_pharmacy.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // GET /api/reviews/pending
    @GetMapping("/pending")
    public ResponseEntity<List<ReviewResponseDto>> getPendingReviews() {
        List<ReviewResponseDto> pendingReviews = reviewService.getPendingReviews();
        return ResponseEntity.ok(pendingReviews);
    }

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<ReviewResponseDto> addReview(@Valid @RequestBody ReviewRequestDto reviewRequest) {
        ReviewResponseDto savedReview = reviewService.createReview(reviewRequest);
        return ResponseEntity.ok(savedReview);
    }

    // GET /api/reviews/product/{productId}
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDto>> getProductReviews(@PathVariable Integer productId) {
        List<ReviewResponseDto> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponseDto>> getUserReviews(@PathVariable Integer userId) {
        List<ReviewResponseDto> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
      
    // PUT /api/reviews/{reviewId}/status?status=APPROVED
    @PutMapping("/{reviewId}/status")
    public ResponseEntity<String> updateReviewStatus(@PathVariable Integer reviewId, @RequestParam String status) {
        reviewService.updateReviewStatus(reviewId, status);
        return ResponseEntity.ok("Review status updated to " + status);
    }
}
