package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.config.RbacSecurityService;
import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.mapper.BranchMapper;
import com.zosh.zosh.pos.system.mapper.InventoryMapper;
import com.zosh.zosh.pos.system.mapper.OrderMapper;
import com.zosh.zosh.pos.system.mapper.UserMapper;
import com.zosh.zosh.pos.system.payload.dto.BranchDto;
import com.zosh.zosh.pos.system.payload.dto.InventoryDto;
import com.zosh.zosh.pos.system.payload.dto.OrderDto;
import com.zosh.zosh.pos.system.payload.dto.UserDto;
import com.zosh.zosh.pos.system.repository.BranchRepository;
import com.zosh.zosh.pos.system.repository.InventoryRepository;
import com.zosh.zosh.pos.system.repository.OrderRepository;
import com.zosh.zosh.pos.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN', 'MANAGER', 'BRANCH_MANAGER', 'STORE_MANAGER')")
public class ManagerController {

    private final RbacSecurityService rbac;
    private final BranchRepository branchRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    private Branch getTargetBranch() throws Exception {
        User user = rbac.getCurrentUser();
        if (user == null) {
            throw new Exception("User not authenticated");
        }
        if (user.getBranch() != null) {
            return user.getBranch();
        }
        if (user.getStore() != null) {
            List<Branch> branches = branchRepository.findAllByStoreId(user.getStore().getId());
            if (!branches.isEmpty()) {
                return branches.get(0);
            }
        }
        if (rbac.isSuperAdmin()) {
            return branchRepository.findAll().stream().findFirst().orElseThrow(() -> new Exception("No branch found"));
        }
        throw new Exception("No branch assigned to this manager");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getManagerDashboardStats() throws Exception {
        Branch branch = getTargetBranch();
        var inventories = inventoryRepository.findByBranchId(branch.getId());
        var orders = orderRepository.findByBranchId(branch.getId());
        var cashiers = userRepository.findByBranchId(branch.getId()).stream()
                .filter(u -> u.getRole() == UserRoles.ROLE_CASHIER)
                .toList();

        double totalSales = orders.stream()
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("branch", BranchMapper.toDto(branch));
        stats.put("totalInventoryItems", inventories.size());
        stats.put("totalOrders", orders.size());
        stats.put("totalSales", totalSales);
        stats.put("totalCashiers", cashiers.size());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/branch")
    public ResponseEntity<BranchDto> getMyBranch() throws Exception {
        return ResponseEntity.ok(BranchMapper.toDto(getTargetBranch()));
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryDto>> getBranchInventory() throws Exception {
        Branch branch = getTargetBranch();
        return ResponseEntity.ok(
                inventoryRepository.findByBranchId(branch.getId()).stream()
                        .map(InventoryMapper::toDto)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getBranchOrders() throws Exception {
        Branch branch = getTargetBranch();
        return ResponseEntity.ok(
                orderRepository.findByBranchId(branch.getId()).stream()
                        .map(OrderMapper::toOrderDto)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/cashiers")
    public ResponseEntity<List<UserDto>> getBranchCashiers() throws Exception {
        Branch branch = getTargetBranch();
        return ResponseEntity.ok(
                userRepository.findByBranchId(branch.getId()).stream()
                        .filter(u -> u.getRole() == UserRoles.ROLE_CASHIER)
                        .map(UserMapper::toDTO)
                        .collect(Collectors.toList())
        );
    }
}
