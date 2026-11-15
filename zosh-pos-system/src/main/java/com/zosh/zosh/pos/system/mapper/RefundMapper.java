package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.Refund;
import com.zosh.zosh.pos.system.payload.dto.RefundDto;
import lombok.Data;

@Data
public class RefundMapper {
    public static RefundDto toDto(Refund refund) {
        if (refund == null) {
            return null;
        }

        return RefundDto.builder()
                .id(refund.getId())
                .orderId(
                        refund.getOrder() != null
                                ? refund.getOrder().getOrderId()
                                : refund.getOrderId()
                )
                .reason(refund.getReason())
                .amount(refund.getAmount())
                .cashierName(
                        refund.getCashier() != null
                                ? refund.getCashier().getFullName()
                                : null
                )
                .branchId(
                        refund.getBranch() != null
                                ? refund.getBranch().getId()
                                : null
                )
                .shiftReportId(
                        refund.getShiftReport() != null
                                ? refund.getShiftReport().getId()
                                : null
                )
                .createdAt(refund.getCreatedAt())
                .build();
    }
}
