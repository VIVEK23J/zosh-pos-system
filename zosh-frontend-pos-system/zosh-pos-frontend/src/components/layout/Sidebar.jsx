import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Clock,
  RotateCcw,
  Package,
  Layers,
  GitBranch,
  BarChart3,
  Settings,
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck2,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Store,
} from "lucide-react";
import { useSelector } from "react-redux";
import { ROLES, normalizeRole } from "../../constants/roles";

export function Sidebar({ module = "cashier" }) {
  const { user } = useSelector((state) => state.auth);
  const cartQuantity = useSelector((state) => state.cart.quantity);

  const userRole = normalizeRole(user?.role);
  const isSuperAdmin = userRole === ROLES.SUPER_ADMIN;

  // Normalize module key
  const normalizedModule = (() => {
    if (module === "super-admin" || module === "admin") return "super-admin";
    if (module === "store-admin" || module === "store") return "store-admin";
    if (module === "manager" || module === "branch") return "manager";
    return "cashier";
  })();

  const getLinks = () => {
    switch (normalizedModule) {
      case "cashier":
        return [
          { name: "Cashier Dashboard", path: "/cashier/dashboard", icon: LayoutDashboard },
          {
            name: "POS Terminal",
            path: "/cashier/pos",
            icon: ShoppingCart,
            badge: cartQuantity > 0 ? cartQuantity : null,
          },
          { name: "Customers", path: "/cashier/customers", icon: Users },
          { name: "Shift Reports", path: "/cashier/shifts", icon: Clock },
          { name: "Order History", path: "/cashier/orders", icon: FileCheck2 },
          { name: "Refunds", path: "/cashier/refunds", icon: RotateCcw },
        ];

      case "manager":
        return [
          { name: "Manager Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
          { name: "Branch Orders", path: "/manager/orders", icon: FileCheck2 },
          { name: "Inventory Tracking", path: "/manager/inventory", icon: Package },
          { name: "Branch Staff", path: "/manager/employees", icon: Users },
          { name: "Sales Reports", path: "/manager/reports", icon: BarChart3 },
          { name: "Branch Settings", path: "/manager/settings", icon: Settings },
        ];

      case "store-admin":
        return [
          { name: "Store Admin Dashboard", path: "/store-admin/dashboard", icon: LayoutDashboard },
          { name: "Branch Management", path: "/store-admin/branches", icon: GitBranch },
          { name: "Product Catalog", path: "/store-admin/products", icon: Package },
          { name: "Categories", path: "/store-admin/categories", icon: Layers },
          { name: "Employee Directory", path: "/store-admin/employees", icon: Users },
          { name: "Store Analytics", path: "/store-admin/analytics", icon: TrendingUp },
          { name: "Upgrade Plan", path: "/store-admin/subscription", icon: Sparkles },
          { name: "Store Settings", path: "/store-admin/settings", icon: Settings },
        ];

      case "super-admin":
        return [
          { name: "Super Admin Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
          { name: "Stores Directory", path: "/super-admin/stores", icon: Building2 },
          { name: "Pending Requests", path: "/super-admin/requests", icon: ShieldCheck },
          { name: "Subscriptions", path: "/super-admin/subscriptions", icon: CreditCard },
          { name: "Platform Analytics", path: "/super-admin/analytics", icon: BarChart3 },
        ];

      default:
        return [];
    }
  };

  const links = getLinks();

  const getModuleBadge = () => {
    switch (normalizedModule) {
      case "cashier":
        return { label: "Cashier", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" };
      case "manager":
        return { label: "Manager", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" };
      case "store-admin":
        return { label: "Store Admin", color: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300" };
      case "super-admin":
        return { label: "Super Admin", color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" };
      default:
        return { label: "POS", color: "bg-gray-100 text-gray-800" };
    }
  };

  const badge = getModuleBadge();

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between min-h-screen transition-colors">
      <div>
        {/* Brand Banner */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
                ZOSH POS
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isSuperAdmin ? "Super Admin Full Access" : "Role-Based Control Active"}
            </p>
          </div>
        </div>

        {/* Super Admin Quick Portal Switcher */}
        {isSuperAdmin && (
          <div className="p-3 pb-0">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              <span>Full Access Portals</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800 text-[11px] font-medium">
              <NavLink
                to="/super-admin/dashboard"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    isActive
                      ? "bg-amber-500 text-white font-bold shadow-xs"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                <Building2 className="size-3.5" />
                <span>Super Admin</span>
              </NavLink>
              <NavLink
                to="/store-admin/dashboard"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    isActive
                      ? "bg-purple-600 text-white font-bold shadow-xs"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                <Store className="size-3.5" />
                <span>Store Admin</span>
              </NavLink>
              <NavLink
                to="/manager/dashboard"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                <GitBranch className="size-3.5" />
                <span>Manager</span>
              </NavLink>
              <NavLink
                to="/cashier/dashboard"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    isActive
                      ? "bg-emerald-600 text-white font-bold shadow-xs"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                <ShoppingCart className="size-3.5" />
                <span>Cashier POS</span>
              </NavLink>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {badge.label} Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-sm shadow-emerald-900/10"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`size-4 ${isActive ? "text-white" : "text-gray-400 dark:text-gray-500"}`} />
                      <span>{link.name}</span>
                    </div>

                    {link.badge !== null && link.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white text-emerald-800"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}

                    {isActive && !link.badge && (
                      <ChevronRight className="size-3.5 text-emerald-200" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 m-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/80 text-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px]">
            {isSuperAdmin ? "Super Admin Full Access" : `Role: ${badge.label}`}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {isSuperAdmin
            ? "Master access to Cashier, Branch & Store"
            : "Spring Security RBAC • Strict Policy"}
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
