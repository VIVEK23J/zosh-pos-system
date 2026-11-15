package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.config.RbacSecurityService;
import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.mapper.UserMapper;
import com.zosh.zosh.pos.system.payload.dto.UserDto;
import com.zosh.zosh.pos.system.repository.BranchRepository;
import com.zosh.zosh.pos.system.repository.StoreRepository;
import com.zosh.zosh.pos.system.repository.UserRepository;
import com.zosh.zosh.pos.system.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImp implements EmployeeService {
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final RbacSecurityService rbac;

    @Override
    public UserDto createStoreEmployee(UserDto employee, Long storeId) throws Exception {
        if (!rbac.isSuperAdmin() && !rbac.canAccessStore(storeId)) {
            throw new AccessDeniedException("Access denied: You cannot manage employees for this store");
        }

        // Prevent unauthorized role elevation
        if (!rbac.isSuperAdmin()) {
            if (employee.getRole() == UserRoles.ROLE_SUPER_ADMIN || employee.getRole() == UserRoles.ROLE_ADMIN) {
                throw new AccessDeniedException("Access denied: You cannot create or assign administrator accounts");
            }
        }

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new Exception("Store not found"));

        Branch branch = null;
        if (employee.getBranchId() != null) {
            branch = branchRepository.findById(employee.getBranchId())
                    .orElseThrow(() -> new Exception("Branch not found"));
        }

        if ((employee.getRole() == UserRoles.ROLE_BRANCH_MANAGER || employee.getRole() == UserRoles.ROLE_MANAGER)
                && branch == null) {
            throw new Exception("Branch ID is required for branch manager");
        }

        User user = UserMapper.toEntity(employee);
        user.setStore(store);
        user.setBranch(branch);
        user.setPassword(passwordEncoder.encode(employee.getPassword()));

        User savedUser = userRepository.save(user);

        if ((employee.getRole() == UserRoles.ROLE_BRANCH_MANAGER || employee.getRole() == UserRoles.ROLE_MANAGER)
                && branch != null) {
            branch.setManager(savedUser);
            branchRepository.save(branch);
        }

        return UserMapper.toDTO(savedUser);
    }

    @Override
    public UserDto createBranchEmployee(UserDto employee, Long branchId) throws Exception {
        if (!rbac.isSuperAdmin() && !rbac.canAccessBranch(branchId)) {
            throw new AccessDeniedException("Access denied: You cannot manage employees for this branch");
        }

        // Manager can only create cashiers
        if (rbac.isManager()) {
            if (employee.getRole() != UserRoles.ROLE_CASHIER) {
                throw new AccessDeniedException("Access denied: Managers can only create Cashier accounts");
            }
        } else if (!rbac.isSuperAdmin()) {
            if (employee.getRole() == UserRoles.ROLE_SUPER_ADMIN || employee.getRole() == UserRoles.ROLE_ADMIN) {
                throw new AccessDeniedException("Access denied: You cannot create administrator accounts");
            }
        }

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new Exception("Branch not found"));

        User user = UserMapper.toEntity(employee);
        user.setBranch(branch);
        user.setStore(branch.getStore());
        user.setPassword(passwordEncoder.encode(employee.getPassword()));
        return UserMapper.toDTO(userRepository.save(user));
    }

    @Override
    public User updateEmployee(Long employeeId, UserDto employeeDetails) throws Exception {
        User currentUser = rbac.getCurrentUser();
        if (currentUser != null && currentUser.getId().equals(employeeId)) {
            // Cannot modify own role
            if (employeeDetails.getRole() != null && employeeDetails.getRole() != currentUser.getRole()) {
                throw new AccessDeniedException("Access denied: You cannot change your own role");
            }
        }

        if (!rbac.isSuperAdmin() && !rbac.canModifyEmployee(employeeId)) {
            throw new AccessDeniedException("Access denied: You cannot modify this employee");
        }

        User existingEmployee = userRepository.findById(employeeId).orElseThrow(
                () -> new Exception("Employee not found")
        );

        Branch branch = existingEmployee.getBranch();
        if (employeeDetails.getBranchId() != null) {
            branch = branchRepository.findById(employeeDetails.getBranchId()).orElseThrow(
                    () -> new Exception("Branch not found")
            );
        }

        if (employeeDetails.getEmail() != null) {
            existingEmployee.setEmail(employeeDetails.getEmail());
        }
        if (employeeDetails.getFullName() != null) {
            existingEmployee.setFullName(employeeDetails.getFullName());
        }
        if (employeeDetails.getPhone() != null) {
            existingEmployee.setPhone(employeeDetails.getPhone());
        }
        if (employeeDetails.getPassword() != null && !employeeDetails.getPassword().isBlank()) {
            existingEmployee.setPassword(passwordEncoder.encode(employeeDetails.getPassword()));
        }
        if (employeeDetails.getRole() != null) {
            if (!rbac.isSuperAdmin() && (employeeDetails.getRole() == UserRoles.ROLE_SUPER_ADMIN || employeeDetails.getRole() == UserRoles.ROLE_ADMIN)) {
                throw new AccessDeniedException("Access denied: You cannot elevate roles to Super Admin");
            }
            existingEmployee.setRole(employeeDetails.getRole());
        }
        existingEmployee.setBranch(branch);
        existingEmployee.setUpdated_at(LocalDateTime.now());

        return userRepository.save(existingEmployee);
    }

    @Override
    public void deleteEmployee(Long employeeId) throws Exception {
        if (!rbac.isSuperAdmin() && !rbac.canModifyEmployee(employeeId)) {
            throw new AccessDeniedException("Access denied: You cannot delete this employee");
        }
        User existingEmployee = userRepository.findById(employeeId).orElseThrow(
                () -> new Exception("Employee not found")
        );
        userRepository.delete(existingEmployee);
    }

    @Override
    public List<UserDto> findStoreEmployee(Long storeId, UserRoles roles) throws Exception {
        if (!rbac.canAccessStore(storeId)) {
            throw new AccessDeniedException("Access denied: You cannot view employees for this store");
        }
        Store store = storeRepository.findById(storeId).orElseThrow(
                () -> new Exception("Store not found")
        );
        return userRepository.findByStore(store).stream()
                .filter(user -> roles == null || user.getRole() == roles)
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> findBranchEmployee(Long branchId, UserRoles roles) throws Exception {
        if (!rbac.canAccessBranch(branchId)) {
            throw new AccessDeniedException("Access denied: You cannot view employees for this branch");
        }
        Branch branch = branchRepository.findById(branchId).orElseThrow(
                () -> new Exception("Branch not found")
        );

        return userRepository.findByBranchId(branchId)
                .stream()
                .filter(user -> roles == null || user.getRole() == roles)
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }
}
