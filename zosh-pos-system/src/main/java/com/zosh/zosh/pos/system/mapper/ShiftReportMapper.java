
package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.Order;
import com.zosh.zosh.pos.system.entity.Product;
import com.zosh.zosh.pos.system.entity.Refund;
import com.zosh.zosh.pos.system.entity.ShiftReport;
import com.zosh.zosh.pos.system.payload.dto.OrderDto;
import com.zosh.zosh.pos.system.payload.dto.ProductDto;
import com.zosh.zosh.pos.system.payload.dto.RefundDto;
import com.zosh.zosh.pos.system.payload.dto.ShiftReportDto;

import java.util.List;
import java.util.stream.Collectors;

public class ShiftReportMapper {

    public static ShiftReportDto toShiftReportDto(ShiftReport shiftReport) {

        if (shiftReport == null) {
            return null;
        }

        return ShiftReportDto.builder()
                .id(shiftReport.getId())
                .shiftStart(shiftReport.getShiftStart())
                .shiftEnd(shiftReport.getShiftEnd())
                .totalSales(shiftReport.getTotalSales())
                .totalRefunds(shiftReport.getTotalRefunds())
                .netSales(shiftReport.getNetSales())
                .totalOrders(shiftReport.getTotalOrders())
                .cashier(
                        shiftReport.getCashier() != null
                                ? UserMapper.toDTO(shiftReport.getCashier())
                                : null
                )
                .cashierId(
                        shiftReport.getCashier() != null
                                ? shiftReport.getCashier().getId()
                                : null
                )
                .branchId(
                        shiftReport.getBranch() != null
                                ? shiftReport.getBranch().getId()
                                : null
                )
                .recentOrders(mapOrders(shiftReport.getRecentOrders()))
                .topSellingProducts(
                        mapProduct(shiftReport.getTopSellingProducts())
                )
                .refunds(mapRefunds(shiftReport.getRefunds()))
                .paymentSummary(shiftReport.getPaymentSummary())
                .build();
    }

    private static List<RefundDto> mapRefunds(List<Refund> refunds) {
        if (refunds == null || refunds.isEmpty()) {
            return List.of();
        }

        return refunds.stream()
                .map(RefundMapper::toDto)
                .collect(Collectors.toList());
    }

    private static List<ProductDto> mapProduct(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return List.of();
        }

        return products.stream()
                .map(ProductMapper::mapToDto)
                .collect(Collectors.toList());
    }

    private static List<OrderDto> mapOrders(List<Order> orders) {
        if (orders == null || orders.isEmpty()) {
            return List.of();
        }

        return orders.stream()
                .map(OrderMapper::toOrderDto)
                .collect(Collectors.toList());
    }
}
