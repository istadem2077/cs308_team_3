package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Cart.CartRequest;
import com.cs308_team_3.sabanci_pharmacy.entity.*;
import com.cs308_team_3.sabanci_pharmacy.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PdfService pdfService;
    @Autowired
    private EmailService emailService;

    public Cart getCart(Integer userId) {
        return cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("No cart found"));
    }

    public Cart addToCart(CartRequest request) {
        Cart cart = getCart(request.getUserId());
        Product product  = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId() == product.getId()).findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
        } else  {
            CartItem item = new CartItem();
            item.setProduct(product);
            item.setCart(cart);
            item.setQuantity(request.getQuantity());
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    public Cart clearCart(Integer userId) {
        Cart cart =  getCart(userId);
        cart.getItems().clear();
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(CartRequest request) {
        Cart cart = getCart(request.getUserId());

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> item = cart.getItems().stream().filter(i -> i.getProduct().getId() == product.getId()).findFirst();
        if (item.isPresent()) {
            item.get().setQuantity(item.get().getQuantity() - request.getQuantity());
            if  (item.get().getQuantity() == 0) {
                cart.getItems().remove(item.get());

            }
        } else {
            throw new RuntimeException("Item not found");
        }
        return cartRepository.save(cart);
     }

    @Transactional
    public Order checkout(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
	order.setShippingAddress(cart.getUser().getAddresses().get(0));
        order.setStatus("PENDING");

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getProduct().getPrice());
            orderItem.setOrder(order);
            order.getOrderItems().add(orderItem);
            total = total.add(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            Product product  = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            product.setQuantity(product.getQuantity() - item.getQuantity());
            product.setTotal_orders(product.getTotal_orders()+item.getQuantity());
            productRepository.save(product);
        }

        System.out.println("Processing payment for $" + total);

        Order savedOrder = orderRepository.save(order);

        try {
            ByteArrayInputStream pdfStream = pdfService.generateInvoice(savedOrder);
            byte[] pdfBytes = pdfStream.readAllBytes();
            emailService.sendInvoiceEmail(savedOrder, pdfBytes);

        } catch (Exception e) {
            System.err.println("Order completed but email failed: " + e.getMessage());
        }

        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

}
