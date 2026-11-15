package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.payload.dto.InventoryDto;
import com.zosh.zosh.pos.system.payload.response.ApiResponse;
import com.zosh.zosh.pos.system.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inventories")
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN', 'MANAGER', 'BRANCH_MANAGER')")
    public ResponseEntity<InventoryDto> createInventory(
            @RequestBody InventoryDto inventoryDto) throws Exception {

        return ResponseEntity.ok(inventoryService.createInventory(inventoryDto));
    }

    @PutMapping("/branch/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN', 'MANAGER', 'BRANCH_MANAGER')")
    public ResponseEntity<InventoryDto> updateInventory(
            @PathVariable Long id,
            @RequestBody InventoryDto inventoryDto
    ) throws Exception {
        return ResponseEntity.ok(inventoryService.updateInventory(id, inventoryDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<ApiResponse> deleteInventory(@PathVariable Long id) throws Exception {
        inventoryService.deleteInventory(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Inventory deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/branch/{branchId}/product/{productId}")
    @PreAuthorize("@rbac.canAccessBranch(#branchId)")
    public ResponseEntity<InventoryDto> getInventoryByBranchIdAndProductId(
            @PathVariable Long branchId,
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(inventoryService.
                getInventoryByProductIdAndBranchId(productId, branchId));
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("@rbac.canAccessBranch(#branchId)")
    public ResponseEntity<List<InventoryDto>> getInventoryByBranchId(
            @PathVariable Long branchId
    ) {
        return ResponseEntity.ok(inventoryService.getInventoryByBranchId(branchId));
    }
}
