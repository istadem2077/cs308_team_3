package com.cs308_team_3.sabanci_pharmacy.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column
    private String gender;
    @Column
    private Integer age;
    @Column
    private BigInteger phone_number;

    @Column
    private BigInteger tax_id;
    
    @Column(nullable = false, unique = true)
    private String email;

    private String password;
    
    // user role
    @Column(nullable = false)
    private String role = "CUSTOMER"; // Default value

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

}
