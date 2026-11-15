export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  STORE_ADMIN: "STORE_ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.STORE_ADMIN]: "Store Admin",
  [ROLES.MANAGER]: "Branch Manager",
  [ROLES.CASHIER]: "Cashier",
};

/**
 * Normalizes backend role representations (including legacy values)
 * into one of the four supported RBAC roles.
 */
export function normalizeRole(role) {
  if (!role) return "";
  const upper = String(role).toUpperCase();

  if (upper === "ROLE_SUPER_ADMIN" || upper === "ROLE_ADMIN" || upper === "SUPER_ADMIN") {
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
    upper === "STORE_MANAGER" ||
    upper === "MANAGER"
  ) {
    return ROLES.MANAGER;
  }
  if (upper === "ROLE_CASHIER" || upper === "CASHIER") {
    return ROLES.CASHIER;
  }

  return upper;
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
