package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.Order;
import com.zosh.zosh.pos.system.payload.dto.OrderDto;

import java.util.Collections;
import java.util.stream.Collectors;

public class OrderMapper {
    public static OrderDto toOrderDto(Order order) {
        if (order == null) {
            return null;
        }

        return OrderDto.builder()
                .id(order.getOrderId())
                .totalAmount(order.getTotalAmount())
                .branchId(order.getBranch() != null ? order.getBranch().getId() : null)
                .branch(order.getBranch() != null ? BranchMapper.toDto(order.getBranch()) : null)
                .cashier(order.getCashier() != null ? UserMapper.toDTO(order.getCashier()) : null)
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customer(order.getCustomer())
                .payment(order.getPayment())
                .paymentTransactionId(order.getPaymentTransactionId())
                .paymentOrderId(order.getPaymentOrderId())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .item(order.getItems() != null
                        ? order.getItems().stream()
                                .map(OrderItemMapper::toDto)
                                .collect(Collectors.toList())
                        : Collections.emptyList())
                .build();
    }
}
