package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.payload.dto.UserDto;
import com.zosh.zosh.pos.system.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping("/store/{storeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN') and @rbac.canAccessStore(#storeId)")
    public ResponseEntity<UserDto> createStoreEmployee(@RequestBody UserDto userDto,
                                                       @PathVariable Long storeId) throws Exception {
        UserDto employee = employeeService.createStoreEmployee(userDto, storeId);
        return ResponseEntity.ok(employee);
    }

    @PostMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN', 'MANAGER', 'BRANCH_MANAGER') and @rbac.canAccessBranch(#branchId)")
    public ResponseEntity<UserDto> createBranchEmployee(
            @RequestBody UserDto userDto,
            @PathVariable Long branchId
    ) throws Exception {

        UserDto employee = employeeService.createBranchEmployee(userDto, branchId);
        return ResponseEntity.ok(employee);
    }

    @PutMapping("/{employeeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN', 'MANAGER', 'BRANCH_MANAGER') and @rbac.canModifyEmployee(#employeeId)")
    public ResponseEntity<User> updateEmployee(
            @PathVariable Long employeeId,
            @RequestBody UserDto userDto
    ) throws Exception {

        User updatedEmployee = employeeService.updateEmployee(employeeId, userDto);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{employeeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN') and @rbac.canModifyEmployee(#employeeId)")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable Long employeeId
    ) throws Exception {

        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.ok("Employee deleted successfully");
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("@rbac.canAccessStore(#storeId)")
    public ResponseEntity<List<UserDto>> findStoreEmployee(
            @PathVariable Long storeId,
            @RequestParam(required = false) UserRoles role
    ) throws Exception {

        List<UserDto> employees = employeeService.findStoreEmployee(storeId, role);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("@rbac.canAccessBranch(#branchId)")
    public ResponseEntity<List<UserDto>> findBranchEmployee(
            @PathVariable Long branchId,
            @RequestParam(required = false) UserRoles role
    ) throws Exception {

        List<UserDto> employees = employeeService.findBranchEmployee(branchId, role);
        return ResponseEntity.ok(employees);
    }
}
