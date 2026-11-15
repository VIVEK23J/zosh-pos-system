package com.zosh.zosh.pos.system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ShiftReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime shiftStart;

    private LocalDateTime shiftEnd;

    private Double totalSales;

    private Double totalRefunds;

    private Double netSales;

    private int totalOrders;

    @ManyToOne
    @JoinColumn(name = "cashier_id")
    private User cashier;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Transient
    private List<PaymentSummary> paymentSummary;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Product> topSellingProducts;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Order> recentOrders;

    @OneToMany(mappedBy = "shiftReport", cascade = CascadeType.ALL)
    private List<Refund>  refunds;


}