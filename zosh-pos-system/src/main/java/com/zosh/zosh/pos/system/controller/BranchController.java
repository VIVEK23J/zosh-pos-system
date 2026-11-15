package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.payload.dto.BranchDto;
import com.zosh.zosh.pos.system.payload.response.ApiResponse;
import com.zosh.zosh.pos.system.service.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<BranchDto> createBranch(@RequestBody BranchDto branchDto) throws UserException {
        BranchDto createBranch = branchService.createBranch(branchDto);
        return ResponseEntity.ok(createBranch);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@rbac.canAccessBranch(#id)")
    public ResponseEntity<BranchDto> getBranchById(@PathVariable Long id) throws Exception {
        BranchDto branch = branchService.getBranchById(id);
        return ResponseEntity.ok(branch);
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("@rbac.canAccessStore(#storeId)")
    public ResponseEntity<List<BranchDto>> getBranchByStore(@PathVariable Long storeId) throws Exception {
        List<BranchDto> getBranches = branchService.getAllBranchesByStoreId(storeId);
        return ResponseEntity.ok(getBranches);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN', 'MANAGER', 'BRANCH_MANAGER') and @rbac.canManageBranch(#id)")
    public ResponseEntity<BranchDto> updateBranch(@PathVariable Long id, @RequestBody BranchDto branchDto) throws Exception {
        BranchDto updateBranch = branchService.updateBranch(id, branchDto);
        return ResponseEntity.ok(updateBranch);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<ApiResponse> deleteBranch(@PathVariable Long id) throws Exception {
        branchService.deleteBranch(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Branch deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
