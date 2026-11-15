import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { ROLES, normalizeRole, getRoleDashboard } from "../constants/roles";

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const currentRole = normalizeRole(user.role);

  // Super Admin has master access across all role dashboards (Cashier, Branch/Manager, Store Admin)
  if (currentRole === ROLES.SUPER_ADMIN) {
    return children;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map(normalizeRole);
    if (!normalizedAllowed.includes(currentRole)) {
      // User is not authorized to access this role-restricted route
      const fallbackDashboard = getRoleDashboard(currentRole);
      return <Navigate to={fallbackDashboard} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
