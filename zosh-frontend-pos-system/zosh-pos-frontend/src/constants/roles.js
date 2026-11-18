export const ROLES = {
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  STORE_ADMIN: "ROLE_STORE_ADMIN",
  MANAGER: "ROLE_MANAGER",
  CASHIER: "ROLE_CASHIER",
  BRANCH_ADMIN: "ROLE_MANAGER",
  BRANCH_MANAGER: "ROLE_MANAGER",
  ADMIN: "ROLE_SUPER_ADMIN",
  USER: "ROLE_CASHIER",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.STORE_ADMIN]: "Store Admin",
  [ROLES.MANAGER]: "Branch Manager",
  [ROLES.CASHIER]: "Cashier",
  // Legacy / Unprefixed alias support
  SUPER_ADMIN: "Super Admin",
  STORE_ADMIN: "Store Admin",
  MANAGER: "Branch Manager",
  BRANCH_ADMIN: "Branch Manager",
  BRANCH_MANAGER: "Branch Manager",
  CASHIER: "Cashier",
};

/**
 * Normalizes backend role representations (including legacy and unprefixed values)
 * into the canonical Spring Boot UserRoles enum values.
 */
export function normalizeRole(role) {
  if (!role) return "";
  const upper = String(role).toUpperCase();

  if (
    upper === "ROLE_SUPER_ADMIN" ||
    upper === "ROLE_ADMIN" ||
    upper === "SUPER_ADMIN" ||
    upper === "ADMIN"
  ) {
    return ROLES.SUPER_ADMIN;
  }
  if (upper === "ROLE_STORE_ADMIN" || upper === "STORE_ADMIN") {
    return ROLES.STORE_ADMIN;
  }
  if (
    upper === "ROLE_MANAGER" ||
    upper === "ROLE_BRANCH_MANAGER" ||
    upper === "ROLE_STORE_MANAGER" ||
    upper === "BRANCH_MANAGER" ||
    upper === "BRANCH_ADMIN" ||
    upper === "ROLE_BRANCH_ADMIN" ||
    upper === "STORE_MANAGER" ||
    upper === "MANAGER"
  ) {
    return ROLES.MANAGER;
  }
  if (
    upper === "ROLE_CASHIER" ||
    upper === "CASHIER" ||
    upper === "ROLE_USER" ||
    upper === "USER"
  ) {
    return ROLES.CASHIER;
  }

  return upper.startsWith("ROLE_") ? upper : `ROLE_${upper}`;
}

/**
 * Returns the designated dashboard path for each role.
 */
export function getRoleDashboard(role) {
  const norm = normalizeRole(role);
  switch (norm) {
    case ROLES.SUPER_ADMIN:
      return "/super-admin/dashboard";
    case ROLES.STORE_ADMIN:
      return "/store-admin/dashboard";
    case ROLES.MANAGER:
      return "/manager/dashboard";
    case ROLES.CASHIER:
      return "/cashier/dashboard";
    default:
      return "/auth/login";
  }
}
