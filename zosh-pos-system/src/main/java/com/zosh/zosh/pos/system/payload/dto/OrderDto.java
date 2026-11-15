package com.zosh.zosh.pos.system.payload.dto;

import com.zosh.zosh.pos.system.entity.Customer;
import com.zosh.zosh.pos.system.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
    private Long id;
    private Double totalAmount;
    private LocalDateTime createdAt;

    private Long branchId;
    private Long customerId;

    private BranchDto branch;

    private UserDto cashier;

    private Customer customer;

    private PaymentType payment;

    private String paymentTransactionId;
    private String paymentOrderId;
    private String paymentStatus;

    private List<OrderItemDto> item;
}
