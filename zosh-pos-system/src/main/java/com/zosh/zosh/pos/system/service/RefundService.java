package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.entity.Refund;
import com.zosh.zosh.pos.system.payload.dto.RefundDto;

import java.time.LocalDateTime;
import java.util.List;

public interface RefundService {
    RefundDto createRefund(Refund refund)throws Exception;
    List<RefundDto> getAllRefund()throws Exception;
    List<RefundDto> getRefundByCashierId(Long cashierId)throws Exception;
    List<RefundDto> getRefundByShiftReportId(Long shiftReportId)throws Exception;
    List<RefundDto> getRefundByCashierAndDateRange(Long cashierId,
                                                   LocalDateTime startDate,
                                                   LocalDateTime endDate)throws Exception;
    List<RefundDto> getRefundByBranchId(Long branchId)throws Exception;

    RefundDto getRefundByRefundId(Long refundId)throws Exception;

    void deleteRefund(Long refundId)throws Exception;

}
