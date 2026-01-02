package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.entity.Product;
import com.cs308_team_3.sabanci_pharmacy.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @InjectMocks private ProductService productService;

    @Test
    void getAllProducts_Success() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(new Product(), new Product()));
        List<Product> products = productService.getAllProducts();
        assertEquals(2, products.size());
    }

    @Test
    void getProductById_Success() {
        Product p = new Product();
        p.setId(1);
        when(productRepository.findById(1)).thenReturn(Optional.of(p));

        Product found = productService.getProductById(1);
        assertEquals(1, found.getId());
    }

    @Test
    void getProductById_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> productService.getProductById(99));
    }

    @Test
    void saveProduct_Success() {
        Product p = new Product();
        when(productRepository.save(p)).thenReturn(p);

        Product saved = productService.saveProduct(p);
        assertNotNull(saved);
    }

    @Test
    void deleteProduct_Success() {
        productService.deleteProduct(1);
        verify(productRepository, times(1)).deleteById(1);
    }
}