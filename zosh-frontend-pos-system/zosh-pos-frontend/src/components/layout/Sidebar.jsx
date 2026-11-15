import { NavLink } from "@/lib/rr-compat";
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

  const label = { cashier: "Cashier", manager: "Branch manager", "store-admin": "Store admin", "super-admin": "Super admin" }[normalizedModule];
  const portals = [
    { to: "/super-admin/dashboard", label: "Super admin", icon: Building2 },
    { to: "/store-admin/dashboard", label: "Store admin", icon: Store },
    { to: "/manager/dashboard", label: "Branch manager", icon: GitBranch },
    { to: "/cashier/dashboard", label: "Cashier", icon: ShoppingCart },
  ];
  return (
    <aside className="workspace-sidebar">
      <div className="workspace-brand"><Store className="size-6 text-primary" /><span>Zosh<span className="font-normal text-muted-foreground"> / POS</span></span></div>
      <div className="workspace-context"><span className="workspace-context-label">WORKSPACE</span><span>{label}</span></div>
      {isSuperAdmin && <div className="workspace-portals">{portals.map(p => { const Icon = p.icon; return <NavLink key={p.to} to={p.to} title={p.label} className="workspace-portal"><Icon className="size-4" /><span>{p.label}</span></NavLink>; })}</div>}
      <nav className="workspace-nav" aria-label="Main navigation">
        {links.map(link => { const Icon = link.icon; return (
          <NavLink key={link.path} to={link.path} title={link.name} className={({ isActive }) => `workspace-link ${isActive ? "is-active" : ""}`}>
            <Icon className="size-[18px] shrink-0" strokeWidth={1.7} /><span>{link.name.replace(/Cashier Dashboard|Manager Dashboard|Store Admin Dashboard|Super Admin Dashboard/, "Overview")}</span>
            {link.badge != null && <span className="workspace-count">{link.badge}</span>}
          </NavLink>
        ); })}
      </nav>
      <div className="workspace-sidebar-footer"><ShieldCheck className="size-4" /><span>{isSuperAdmin ? "Full access" : label}<small>Zosh Retail</small></span></div>
    </aside>
  );
}
export default Sidebar;
