package com.zosh.zosh.pos.system.entity;

import com.zosh.zosh.pos.system.enums.StoreStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brand;
    @OneToOne(cascade = CascadeType.ALL)
    private User storeAdmin;


    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    private String description;

    private String storeType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StoreStatus storeStatus;

    @Builder.Default
    private StoreContact contact = new StoreContact();

    @PrePersist
    protected void onCreated() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
        if (storeStatus == null) {
            storeStatus = StoreStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdated() {
        updatedDate = LocalDateTime.now();
    }
}
