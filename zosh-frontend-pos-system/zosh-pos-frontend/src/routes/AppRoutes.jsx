import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES, normalizeRole, getRoleDashboard } from "../constants/roles";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import CashierLayout from "../layouts/CashierLayout";
import BranchLayout from "../layouts/BranchLayout";
import StoreLayout from "../layouts/StoreLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import OtpVerification from "../pages/auth/OtpVerification";

// Cashier Pages
import CashierDashboard from "../pages/cashier/CashierDashboard";
import POS from "../pages/cashier/POS";
import Customers from "../pages/cashier/Customers";
import ShiftReports from "../pages/cashier/ShiftReports";
import Orders from "../pages/cashier/Orders";
import Refunds from "../pages/cashier/Refunds";

// Manager / Branch Pages
import BranchDashboard from "../pages/branch/BranchDashboard";
import BranchOrders from "../pages/branch/BranchOrders";
import BranchInventory from "../pages/branch/BranchInventory";
import BranchEmployees from "../pages/branch/BranchEmployees";
import BranchReports from "../pages/branch/BranchReports";
import BranchSettings from "../pages/branch/BranchSettings";

// Store Admin Pages
import StoreDashboard from "../pages/store/StoreDashboard";
import Branches from "../pages/store/Branches";
import Products from "../pages/store/Products";
import Categories from "../pages/store/Categories";
import StoreEmployees from "../pages/store/StoreEmployees";
import StoreAnalytics from "../pages/store/StoreAnalytics";
import Subscription from "../pages/store/Subscription";
import StoreSettings from "../pages/store/StoreSettings";

// Super Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import PendingRequests from "../pages/admin/PendingRequests";
import SubscriptionManagement from "../pages/admin/SubscriptionManagement";
import StoresDirectory from "../pages/admin/StoresDirectory";
import SystemAnalytics from "../pages/admin/SystemAnalytics";

function DefaultRedirect() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  const role = normalizeRole(user.role);
  return <Navigate to={getRoleDashboard(role)} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<DefaultRedirect />} />

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="otp-verify" element={<OtpVerification />} />
      </Route>

      {/* Cashier Routes (Accessible by CASHIER and SUPER_ADMIN) */}
      <Route
        path="/cashier"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CASHIER, ROLES.SUPER_ADMIN]}>
            <CashierLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/cashier/dashboard" replace />} />
        <Route path="dashboard" element={<CashierDashboard />} />
        <Route path="pos" element={<POS />} />
        <Route path="customers" element={<Customers />} />
        <Route path="shifts" element={<ShiftReports />} />
        <Route path="orders" element={<Orders />} />
        <Route path="refunds" element={<Refunds />} />
      </Route>

      {/* Manager Routes (Accessible by MANAGER and SUPER_ADMIN) */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.SUPER_ADMIN]}>
            <BranchLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="dashboard" element={<BranchDashboard />} />
        <Route path="orders" element={<BranchOrders />} />
        <Route path="inventory" element={<BranchInventory />} />
        <Route path="employees" element={<BranchEmployees />} />
        <Route path="reports" element={<BranchReports />} />
        <Route path="settings" element={<BranchSettings />} />
      </Route>

      {/* Store Admin Routes (Accessible by STORE_ADMIN and SUPER_ADMIN) */}
      <Route
        path="/store-admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, ROLES.SUPER_ADMIN]}>
            <StoreLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/store-admin/dashboard" replace />} />
        <Route path="dashboard" element={<StoreDashboard />} />
        <Route path="branches" element={<Branches />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="employees" element={<StoreEmployees />} />
        <Route path="analytics" element={<StoreAnalytics />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="settings" element={<StoreSettings />} />
      </Route>

      {/* Super Admin Routes (Protected: SUPER_ADMIN only) */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="requests" element={<PendingRequests />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="stores" element={<StoresDirectory />} />
        <Route path="analytics" element={<SystemAnalytics />} />
      </Route>

      {/* Backward-compatibility aliases */}
      <Route path="/admin/*" element={<Navigate to="/super-admin/dashboard" replace />} />
      <Route path="/store/*" element={<Navigate to="/store-admin/dashboard" replace />} />
      <Route path="/branch/*" element={<Navigate to="/manager/dashboard" replace />} />

      {/* Fallback */}
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
}

export default AppRoutes;
