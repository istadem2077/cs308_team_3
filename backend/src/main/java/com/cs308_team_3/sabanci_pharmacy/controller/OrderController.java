package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.Order.OrderResponseDto;
import com.cs308_team_3.sabanci_pharmacy.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // GET /api/orders/user/1
    @GetMapping("/user/{userId}")
    public List<OrderResponseDto> getUserOrders(@PathVariable Integer userId) {
        return orderService.getUserOrders(userId);
    }
    
    // NEW: Customer Cancel Order
    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDto> cancelOrder(@PathVariable Integer orderId, Principal principal) {
        OrderResponseDto response = orderService.cancelOrder(orderId, principal.getName());
        return ResponseEntity.ok(response);
    }

    // NEW: Customer Return/Refund Order
    @PutMapping("/{orderId}/return")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDto> returnOrder(@PathVariable Integer orderId, Principal principal) {
        OrderResponseDto response = orderService.returnOrder(orderId, principal.getName());
        return ResponseEntity.ok(response);
    }
    
    // PUT /api/orders/5/status (Manager Only)
    @PreAuthorize("hasRole('PRODUCT_MANAGER')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
							      @PathVariable Integer orderId, 
							      @RequestParam String status) {
    
	OrderResponseDto updatedOrder = orderService.updateOrderStatus(orderId, status);
	return ResponseEntity.ok(updatedOrder);
    }

    // GET /api/orders/5
    @GetMapping("/{orderId}")
    public OrderResponseDto getOrderDetails(@PathVariable Integer orderId) {
        return orderService.getOrder(orderId);
    }

    @GetMapping("/all")
    public List<OrderResponseDto> getAllDeliveries() {
        return orderService.getAllDeliveries();
    }
}
