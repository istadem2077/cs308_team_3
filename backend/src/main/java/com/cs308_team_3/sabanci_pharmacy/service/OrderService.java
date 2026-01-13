package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Order.OrderItemDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Order.OrderResponseDto;
import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import com.cs308_team_3.sabanci_pharmacy.entity.User;
import com.cs308_team_3.sabanci_pharmacy.entity.OrderItem;
import com.cs308_team_3.sabanci_pharmacy.repository.OrderRepository;
import com.cs308_team_3.sabanci_pharmacy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepository userRepository;

    public List<OrderResponseDto> getUserOrders(Integer userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public OrderResponseDto updateOrderStatus(Integer orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        String formattedStatus = newStatus.toUpperCase();
        //
        List<String> validStatuses = List.of("PENDING", "PROCESSING", "IN-TRANSIT", "DELIVERED", "CANCELLED", "REFUNDED", "RETURN_REQUESTED", "RETURN_REJECTED");

        if (!validStatuses.contains(formattedStatus)) {
            throw new RuntimeException("Invalid status. Valid statuses are: " + validStatuses);
        }

        order.setStatus(formattedStatus);
        Order savedOrder = orderRepository.save(order);
    
        return mapToDto(savedOrder);
    }

    public OrderResponseDto cancelOrder(Integer orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: This order does not belong to you.");
        }

        String status = order.getStatus().toUpperCase();
        
        if (!status.equals("PROCESSING") && !status.equals("PENDING")) {
            throw new RuntimeException("Order can only be cancelled if it is in PROCESSING status.");
        }

        order.setStatus("CANCELLED");
        return mapToDto(orderRepository.save(order));
    }

    public OrderResponseDto returnOrder(Integer orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: This order does not belong to you.");
        }

        String status = order.getStatus().toUpperCase();

        if (!status.equals("DELIVERED")) {
            throw new RuntimeException("Order can only be refunded/returned if it is in DELIVERED status.");
        }

        // Changed from REFUNDED to RETURN_REQUESTED to allow Manager approval
        order.setStatus("RETURN_REQUESTED");
        return mapToDto(orderRepository.save(order));
    }

    public OrderResponseDto getOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToDto(order);
    }

    public List<OrderResponseDto> getAllDeliveries() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderResponseDto mapToDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getCreatedAt());
        dto.setStatus(order.getStatus());

	if(order.getUser() != null) {
            dto.setUserName(order.getUser().getName()); 
        }
	
        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setUnitPrice(item.getUnitPrice());
            itemDto.setSubTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return itemDto;
        }).collect(Collectors.toList());

        dto.setItems(itemDtos);

        BigDecimal total = itemDtos.stream()
                .map(OrderItemDto::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalAmount(total);

        return dto;
    }
}
