package com.cs308_team_3.sabanci_pharmacy.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Formula;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;


@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal price;
    private Integer total_orders;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Formula("(SELECT COALESCE(AVG(CAST(r.rating AS FLOAT)), 0.0) FROM reviews r WHERE r.product_id = id)")
    private Double averageRating;
}
