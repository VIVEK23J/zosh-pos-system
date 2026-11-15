package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.entity.Refund;
import com.zosh.zosh.pos.system.payload.dto.RefundDto;
import com.zosh.zosh.pos.system.payload.response.ApiResponse;
import com.zosh.zosh.pos.system.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/refunds")
public class RefundController {
    private final RefundService refundService;

    @PostMapping
    public ResponseEntity<RefundDto> createRefund(@RequestBody Refund refund) throws Exception {
        return ResponseEntity.ok(refundService.createRefund(refund));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<List<RefundDto>> getAllRefund() throws Exception {
        return ResponseEntity.ok(refundService.getAllRefund());
    }

    @GetMapping("/cashierId/{cashierId}")
    public ResponseEntity<List<RefundDto>> getRefundByCashierId(@PathVariable Long cashierId) throws Exception {
        return ResponseEntity.ok(refundService.getRefundByCashierId(cashierId));
    }

    @GetMapping("/branchId/{branchId}")
    @PreAuthorize("@rbac.canAccessBranch(#branchId)")
    public ResponseEntity<List<RefundDto>> getRefundByBranchId(@PathVariable Long branchId) throws Exception {
        return ResponseEntity.ok(refundService.getRefundByBranchId(branchId));
    }

    @GetMapping("/refundId/{refundId}")
    public ResponseEntity<RefundDto> getRefundById(@PathVariable Long refundId) throws Exception {
        return ResponseEntity.ok(refundService.getRefundByRefundId(refundId));
    }

    @GetMapping("/shiftRefundId/{shiftRefundId}")
    public ResponseEntity<List<RefundDto>> getRefundByShiftRefundId(@PathVariable Long shiftRefundId) throws Exception {
        return ResponseEntity.ok(refundService.getRefundByShiftReportId(shiftRefundId));
    }

    @GetMapping("/cashier/{cashierId}/range")
    public ResponseEntity<List<RefundDto>> getRefundByCashierAndDateRange(
            @PathVariable Long cashierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) throws Exception {
        List<RefundDto> refund = refundService.getRefundByCashierAndDateRange(
                cashierId,
                startDate,
                endDate
        );
        return ResponseEntity.ok(refund);
    }

    @DeleteMapping("/{refundId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse> deleteRefund(@PathVariable Long refundId) throws Exception {
        refundService.deleteRefund(refundId);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Refund deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
