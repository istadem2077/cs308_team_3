package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Cart.CartRequest;
import com.cs308_team_3.sabanci_pharmacy.entity.*;
import com.cs308_team_3.sabanci_pharmacy.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock private CartRepository cartRepository;
    @Mock private ProductRepository productRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private PdfService pdfService;
    @Mock private EmailService emailService;

    @InjectMocks private CartService cartService;

    @Test
    void addToCart_NewItem() {
        CartRequest request = new CartRequest();
        request.setUserId(1);
        request.setProductId(10);
        request.setQuantity(2);

        Cart cart = new Cart();
        cart.setItems(new ArrayList<>());

        Product product = new Product();
        product.setId(10);

        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10)).thenReturn(Optional.of(product));
        when(cartRepository.save(cart)).thenReturn(cart);

        cartService.addToCart(request);

        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getItems().get(0).getQuantity());
    }

    @Test
    void addToCart_ExistingItem() {
        CartRequest request = new CartRequest();
        request.setUserId(1);
        request.setProductId(10);
        request.setQuantity(1);

        Product product = new Product();
        product.setId(10);

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(5);

        Cart cart = new Cart();
        cart.setItems(new ArrayList<>());
        cart.getItems().add(item);

        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10)).thenReturn(Optional.of(product));
        when(cartRepository.save(cart)).thenReturn(cart);

        cartService.addToCart(request);

        assertEquals(1, cart.getItems().size());
        assertEquals(6, cart.getItems().get(0).getQuantity());
    }

    @Test
    void removeFromCart_Success() {
        CartRequest request = new CartRequest();
        request.setUserId(1);
        request.setProductId(10);
        request.setQuantity(5);

        Product product = new Product();
        product.setId(10);

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(5); // Removing equal quantity clears item

        Cart cart = new Cart();
        cart.setItems(new ArrayList<>());
        cart.getItems().add(item);

        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10)).thenReturn(Optional.of(product));
        when(cartRepository.save(cart)).thenReturn(cart);

        cartService.removeFromCart(request);

        assertTrue(cart.getItems().isEmpty());
    }

    @Test
    void clearCart_Success() {
        Cart cart = new Cart();
        cart.setItems(new ArrayList<>());
        cart.getItems().add(new CartItem());

        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);

        cartService.clearCart(1);

        assertTrue(cart.getItems().isEmpty());
    }

    @Test
    void checkout_Success() {
        Cart cart = new Cart();
        cart.setUser(new User());
        cart.setItems(new ArrayList<>());

        Product p = new Product();
        p.setId(1);
        p.setPrice(BigDecimal.TEN);
        p.setQuantity(100);

        CartItem item = new CartItem();
        item.setProduct(p);
        item.setQuantity(2);
        cart.getItems().add(item);

        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1)).thenReturn(Optional.of(p));
        when(orderRepository.save(any(Order.class))).thenReturn(new Order());

        Order order = cartService.checkout(1);

        assertNotNull(order);
        verify(emailService, times(1)).sendInvoiceEmail(any(), any());
    }
}