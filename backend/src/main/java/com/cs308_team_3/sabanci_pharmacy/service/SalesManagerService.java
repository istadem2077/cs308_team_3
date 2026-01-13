package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Order.FinancialReportDto;
import com.cs308_team_3.sabanci_pharmacy.entity.*;
import com.cs308_team_3.sabanci_pharmacy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SalesManagerService {

    @Autowired private ProductRepository productRepository;
    @Autowired private WishlistRepository wishlistRepository;
    @Autowired private EmailService emailService;
    @Autowired private OrderRepository orderRepository;

    // --- 1. Discount Management ---
    @Transactional
    public void applyDiscount(Integer productId, BigDecimal discountRate) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // specific logic: New Price = Old Price * (1 - rate/100)
        BigDecimal oldPrice = product.getPrice();
        BigDecimal multiplier = BigDecimal.ONE.subtract(discountRate.divide(BigDecimal.valueOf(100)));
        BigDecimal newPrice = oldPrice.multiply(multiplier);

        product.setPrice(newPrice);
        product.setDiscountRate(discountRate);
        productRepository.save(product);

        // Notify Users
        List<Wishlist> wishlists = wishlistRepository.findByProductId(productId); // You need to add this method to Repo
        for (Wishlist w : wishlists) {
            emailService.sendDiscountNotification(
                w.getUser().getEmail(), 
                product.getName(), 
                newPrice.doubleValue()
            );
        }
    }

    // --- 2. Revenue & Profit Calculation ---
    public FinancialReportDto generateReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findAllByCreatedAtBetweenAndStatus(startDate, endDate, "DELIVERED"); // Assuming only completed orders count
        
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                // Revenue
                BigDecimal itemRevenue = item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));
                totalRevenue = totalRevenue.add(itemRevenue);

                // Cost Logic: If cost is null, default to 50% of selling price
                Product p = item.getProduct();
                BigDecimal cost = p.getCost(); 
                if (cost == null) {
                    cost = item.getUnitPrice().multiply(new BigDecimal("0.5"));
                }

                // Profit = (Selling Price - Cost) * Quantity
                BigDecimal itemProfit = item.getUnitPrice().subtract(cost).multiply(new BigDecimal(item.getQuantity()));
                totalProfit = totalProfit.add(itemProfit);
            }
        }
        
        return new FinancialReportDto(totalRevenue, totalProfit, orders.size());
    }
}
