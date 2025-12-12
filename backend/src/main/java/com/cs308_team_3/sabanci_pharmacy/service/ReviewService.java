package com.cs308_team_3.sabanci_pharmacy.service;


import com.cs308_team_3.sabanci_pharmacy.entity.User;
import com.cs308_team_3.sabanci_pharmacy.entity.Product;
import com.cs308_team_3.sabanci_pharmacy.entity.Review;
import com.cs308_team_3.sabanci_pharmacy.dto.Reviews.ReviewResponseDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Reviews.ReviewRequestDto;
import com.cs308_team_3.sabanci_pharmacy.repository.UserRepository;
import com.cs308_team_3.sabanci_pharmacy.repository.ProductRepository;
import com.cs308_team_3.sabanci_pharmacy.repository.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public ReviewResponseDto createReview(ReviewRequestDto requestDto) {
        Product product = productRepository.findById(requestDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = reviewRepository.findByUserIdAndProductId(user.getId(), product.getId())
                .orElse(new Review());

        if (review.getId() == null) {
            review.setProduct(product);
            review.setUser(user);
            review.setStatus(!requestDto.getComment().isEmpty() ? "PENDING": "APPROVED");
        } else {
            review.setStatus(!requestDto.getComment().isEmpty() ? "PENDING": "APPROVED");
        }

        review.setRating(requestDto.getRating());
        review.setComment(!requestDto.getComment().isEmpty()? requestDto.getComment() : "");
        review.setStatus(!requestDto.getComment().isEmpty() ? "PENDING" : "APPROVED");
        Review savedReview = reviewRepository.save(review);

        return mapToResponseDto(savedReview);
    }

    public List<ReviewResponseDto> getReviewsByProduct(Integer productId) {
        Optional<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    private ReviewResponseDto mapToResponseDto(Review review) {
        ReviewResponseDto response = new ReviewResponseDto();
        response.setId(review.getId());
        response.setProductId(review.getProduct().getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        response.setStatus(review.getStatus());

        if (review.getUser() != null) {
            response.setUserName(review.getUser().getName());
        } else {
            response.setUserName("Anonymous"); // Handle null user case
        }

        return response;
    }
}
