package com.zosh.zosh.pos.system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;


    @Column(nullable = false)
    private String email;
    private String phone;

    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

}
