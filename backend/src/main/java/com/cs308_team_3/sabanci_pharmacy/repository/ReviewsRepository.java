package com.cs308_team_3.sabanci_pharmacy.repository;

import com.cs308_team_3.sabanci_pharmacy.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewsRepository extends JpaRepository<Review,Integer> {
}
