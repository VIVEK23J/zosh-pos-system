package com.zosh.zosh.pos.system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zosh.zosh.pos.system.enums.PaymentType;
import jakarta.persistence.*;
import jdk.jshell.execution.LoaderDelegate;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_order_id")
    private Order order;

    private String reason;

    private Long orderId;
    private Double amount;

    @ManyToOne
    @JsonIgnore
    private ShiftReport shiftReport;

    @ManyToOne
    @JoinColumn(name = "cashier_id")
    private User cashier;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    private PaymentType paymentType;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }




}
