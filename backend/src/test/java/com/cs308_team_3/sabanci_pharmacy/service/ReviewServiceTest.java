package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Reviews.ReviewRequestDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Reviews.ReviewResponseDto;
import com.cs308_team_3.sabanci_pharmacy.entity.Product;
import com.cs308_team_3.sabanci_pharmacy.entity.Review;
import com.cs308_team_3.sabanci_pharmacy.entity.User;
import com.cs308_team_3.sabanci_pharmacy.repository.ProductRepository;
import com.cs308_team_3.sabanci_pharmacy.repository.ReviewRepository;
import com.cs308_team_3.sabanci_pharmacy.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReviewServiceTest {

    @Mock private ReviewRepository reviewRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createReview_ShouldCreatePendingReview_WhenNew() {
        // Arrange
        ReviewRequestDto request = new ReviewRequestDto();
        request.setProductId(1);
        request.setUserId(1);
        request.setRating(5);
        request.setComment("Great product");

        Product mockProduct = new Product(); mockProduct.setId(1);
        User mockUser = new User(); mockUser.setId(1); mockUser.setName("Test User");

        when(productRepository.findById(1)).thenReturn(Optional.of(mockProduct));
        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser));
        when(reviewRepository.findByUserIdAndProductId(1, 1)).thenReturn(Optional.empty()); // No existing review

        // Mock save to return the object passed to it
        when(reviewRepository.save(any(Review.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        ReviewResponseDto response = reviewService.createReview(request);

        // Assert
        assertEquals("PENDING", response.getStatus()); // Critical Check!
        assertEquals("Great product", response.getComment());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void createReview_ShouldUpdateExisting_AndResetToPending() {
        // Arrange
        ReviewRequestDto request = new ReviewRequestDto();
        request.setProductId(1);
        request.setUserId(1);
        request.setRating(1); // Changing rating

        Review existingReview = new Review();
        existingReview.setId(55);
        existingReview.setStatus("APPROVED"); // Previously approved
        existingReview.setRating(5);
        Product p = new Product(); p.setId(1); existingReview.setProduct(p);
        User u = new User(); u.setId(1); existingReview.setUser(u);

        when(productRepository.findById(1)).thenReturn(Optional.of(p));
        when(userRepository.findById(1)).thenReturn(Optional.of(u));
        when(reviewRepository.findByUserIdAndProductId(1, 1)).thenReturn(Optional.of(existingReview)); // Found existing!
        when(reviewRepository.save(any(Review.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        ReviewResponseDto response = reviewService.createReview(request);

        // Assert
        assertEquals(1, response.getRating()); // Rating updated
        assertEquals("PENDING", response.getStatus()); // Status reset to PENDING (Logic check)
        assertEquals(55, response.getId()); // Same ID preserved
    }
}