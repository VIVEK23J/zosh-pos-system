package com.zosh.zosh.pos.system.enums;

public enum UserRoles {
    ROLE_SUPER_ADMIN,
    ROLE_STORE_ADMIN,
    ROLE_MANAGER,
    ROLE_CASHIER,

    // Legacy/compatibility role values matching existing database records
    ROLE_ADMIN,
    ROLE_BRANCH_MANAGER,
    ROLE_STORE_MANAGER,
    ROLE_USER;
}
