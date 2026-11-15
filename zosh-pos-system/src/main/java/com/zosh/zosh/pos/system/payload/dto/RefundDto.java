package com.zosh.zosh.pos.system.payload.dto;

import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RefundDto {
    private Long id;

    private OrderDto order;

    private Long orderId;

    private String reason;
    private Double amount;

    private Long shiftReportId;

    private UserDto cashier;
    private String cashierName;

    private BranchDto branch;

    private Long branchId;
    private PaymentType paymentType;

    private LocalDateTime createdAt;



}
