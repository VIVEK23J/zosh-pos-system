import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Users,
  Clock,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Store,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { shiftReportService } from "../../services/shiftReportService";
import { orderService } from "../../services/orderService";

export function CashierDashboard() {
  const navigate = useNavigate();
  const { user, currentBranch, currentStore } = useSelector((state) => state.auth);

  const [activeShift, setActiveShift] = useState(null);
  const [todayOrders, setTodayOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [shiftRes, ordersRes] = await Promise.allSettled([
          shiftReportService.getCurrentShift(),
          orderService.getTodayOrders(currentBranch?.id || 1),
        ]);

        if (mounted) {
          if (shiftRes.status === "fulfilled" && shiftRes.value) {
            setActiveShift(shiftRes.value);
          }
          if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
            setTodayOrders(ordersRes.value);
          }
        }
      } catch (e) {
        console.error("Failed to load cashier dashboard stats", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [currentBranch]);

  const totalSales = todayOrders.reduce(
    (acc, o) => acc + (Number(o.totalAmount) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-800 to-teal-900 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
              <Sparkles className="size-3.5" />
              <span>Cashier Terminal Active</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || "Cashier"}!
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
              Assigned to {currentStore?.brand || "Store"} • {currentBranch?.name || "Main Branch"}. Ready to process customer orders and terminal transactions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/cashier/pos")}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs shadow-lg transition flex items-center gap-2"
            >
              <ShoppingCart className="size-4 text-emerald-700" />
              <span>Open POS Register</span>
            </button>
          </div>
        </div>

        {/* Background decorative circles */}
        <div className="absolute -right-12 -bottom-12 size-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-36 -top-12 size-36 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Today's Orders
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Receipt className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {todayOrders.length}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Processed transactions today</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Register Sales
            </span>
            <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
            ₹{totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Total revenue collected</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Shift Status
            </span>
            <div className="size-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${activeShift ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {activeShift ? "Shift Active" : "No Open Shift"}
            </p>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {activeShift ? "Register is currently open" : "Start your shift in reports"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Active Store
            </span>
            <div className="size-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Store className="size-4" />
            </div>
          </div>
          <p className="text-base font-extrabold text-gray-900 dark:text-white truncate">
            {currentStore?.brand || "Flagship Store"}
          </p>
          <p className="text-[11px] text-gray-400 mt-1 truncate">
            {currentBranch?.name || "Main Branch"}
          </p>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
          Cashier Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/cashier/pos")}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition group text-left shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <ShoppingCart className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                POS Terminal
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Scan barcodes, build carts, and take customer payments.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <span>Open Terminal</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </button>

          <button
            onClick={() => navigate("/cashier/shifts")}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-500 transition group text-left shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Clock className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Shift Reports
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Open register, record opening cash, and end active shift.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
              <span>Manage Shift</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </button>

          <button
            onClick={() => navigate("/cashier/customers")}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition group text-left shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Users className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Customer Directory
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Look up customer profiles, contact info, and loyalty details.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400">
              <span>View Customers</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </button>

          <button
            onClick={() => navigate("/cashier/refunds")}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-rose-500 dark:hover:border-rose-500 transition group text-left shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <RotateCcw className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Refunds & Returns
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Process item returns and issue payment refunds to clients.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400">
              <span>Issue Refund</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Live orders completed during current operating hours
            </p>
          </div>
          <button
            onClick={() => navigate("/cashier/orders")}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            View All Orders →
          </button>
        </div>

        {todayOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No orders completed yet today. Open the POS register to start ringing up customers.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {todayOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                      #{order.id}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {order.customer?.fullName || "Walk-in Customer"}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                      {order.payment || "CASH"}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CashierDashboard;
