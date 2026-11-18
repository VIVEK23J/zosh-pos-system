import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "@/lib/rr-compat";
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
  Eye,
  CreditCard,
  Banknote,
  Smartphone,
  Zap,
} from "lucide-react";
import { shiftReportService } from "../../services/shiftReportService";
import { orderService } from "../../services/orderService";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";

export function CashierDashboard() {
  const navigate = useNavigate();
  const { user, currentBranch, currentStore } = useSelector(
    (state) => state.auth
  );

  const [activeShift, setActiveShift] = useState(null);
  const [todayOrders, setTodayOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [shiftRes, ordersRes] = await Promise.allSettled([
          shiftReportService.getCurrentShift(),
          orderService.getTodayOrders?.(currentBranch?.id || 1),
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

  const isShiftOpen = activeShift?.status === "OPEN";

  const getPaymentBadge = (type) => {
    const p = String(type || "").toUpperCase();
    if (p === "CARD") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <CreditCard className="size-3 text-sky-600" />
          <span>CARD</span>
        </span>
      );
    }
    if (p === "RAZORPAY") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Zap className="size-3 text-blue-600" />
          <span>RAZORPAY</span>
        </span>
      );
    }
    if (p === "UPT" || p === "UPI" || p === "RAZORPAY_QR") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Smartphone className="size-3 text-emerald-600" />
          <span>UPI</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        <Banknote className="size-3" />
        <span>CASH</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Action controls - Exact Shift Reports Design System */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Cashier Operations Dashboard
            </h1>
            <Badge variant={isShiftOpen ? "success" : "warning"}>
              {isShiftOpen ? "Shift Active • Open" : "Shift Not Started"}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cashier: <strong>{user?.fullName || "Vivek Sharma"}</strong> • Store:{" "}
            {currentStore?.brand || "Flagship Store"} ({currentBranch?.name || "Main Branch"}) •{" "}
            {activeShift?.shiftStartTime
              ? `Shift opened at ${new Date(activeShift.shiftStartTime).toLocaleTimeString()}`
              : "Register standby"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/cashier/customers")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
            title="Open Customer Directory"
          >
            <Users className="size-4" />
            <span>Customer Directory</span>
          </button>

          <button
            onClick={() => navigate("/cashier/pos")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <ShoppingCart className="size-4" />
            <span>Open POS Terminal</span>
          </button>

          <button
            onClick={() => navigate("/cashier/shifts")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <Clock className="size-4" />
            <span>Shift Reports</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Register Sales"
          value={`₹${totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          subtitle="Gross sales rung up today"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Completed Transactions"
          value={todayOrders.length}
          subtitle="Orders finalized today"
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title="Customers Served"
          value={todayOrders.length > 0 ? todayOrders.length : 0}
          subtitle="Walk-in & profile receipts"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Register Drawer Status"
          value={isShiftOpen ? "Active / Open" : "Closed / Idle"}
          subtitle={
            isShiftOpen
              ? `Float: ₹${(activeShift?.openingCash || 5000).toLocaleString("en-IN")}`
              : "Open shift to start drawer"
          }
          icon={Store}
          color={isShiftOpen ? "teal" : "amber"}
        />
      </div>

      {/* Main Operations Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Transactions Table & Shift Drawer Summary */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Transactions Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Today's Register Transactions
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recent orders processed on this cashier register
                </p>
              </div>

              <button
                onClick={() => navigate("/cashier/orders")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <span>All Orders</span>
                <ArrowUpRight className="size-3.5 text-emerald-600" />
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-gray-400 animate-pulse">
                Loading today's transactions...
              </div>
            ) : todayOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {todayOrders.slice(0, 6).map((order) => {
                      const displayId = order.id || order.orderId;
                      return (
                        <tr
                          key={displayId}
                          className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition cursor-pointer"
                          onClick={() => navigate("/cashier/orders")}
                        >
                          <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white">
                            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                              #ORD-{displayId}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-700 dark:text-gray-300 font-medium">
                            <div className="flex items-center gap-1.5">
                              <span className="size-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {(order.customer?.fullName || order.customerName || "W").charAt(0).toUpperCase()}
                              </span>
                              <span>{order.customer?.fullName || order.customerName || "Walk-in Customer"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {getPaymentBadge(order.payment)}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-800 dark:text-emerald-400 text-sm">
                            ₹{Number(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="size-3 text-emerald-600" />
                              Completed
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/cashier/orders");
                              }}
                              className="p-1 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                              title="View details"
                            >
                              <Eye className="size-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                <Receipt className="size-8 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="font-semibold text-gray-600 dark:text-gray-300">No transactions recorded yet today</p>
                <p>Launch the POS register to ring up customer sales.</p>
              </div>
            )}
          </div>

          {/* Shift Reconciliation Summary Card (Matching ShiftReports) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Shift Drawer Reconciliation Overview
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Register Status</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {isShiftOpen ? "Active Open Register" : "Shift Not Started"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Opening Cash Float</span>
                  <span className="font-semibold font-mono">
                    ₹{(activeShift?.openingCash || 5000).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Total Register Sales</span>
                  <span className="font-semibold font-mono text-emerald-700 dark:text-emerald-400">
                    ₹{totalSales.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  <span>Expected Drawer Balance</span>
                  <span className="font-mono">
                    ₹{((activeShift?.openingCash || 5000) + totalSales).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-between p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-xs">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Terminal Verification Notice
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                    Ensure all physical currency in the cash drawer matches registered sales before concluding your shift.
                  </p>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  <span>Synchronized with ShiftReportController.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fast Action Hub & Navigation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Terminal Navigation Hub */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Terminal Fast Actions
            </h3>

            <div className="space-y-3">
              {/* POS Terminal Action */}
              <button
                onClick={() => navigate("/cashier/pos")}
                className="w-full p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <ShoppingCart className="size-5" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-gray-900 dark:text-white block">
                      POS Register Terminal
                    </strong>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Product catalog, cart & checkout
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              {/* Customer Directory Shortcut */}
              <button
                onClick={() => navigate("/cashier/customers")}
                className="w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100/70 dark:hover:bg-gray-800 transition flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800">
                    <Users className="size-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-gray-900 dark:text-white block">
                      Customer Directory
                    </strong>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Profiles, history & loyalty records
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              {/* Shift Reports Action */}
              <button
                onClick={() => navigate("/cashier/shifts")}
                className="w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100/70 dark:hover:bg-gray-800 transition flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0">
                    <Clock className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-gray-900 dark:text-white block">
                      Shift Management
                    </strong>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Opening float & end-of-shift reconciliation
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              {/* Refunds & Returns Action */}
              <button
                onClick={() => navigate("/cashier/refunds")}
                className="w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100/70 dark:hover:bg-gray-800 transition flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800">
                    <RotateCcw className="size-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-gray-900 dark:text-white block">
                      Refunds & Returns
                    </strong>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Process order cancellations & cash credits
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Store Location Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-xs space-y-3">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-emerald-700 dark:text-emerald-400" />
              <strong className="text-xs font-bold text-gray-900 dark:text-white">
                Store Terminal Station
              </strong>
            </div>
            <div className="space-y-1 text-gray-500 dark:text-gray-400">
              <p>Store: <strong>{currentStore?.brand || "Flagship Store"}</strong></p>
              <p>Branch: <strong>{currentBranch?.name || "Main Branch"}</strong></p>
              <p>Terminal Protocol: <strong>Online POS v2.0</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashierDashboard;
