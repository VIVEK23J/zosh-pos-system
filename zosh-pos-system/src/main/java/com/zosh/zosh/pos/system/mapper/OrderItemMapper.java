package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.OrderItem;
import com.zosh.zosh.pos.system.payload.dto.OrderItemDto;

public class OrderItemMapper {
    public static OrderItemDto toDto(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }
        return OrderItemDto.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProduct() != null ? orderItem.getProduct().getId() : null)
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .product(orderItem.getProduct() != null ? ProductMapper.mapToDto(orderItem.getProduct()) : null)
                .build();
    }
}
