package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.config.RbacSecurityService;
import com.zosh.zosh.pos.system.entity.Order;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.mapper.OrderMapper;
import com.zosh.zosh.pos.system.payload.dto.OrderDto;
import com.zosh.zosh.pos.system.payload.dto.ShiftReportDto;
import com.zosh.zosh.pos.system.repository.OrderRepository;
import com.zosh.zosh.pos.system.service.ShiftReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cashier")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN', 'MANAGER', 'BRANCH_MANAGER', 'STORE_MANAGER', 'CASHIER')")
public class CashierController {

    private final RbacSecurityService rbac;
    private final OrderRepository orderRepository;
    private final ShiftReportService shiftReportService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getCashierDashboard() {
        User user = rbac.getCurrentUser();
        Map<String, Object> stats = new HashMap<>();

        if (user != null) {
            List<Order> myOrders = orderRepository.findByCashierId(user.getId());
            double totalSales = myOrders.stream()
                    .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                    .sum();

            stats.put("totalTransactions", myOrders.size());
            stats.put("totalSales", totalSales);
            stats.put("recentOrders", myOrders.stream()
                    .limit(5)
                    .map(OrderMapper::toOrderDto)
                    .collect(Collectors.toList()));
        } else {
            stats.put("totalTransactions", 0);
            stats.put("totalSales", 0.0);
        }

        try {
            ShiftReportDto shift = shiftReportService.getCurrentShiftProgress(null);
            stats.put("activeShift", shift);
        } catch (Exception e) {
            stats.put("activeShift", null);
        }

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/shift-status")
    public ResponseEntity<Map<String, Object>> getShiftStatus() {
        Map<String, Object> result = new HashMap<>();
        try {
            ShiftReportDto shift = shiftReportService.getCurrentShiftProgress(null);
            result.put("hasActiveShift", shift != null);
            result.put("shift", shift);
        } catch (Exception e) {
            result.put("hasActiveShift", false);
            result.put("shift", null);
        }
        return ResponseEntity.ok(result);
    }
}
