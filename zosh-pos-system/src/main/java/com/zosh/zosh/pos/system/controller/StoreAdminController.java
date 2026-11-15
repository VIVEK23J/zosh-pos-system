package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.config.RbacSecurityService;
import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.mapper.BranchMapper;
import com.zosh.zosh.pos.system.mapper.StoreMapper;
import com.zosh.zosh.pos.system.mapper.UserMapper;
import com.zosh.zosh.pos.system.payload.dto.BranchDto;
import com.zosh.zosh.pos.system.payload.dto.StoreDto;
import com.zosh.zosh.pos.system.payload.dto.UserDto;
import com.zosh.zosh.pos.system.repository.BranchRepository;
import com.zosh.zosh.pos.system.repository.ProductRepository;
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
@RequestMapping("/api/store-admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
public class StoreAdminController {

    private final RbacSecurityService rbac;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    private Store getTargetStore() throws Exception {
        User user = rbac.getCurrentUser();
        if (user == null) {
            throw new Exception("User not authenticated");
        }
        if (user.getStore() != null) {
            return user.getStore();
        }
        Store store = storeRepository.findByStoreAdminId(user.getId());
        if (store != null) {
            return store;
        }
        if (rbac.isSuperAdmin()) {
            return storeRepository.findAll().stream().findFirst().orElseThrow(() -> new Exception("No store available"));
        }
        throw new Exception("No store associated with this administrator");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getStoreDashboardStats() throws Exception {
        Store store = getTargetStore();
        List<Branch> branches = branchRepository.findAllByStoreId(store.getId());
        List<User> employees = userRepository.findByStore(store);

        Map<String, Object> stats = new HashMap<>();
        stats.put("store", StoreMapper.toDTO(store));
        stats.put("totalBranches", branches.size());
        stats.put("totalEmployees", employees.size());
        stats.put("totalProducts", productRepository.findByStoreId(store.getId()).size());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/store")
    public ResponseEntity<StoreDto> getMyStore() throws Exception {
        return ResponseEntity.ok(StoreMapper.toDTO(getTargetStore()));
    }

    @GetMapping("/branches")
    public ResponseEntity<List<BranchDto>> getStoreBranches() throws Exception {
        Store store = getTargetStore();
        return ResponseEntity.ok(
                branchRepository.findAllByStoreId(store.getId()).stream()
                        .map(BranchMapper::toDto)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/employees")
    public ResponseEntity<List<UserDto>> getStoreEmployees() throws Exception {
        Store store = getTargetStore();
        return ResponseEntity.ok(
                userRepository.findByStore(store).stream()
                        .map(UserMapper::toDTO)
                        .collect(Collectors.toList())
        );
    }
}
