import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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
    <header className="h-16 px-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left info: Store & Branch badge */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-sm">
            <Store className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                {currentStore?.brand || "Zosh POS"}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <MapPin className="size-3 text-emerald-600" />
              <span>{currentBranch?.name || "Main Branch"}</span>
            </div>
          </div>
        </div>

        {title && (
          <div className="hidden lg:block h-6 w-px bg-gray-200 dark:bg-gray-800" />
        )}
        {title && (
          <span className="hidden lg:inline-block text-xs font-semibold text-gray-600 dark:text-gray-300">
            {title}
          </span>
        )}

        {/* Super Admin Cross-Dashboard Notice Banner */}
        {isSuperAdmin && !location.pathname.startsWith("/super-admin") && (
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <ShieldCheck className="size-3.5 text-amber-600" />
            <span>Super Admin Full Access: Viewing {currentModule}</span>
            <button
              onClick={() => navigate("/super-admin/dashboard")}
              className="ml-1 text-[11px] underline hover:text-amber-950 dark:hover:text-amber-100 font-bold"
            >
              Return to HQ →
            </button>
          </div>
        )}
      </div>

      {/* Center Search (optional callback) */}
      {onSearch && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700 max-w-sm w-full mx-4 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 transition">
          <Search className="size-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search items, SKU, orders..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-200 outline-none"
          />
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Super Admin Master Dashboard Switcher */}
        {isSuperAdmin ? (
          <div className="relative">
            <button
              onClick={() => setShowSuperAdminMenu(!showSuperAdminMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition"
              title="Super Admin Master Access: Switch between Cashier, Branch, Store and Super Admin dashboards"
            >
              <ShieldCheck className="size-3.5" />
              <span>Full Access: {currentModule || "Dashboard"}</span>
              <ChevronDown className="size-3 text-amber-100" />
            </button>

            {showSuperAdminMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl p-2 z-50 text-xs">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800 mb-1">
                  Super Admin Master Switcher
                </div>

                <button
                  onClick={() => {
                    setShowSuperAdminMenu(false);
                    navigate("/super-admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between font-medium transition ${
                    location.pathname.startsWith("/super-admin")
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="size-4 text-amber-600" />
                    <div>
                      <span className="block">Super Admin HQ</span>
                      <span className="text-[10px] text-gray-400 font-normal">Governance & analytics</span>
                    </div>
                  </div>
                  {location.pathname.startsWith("/super-admin") && <CheckCircle2 className="size-4 text-amber-600" />}
                </button>

                <button
                  onClick={() => {
                    setShowSuperAdminMenu(false);
                    navigate("/store-admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between font-medium transition ${
                    location.pathname.startsWith("/store-admin")
                      ? "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="size-4 text-purple-600" />
                    <div>
                      <span className="block">Store Admin HQ</span>
                      <span className="text-[10px] text-gray-400 font-normal">Catalog & branches</span>
                    </div>
                  </div>
                  {location.pathname.startsWith("/store-admin") && <CheckCircle2 className="size-4 text-purple-600" />}
                </button>

                <button
                  onClick={() => {
                    setShowSuperAdminMenu(false);
                    navigate("/manager/dashboard");
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between font-medium transition ${
                    location.pathname.startsWith("/manager")
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GitBranch className="size-4 text-blue-600" />
                    <div>
                      <span className="block">Branch Manager</span>
                      <span className="text-[10px] text-gray-400 font-normal">Inventory & orders</span>
                    </div>
                  </div>
                  {location.pathname.startsWith("/manager") && <CheckCircle2 className="size-4 text-blue-600" />}
                </button>

                <button
                  onClick={() => {
                    setShowSuperAdminMenu(false);
                    navigate("/cashier/dashboard");
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between font-medium transition ${
                    location.pathname.startsWith("/cashier")
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingCart className="size-4 text-emerald-600" />
                    <div>
                      <span className="block">Cashier POS Terminal</span>
                      <span className="text-[10px] text-gray-400 font-normal">Checkout & shift reports</span>
                    </div>
                  </div>
                  {location.pathname.startsWith("/cashier") && <CheckCircle2 className="size-4 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Standard Verified Role Badge */
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            <ShieldAlert className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Role: {ROLE_LABELS[normalizeRole(user?.role)] || "Staff"}</span>
          </div>
        )}

        {/* Live Clock Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-xs font-mono text-gray-600 dark:text-gray-300">
          <Clock className="size-3.5 text-gray-400" />
          <span>{currentTime || "09:00:00"}</span>
        </div>

        {/* Dark / Light Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
            title="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-600 ring-2 ring-white dark:ring-gray-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                  Notifications
                </h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition cursor-pointer text-xs flex gap-2.5 items-start"
                  >
                    <div className="mt-0.5 shrink-0 text-emerald-600">
                      {n.type === "alert" ? (
                        <ShieldAlert className="size-4 text-rose-500" />
                      ) : (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {n.desc}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
          >
            <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block leading-tight">
              <span className="text-xs font-bold text-gray-900 dark:text-white block">
                {user?.fullName || "User"}
              </span>
              <span className="text-[10px] text-gray-400 block">
                {ROLE_LABELS[normalizeRole(user?.role)] || "Staff"}
              </span>
            </div>
            <ChevronDown className="size-3.5 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl p-1.5 z-50 text-xs">
              <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white">
                  {user?.fullName}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {ROLE_LABELS[normalizeRole(user?.role)]}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/store-admin/settings");
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                >
                  <User className="size-4" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
