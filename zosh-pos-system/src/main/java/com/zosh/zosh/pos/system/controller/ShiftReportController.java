package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.payload.dto.ShiftReportDto;
import com.zosh.zosh.pos.system.service.ShiftReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shiftReport")
public class ShiftReportController {
    private final ShiftReportService shiftReportService;

    @PostMapping("/start")
    public ResponseEntity<ShiftReportDto> startShiftReport() throws Exception {
        return ResponseEntity.ok(shiftReportService.startShift());
    }

    @PatchMapping("/end")
    public ResponseEntity<ShiftReportDto> endShiftReport(
            @RequestParam(required = false) Long shiftReportId
    ) throws Exception {
        return ResponseEntity.ok(shiftReportService.endShift(shiftReportId, null));
    }

    @GetMapping("/current")
    public ResponseEntity<ShiftReportDto> getCurrentShiftReport() throws Exception {
        return ResponseEntity.ok(shiftReportService.getCurrentShiftProgress(null));
    }

    @GetMapping("/cashier/{cashierId}/by-date")
    public ResponseEntity<ShiftReportDto> getShiftReportByDate(
            @PathVariable Long cashierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftByCashierAndDate(cashierId, date));
    }

    @GetMapping("/cashier/{cashierId}")
    public ResponseEntity<List<ShiftReportDto>> getShiftReportByCashierId(
            @PathVariable Long cashierId
    ) throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftReportByCashier(cashierId));
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("@rbac.canAccessBranch(#branchId)")
    public ResponseEntity<List<ShiftReportDto>> getShiftReportByBranchId(
            @PathVariable Long branchId
    ) throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftReportByBranchId(branchId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftReportDto> getShiftReportById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftReportById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<ShiftReportDto>> getAllShiftReport() throws Exception {
        return ResponseEntity.ok(shiftReportService.getAllShiftReports());
    }
}
