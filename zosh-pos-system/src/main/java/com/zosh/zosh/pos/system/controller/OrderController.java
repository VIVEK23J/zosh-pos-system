package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.enums.OrderStatus;
import com.zosh.zosh.pos.system.enums.PaymentType;
import com.zosh.zosh.pos.system.payload.dto.OrderDto;
import com.zosh.zosh.pos.system.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto)
            throws Exception {
        return ResponseEntity.ok(orderService.createOrder(orderDto));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() throws Exception {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/branch/{id}")
    public ResponseEntity<List<OrderDto>> getOrdersByBranchId(
            @PathVariable Long id,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long cashierId,
            @RequestParam(required = false) PaymentType paymentType,
            @RequestParam(required = false) OrderStatus status) throws Exception {

        return ResponseEntity.ok(orderService.getOrdersByBranch
                (id, customerId, cashierId, paymentType, status));
    }

    @GetMapping("/cashier/{cashierId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCashierId(@PathVariable Long cashierId) throws Exception {
        return ResponseEntity.ok(orderService.getOrdersByCashier(cashierId));
    }

    @GetMapping("/today/branch/{id}")
    @PreAuthorize("@rbac.canAccessBranch(#id)")
    public ResponseEntity<List<OrderDto>> getOrdersByTodayBranchId(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(orderService.getTodayOrdersByBranch(id));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(id));
    }

    @GetMapping("/recent/{branchId}")
    @PreAuthorize("@rbac.canAccessBranch(#branchId)")
    public ResponseEntity<List<OrderDto>> getRecentOrdersByBranchId(@PathVariable Long branchId) throws Exception {
        return ResponseEntity.ok(orderService.getTop5RecentOrdersByBranchId(branchId));
    }
}
