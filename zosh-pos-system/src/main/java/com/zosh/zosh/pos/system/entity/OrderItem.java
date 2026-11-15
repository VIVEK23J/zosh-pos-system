package com.zosh.zosh.pos.system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Integer quantity;

    private Double price;
    @ManyToOne
    private Product product;
    @ManyToOne
    private Order order;


}
