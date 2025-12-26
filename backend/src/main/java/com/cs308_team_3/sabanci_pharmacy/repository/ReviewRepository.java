package com.cs308_team_3.sabanci_pharmacy.repository;

import com.cs308_team_3.sabanci_pharmacy.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ReviewRepository extends JpaRepository<Review,Integer>{
    Optional<Review> findByProductId(Integer productId);
    Optional<Review> findByUserIdAndProductId(Integer userId, Integer productId);
    Optional<Review> findByStatus(String status);
}
