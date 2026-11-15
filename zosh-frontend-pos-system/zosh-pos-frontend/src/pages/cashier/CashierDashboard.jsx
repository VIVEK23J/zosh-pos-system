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
  Sparkles,
} from "lucide-react";
import { shiftReportService } from "../../services/shiftReportService";
import { Button } from "@/components/ui/button";
import { StatCard } from "../../components/common/StatCard";
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

  return (
    <div className="cashier-overview">
      <div className="page-heading"><div><p className="eyebrow">CASHIER / OVERVIEW</p><h1>Daily overview</h1><p className="page-subtitle">Welcome back, {user?.fullName || "Cashier"}.</p></div><Button onClick={() => navigate("/cashier/pos")}><ShoppingCart />Open register<ArrowUpRight /></Button></div>
      <div className="summary-band">
        <StatCard title="Today's sales" value={`₹${totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} subtitle="Total revenue collected" icon={TrendingUp} />
        <StatCard title="Transactions" value={todayOrders.length} subtitle="Orders completed today" icon={Receipt} />
        <StatCard title="Shift status" value={activeShift ? "Active" : "Not started"} subtitle={activeShift ? "Register is open" : "No open shift"} icon={Clock} />
        <StatCard title="Location" value={currentStore?.brand || "Flagship Store"} subtitle={currentBranch?.name || "Main Branch"} icon={Store} />
      </div>
      <div className="operations-layout">
        <section className="transactions-section"><div className="section-title"><div><h2>Recent transactions</h2><p>Today's register activity</p></div><Button variant="ghost" size="sm" onClick={() => navigate("/cashier/orders")}>All orders<ArrowUpRight /></Button></div>
          <div className="transaction-table-wrap"><table className="workspace-table"><thead><tr><th>Order</th><th>Customer</th><th>Payment</th><th className="text-right">Amount</th><th>Status</th></tr></thead><tbody>{todayOrders.slice(0,5).map(order => <tr key={order.id}><td className="font-mono">#{order.id}</td><td>{order.customer?.fullName || "Walk-in Customer"}</td><td>{order.payment || "CASH"}</td><td className="text-right font-mono">₹{Number(order.totalAmount || 0).toLocaleString("en-IN",{minimumFractionDigits:2})}</td><td><span className="transaction-status"><CheckCircle2 className="size-3.5" />Completed</span></td></tr>)}</tbody></table></div>
          {todayOrders.length === 0 && <div className="transaction-empty"><Receipt className="size-9 text-muted-foreground" strokeWidth={1.2} /><h3>{isLoading ? "Loading transactions…" : "No transactions yet"}</h3><p>{isLoading ? "" : "Completed orders will appear here."}</p></div>}
        </section>
        <aside className="operations-rail"><div className="section-title"><h2>Register & operations</h2></div><div className="shift-summary"><div className="flex items-center gap-2 text-sm font-semibold"><Clock className="size-4 text-primary" />{activeShift ? "Current shift" : "Shift not started"}</div><p>{currentBranch?.name || "Main Branch"}</p><Button variant="outline" onClick={() => navigate("/cashier/shifts")}>{activeShift ? "Manage shift" : "Open shift"}<ArrowUpRight /></Button></div><div className="operation-links">{[{label:"POS terminal",path:"/cashier/pos",icon:ShoppingCart},{label:"Customer directory",path:"/cashier/customers",icon:Users},{label:"Refunds & returns",path:"/cashier/refunds",icon:RotateCcw}].map(item => {const Icon=item.icon;return <Button variant="ghost" key={item.path} onClick={() => navigate(item.path)}><Icon />{item.label}<ArrowUpRight className="ml-auto" /></Button>;})}</div></aside>
      </div>
    </div>
  );
}
export default CashierDashboard;
