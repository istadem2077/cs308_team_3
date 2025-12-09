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
}
