package com.cs308_team_3.sabanci_pharmacy.repository;

import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import com.cs308_team_3.sabanci_pharmacy.dto.Product.DeliveryItemDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    // existing code...
    List<Order> findByUserId(Integer userId);

    // NEW: Get all orders, newest first
    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findAllByCreatedAtBetweenAndStatus(LocalDateTime startDate, LocalDateTime endDate, String status);

    // We need to join multiple tables to get the delivery details

    @Query("SELECT new com.cs308_team_3.sabanci_pharmacy.dto.Product.DeliveryItemDto(" +
	   "o.id, o.user.id, i.product.id, i.product.name, i.quantity, " +
	   "(i.unitPrice * i.quantity), " +
	   "concat(a.addressLine, ', ', a.city, ', ', a.province, ' ', a.zipCode), " +
	   "o.status) " +
	   "FROM Order o " +
	   "JOIN o.orderItems i " +
	   "JOIN o.shippingAddress a " +
	   "ORDER BY o.createdAt DESC")
    List<DeliveryItemDto> findAllDeliveryItems();
}
