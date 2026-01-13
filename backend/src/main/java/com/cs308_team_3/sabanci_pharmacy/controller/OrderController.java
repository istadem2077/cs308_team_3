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

    @GetMapping("/user/{userId}")
    public List<OrderResponseDto> getUserOrders(@PathVariable Integer userId) {
        return orderService.getUserOrders(userId);
    }
    
    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDto> cancelOrder(@PathVariable Integer orderId, Principal principal) {
        OrderResponseDto response = orderService.cancelOrder(orderId, principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{orderId}/return")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDto> returnOrder(@PathVariable Integer orderId, Principal principal) {
        OrderResponseDto response = orderService.returnOrder(orderId, principal.getName());
        return ResponseEntity.ok(response);
    }
    
    // Updated: Allow SALES_MANAGER to update status (for refunds)
    @PreAuthorize("hasAnyAuthority('PRODUCT_MANAGER', 'SALES_MANAGER')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable Integer orderId, 
            @RequestParam String status) {
    
        OrderResponseDto updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/{orderId}")
    public OrderResponseDto getOrderDetails(@PathVariable Integer orderId) {
        return orderService.getOrder(orderId);
    }

    @GetMapping("/all")
    public List<OrderResponseDto> getAllDeliveries() {
        return orderService.getAllDeliveries();
    }
}
