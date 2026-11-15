package com.zosh.zosh.pos.system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String description;

    private Double mrp;

    private Double sellingPrice;

    private String brand;

    private String image;
    @ManyToOne
    private Category category;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    private LocalDateTime  createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreated() {
        createdAt = LocalDateTime.now();

    }
    @PreUpdate
    protected void onUpdated() {
        updatedAt = LocalDateTime.now();
    }


}
