
package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.Order;
import com.zosh.zosh.pos.system.entity.Refund;
import com.zosh.zosh.pos.system.entity.ShiftReport;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.mapper.RefundMapper;
import com.zosh.zosh.pos.system.payload.dto.RefundDto;
import com.zosh.zosh.pos.system.repository.OrderRepository;
import com.zosh.zosh.pos.system.repository.RefundRepository;
import com.zosh.zosh.pos.system.repository.ShiftReportRepository;
import com.zosh.zosh.pos.system.service.RefundService;
import com.zosh.zosh.pos.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefundServiceImp implements RefundService {

    private final RefundRepository refundRepository;
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final ShiftReportRepository shiftReportRepository;

    @Override
    public RefundDto createRefund(Refund refund) throws Exception {

        User cashier = userService.getCurremtUser();

        Order order = orderRepository.findById(refund.getOrderId())
                .orElseThrow(() -> new Exception("Order not found"));

        Branch branch = order.getBranch();

        ShiftReport shiftReport = null;

        if (refund.getShiftReport() != null
                && refund.getShiftReport().getId() != null) {

            shiftReport = shiftReportRepository
                    .findById(refund.getShiftReport().getId())
                    .orElseThrow(() ->
                            new Exception("Shift report not found"));
        }

        Refund createdRefund = Refund.builder()
                .order(order)
                .cashier(cashier)
                .branch(branch)
                .shiftReport(shiftReport)
                .reason(refund.getReason())
                .amount(refund.getAmount())
                .createdAt(LocalDateTime.now())
                .build();

        return RefundMapper.toDto(
                refundRepository.save(createdRefund)
        );
    }

    @Override
    public List<RefundDto> getAllRefund() throws Exception {
        return refundRepository.findAll().stream()
                .map(RefundMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RefundDto> getRefundByCashierId(Long cashierId)
            throws Exception {
        return refundRepository.findByCashierId(cashierId).stream()
                .map(RefundMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RefundDto> getRefundByShiftReportId(Long shiftReportId)
            throws Exception {
        return refundRepository.findByShiftReportId(shiftReportId).stream()
                .map(RefundMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RefundDto> getRefundByCashierAndDateRange(
            Long cashierId,
            LocalDateTime startDate,
            LocalDateTime endDate) throws Exception {

        return refundRepository
                .findByCashierIdAndCreatedAtBetween(
                        cashierId, startDate, endDate)
                .stream()
                .map(RefundMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RefundDto> getRefundByBranchId(Long branchId)
            throws Exception {
        return refundRepository.findByBranchId(branchId).stream()
                .map(RefundMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public RefundDto getRefundByRefundId(Long refundId) throws Exception {
        return refundRepository.findById(refundId)
                .map(RefundMapper::toDto)
                .orElseThrow(() -> new Exception("Refund not found"));
    }

    @Override
    public void deleteRefund(Long refundId) throws Exception {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new Exception("Refund not found"));

        refundRepository.delete(refund);
    }
}
