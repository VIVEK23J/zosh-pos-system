package com.zosh.zosh.pos.system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;

    private String phone;

    private String email;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> workingDays;

    private LocalTime openingTime;

    private LocalTime closingTime;

    private LocalDateTime  createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    @OneToOne(cascade = CascadeType.REMOVE)
    private User manager;

    @PrePersist
    protected void onCreated() {
        this.createdAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdated() {
        this.updatedAt = LocalDateTime.now();
    }

}
