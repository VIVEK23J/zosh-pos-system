package com.zosh.zosh.pos.system.config;

import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.repository.BranchRepository;
import com.zosh.zosh.pos.system.repository.StoreRepository;
import com.zosh.zosh.pos.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("rbac")
@RequiredArgsConstructor
public class RbacSecurityService {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName());
    }

    public boolean isSuperAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if ("ROLE_SUPER_ADMIN".equals(ga.getAuthority()) || "ROLE_ADMIN".equals(ga.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    public boolean isStoreAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if ("ROLE_STORE_ADMIN".equals(ga.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    public boolean isManager() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if ("ROLE_MANAGER".equals(ga.getAuthority()) || "ROLE_BRANCH_MANAGER".equals(ga.getAuthority()) || "ROLE_STORE_MANAGER".equals(ga.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    public boolean isCashier() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if ("ROLE_CASHIER".equals(ga.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    public boolean canAccessStore(Long storeId) {
        if (storeId == null) return false;
        if (isSuperAdmin()) return true;

        User user = getCurrentUser();
        if (user == null) return false;

        if (user.getStore() != null && storeId.equals(user.getStore().getId())) {
            return true;
        }

        Store store = storeRepository.findById(storeId).orElse(null);
        if (store != null && store.getStoreAdmin() != null && user.getId().equals(store.getStoreAdmin().getId())) {
            return true;
        }

        return false;
    }

    public boolean canManageStore(Long storeId) {
        if (storeId == null) return false;
        if (isSuperAdmin()) return true;
        if (!isStoreAdmin()) return false;
        return canAccessStore(storeId);
    }

    public boolean canAccessBranch(Long branchId) {
        if (branchId == null) return false;
        if (isSuperAdmin()) return true;

        User user = getCurrentUser();
        if (user == null) return false;

        Branch branch = branchRepository.findById(branchId).orElse(null);
        if (branch == null) return false;

        if (isStoreAdmin()) {
            if (user.getStore() != null && branch.getStore() != null
                    && user.getStore().getId().equals(branch.getStore().getId())) {
                return true;
            }
            if (branch.getStore() != null && branch.getStore().getStoreAdmin() != null
                    && branch.getStore().getStoreAdmin().getId().equals(user.getId())) {
                return true;
            }
            return false;
        }

        if (user.getBranch() != null && branchId.equals(user.getBranch().getId())) {
            return true;
        }

        return false;
    }

    public boolean canManageBranch(Long branchId) {
        if (branchId == null) return false;
        if (isSuperAdmin()) return true;

        User user = getCurrentUser();
        if (user == null) return false;

        if (isCashier()) return false;

        Branch branch = branchRepository.findById(branchId).orElse(null);
        if (branch == null) return false;

        if (isStoreAdmin()) {
            return user.getStore() != null && branch.getStore() != null
                    && user.getStore().getId().equals(branch.getStore().getId());
        }

        if (isManager()) {
            return user.getBranch() != null && branchId.equals(user.getBranch().getId());
        }

        return false;
    }

    public boolean canModifyEmployee(Long targetUserId) {
        if (targetUserId == null) return false;
        if (isSuperAdmin()) return true;

        User currentUser = getCurrentUser();
        if (currentUser == null) return false;

        // Self modification of role is prevented
        if (targetUserId.equals(currentUser.getId())) {
            return false;
        }

        User targetUser = userRepository.findById(targetUserId).orElse(null);
        if (targetUser == null) return false;

        if (targetUser.getRole() == UserRoles.ROLE_SUPER_ADMIN || targetUser.getRole() == UserRoles.ROLE_ADMIN) {
            return false;
        }

        if (isStoreAdmin()) {
            if (targetUser.getRole() == UserRoles.ROLE_STORE_ADMIN) {
                return false;
            }
            return currentUser.getStore() != null && targetUser.getStore() != null
                    && currentUser.getStore().getId().equals(targetUser.getStore().getId());
        }

        if (isManager()) {
            if (targetUser.getRole() != UserRoles.ROLE_CASHIER) {
                return false;
            }
            return currentUser.getBranch() != null && targetUser.getBranch() != null
                    && currentUser.getBranch().getId().equals(targetUser.getBranch().getId());
        }

        return false;
    }
}
