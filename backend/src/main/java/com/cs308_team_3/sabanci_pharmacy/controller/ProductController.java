package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.entity.Product;
import com.cs308_team_3.sabanci_pharmacy.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PreAuthorize("hasRole('PRODUCT_MANAGER')")
    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
	return ResponseEntity.ok(productService.saveProduct(product));
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    //@PostMapping
    //public Product createProduct(@RequestBody Product product) {
    //    return productService.saveProduct(product);
    //}

    @PreAuthorize("hasRole('PRODUCT_MANAGER')")
    @DeleteMapping("/remove/{id}")
    public void deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
    }
}
