package com.cs308_team_3.sabanci_pharmacy.repository;

import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findByUserId(Integer userId);
}
