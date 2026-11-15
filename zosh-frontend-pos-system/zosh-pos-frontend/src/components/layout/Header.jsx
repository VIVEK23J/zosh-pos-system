import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "@/lib/rr-compat";
import {
  Bell,
  Search,
  Store,
  MapPin,
  Clock,
  User,
  LogOut,
  ChevronDown,
  ShieldAlert,
  CheckCircle2,
  Building2,
  GitBranch,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { logout } from "../../store/authSlice";
import { ROLES, ROLE_LABELS, normalizeRole } from "../../constants/roles";

export function Header({ onSearch, title }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, currentStore, currentBranch } = useSelector(
    (state) => state.auth
  );

  const [currentTime, setCurrentTime] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSuperAdminMenu, setShowSuperAdminMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isSuperAdmin = normalizeRole(user?.role) === ROLES.SUPER_ADMIN;

  const [notifications] = useState([
    {
      id: 1,
      title: "Low stock alert: Logitech Mouse",
      desc: "Only 3 items remaining in Sector 29 branch",
      time: "10m ago",
      type: "alert",
    },
    {
      id: 2,
      title: "Shift started successfully",
      desc: "Cashier Vivek opened register with ₹5,000 cash",
      time: "1h ago",
      type: "info",
    },
    {
      id: 3,
      title: "Daily backup completed",
      desc: "All transaction logs synced with central server",
      time: "3h ago",
      type: "success",
    },
  ]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  const getActiveModule = () => {
    const path = location.pathname;
    if (path.startsWith("/super-admin")) return "Super Admin HQ";
    if (path.startsWith("/store-admin")) return "Store Admin HQ";
    if (path.startsWith("/manager")) return "Branch Operations";
    if (path.startsWith("/cashier")) return "Cashier Terminal";
    return "";
  };

  const currentModule = getActiveModule();

  return (
    <header className="workspace-header">
      <div className="workspace-breadcrumb"><span>{currentStore?.brand || "Zosh POS"}</span><span className="text-muted-foreground">/</span><span className="text-muted-foreground">{currentBranch?.name || "Main Branch"}</span></div>
      {onSearch && <div className="workspace-search"><Search className="size-4" /><input placeholder="Search items, SKU, orders…" onChange={e => onSearch(e.target.value)} /></div>}
      <div className="workspace-header-actions">
        {isSuperAdmin && <div className="relative"><Button variant="ghost" onClick={() => setShowSuperAdminMenu(!showSuperAdminMenu)} title="Switch workspace"><ShieldCheck /><span className="hidden lg:inline">Workspaces</span><ChevronDown /></Button>{showSuperAdminMenu && <div className="workspace-menu">{[{path:"/super-admin/dashboard",name:"Super admin",icon:Building2},{path:"/store-admin/dashboard",name:"Store admin",icon:Store},{path:"/manager/dashboard",name:"Branch manager",icon:GitBranch},{path:"/cashier/dashboard",name:"Cashier",icon:ShoppingCart}].map(p => {const Icon=p.icon;return <Button key={p.path} variant="ghost" onClick={() => {setShowSuperAdminMenu(false);navigate(p.path);}}><Icon />{p.name}</Button>;})}</div>}</div>}
        <span className="workspace-clock">{currentTime}</span>
        <ThemeToggle />
        <div className="relative"><Button variant="ghost" size="icon" title="Notifications" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell /></Button>{showNotifications && <div className="workspace-menu notification-menu"><h3>Notifications</h3>{notifications.map(n => <div key={n.id} className="notification-row"><Bell className="size-4 shrink-0 text-muted-foreground" /><div><strong>{n.title}</strong><p>{n.desc}</p><small>{n.time}</small></div></div>)}</div>}</div>
        <div className="relative"><Button variant="ghost" className="profile-trigger" aria-label="Account menu" onClick={() => setShowUserMenu(!showUserMenu)}><span className="profile-avatar">{user?.fullName?.charAt(0) || "U"}</span><span className="profile-name">{user?.fullName || "User"}<small>{ROLE_LABELS[normalizeRole(user?.role)] || "Staff"}</small></span><ChevronDown /></Button>{showUserMenu && <div className="workspace-menu"><div className="menu-identity">{user?.fullName}<small>{user?.email}</small></div><Button variant="ghost" onClick={() => {setShowUserMenu(false);navigate("/store-admin/settings");}}><User />Account settings</Button><Button variant="ghost" onClick={handleLogout}><LogOut />Sign out</Button></div>}</div>
      </div>
    </header>
  );
}
export default Header;
