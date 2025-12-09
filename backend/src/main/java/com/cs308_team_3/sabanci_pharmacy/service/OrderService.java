package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Order.OrderItemDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Order.OrderResponseDto;
import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import com.cs308_team_3.sabanci_pharmacy.entity.OrderItem;
import com.cs308_team_3.sabanci_pharmacy.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // 1. Get All Orders for a User (Order History)
    public List<OrderResponseDto> getUserOrders(Integer userId) {
        List<Order> orders = orderRepository.findByUserId(userId); // You might need to add this to Repo

        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 2. Get Single Order Detail
    public OrderResponseDto getOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToDto(order);
    }

    // --- Helper Method: Converts Entity -> DTO ---
    private OrderResponseDto mapToDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getCreatedAt());
        dto.setStatus(order.getStatus());

        // Map Items
        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setUnitPrice(item.getUnitPrice());
            // Calculate Subtotal
            itemDto.setSubTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return itemDto;
        }).collect(Collectors.toList());

        dto.setItems(itemDtos);

        // Calculate Grand Total
        BigDecimal total = itemDtos.stream()
                .map(OrderItemDto::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalAmount(total);

        return dto;
    }
}
