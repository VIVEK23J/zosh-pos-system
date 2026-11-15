package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.StoreStatus;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.mapper.StoreMapper;
import com.zosh.zosh.pos.system.mapper.UserMapper;
import com.zosh.zosh.pos.system.payload.dto.StoreDto;
import com.zosh.zosh.pos.system.payload.dto.UserDto;
import com.zosh.zosh.pos.system.repository.BranchRepository;
import com.zosh.zosh.pos.system.repository.OrderRepository;
import com.zosh.zosh.pos.system.repository.StoreRepository;
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
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class SuperAdminController {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalStores = storeRepository.count();
        long totalBranches = branchRepository.count();
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();

        List<Store> stores = storeRepository.findAll();
        long activeStores = stores.stream().filter(s -> s.getStoreStatus() == StoreStatus.ACTIVE).count();
        long pendingStores = stores.stream().filter(s -> s.getStoreStatus() == StoreStatus.PENDING).count();

        stats.put("totalStores", totalStores);
        stats.put("activeStores", activeStores);
        stats.put("pendingStores", pendingStores);
        stats.put("totalBranches", totalBranches);
        stats.put("totalUsers", totalUsers);
        stats.put("totalOrders", totalOrders);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stores")
    public ResponseEntity<List<StoreDto>> getAllStores() {
        return ResponseEntity.ok(
                storeRepository.findAll().stream().map(StoreMapper::toDTO).collect(Collectors.toList())
        );
    }

    @PutMapping("/stores/{id}/status")
    public ResponseEntity<StoreDto> updateStoreStatus(@PathVariable Long id, @RequestParam StoreStatus status) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(() -> new Exception("Store not found"));
        store.setStoreStatus(status);
        return ResponseEntity.ok(StoreMapper.toDTO(storeRepository.save(store)));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream().map(UserMapper::toDTO).collect(Collectors.toList())
        );
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable Long id, @RequestParam UserRoles role) throws Exception {
        User user = userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));
        user.setRole(role);
        return ResponseEntity.ok(UserMapper.toDTO(userRepository.save(user)));
    }
}
