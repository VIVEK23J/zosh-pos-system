package com.zosh.zosh.pos.system.payload.dto;

import com.zosh.zosh.pos.system.entity.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftReportDto {
    private Long id;

    private LocalDateTime shiftStart;

    private LocalDateTime shiftEnd;

    private Double totalSales;

    private Double totalRefunds;

    private Double netSales;

    private Integer totalOrders;


    private UserDto cashier;
    private Long cashierId;
    private Long branchId;


    private BranchDto branch;

    private List<PaymentSummary>  paymentSummary;

    private List<ProductDto> topSellingProducts;


    private List<OrderDto> recentOrders;

    private List<RefundDto>  refunds;
}
