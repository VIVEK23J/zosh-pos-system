import { useState, useEffect } from "react";
import { useNavigate } from "@/lib/rr-compat";
import {
  Building2,
  GitBranch,
  Users,
  DollarSign,
  ShieldAlert,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Store,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { storeService } from "../../services/storeService";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storeService.getAllStores().then((data) => {
      setStores(data);
      setLoading(false);
    });
  }, []);

  const chartData = [
    { month: "Jun", stores: 12, revenue: 1420000 },
    { month: "Jul", stores: 18, revenue: 2150000 },
    { month: "Aug", stores: 25, revenue: 3200000 },
    { month: "Sep", stores: 34, revenue: 4100000 },
    { month: "Oct", stores: 48, revenue: 5824900 },
  ];

  const pendingStores = stores.filter((s) => s.storeStatus === "PENDING");

  return (
    <div className="professional-dashboard">
      <div className="page-heading"><div><p className="eyebrow">PLATFORM / GOVERNANCE</p><h1>Platform overview</h1><p className="page-subtitle">Merchant activity & platform performance</p></div><Badge variant="warning">{pendingStores.length} pending approvals</Badge></div>

      <div className="portal-toolbar"><span>Workspaces</span>{[{label:"Store admin",path:"/store-admin/dashboard",icon:Store},{label:"Branch manager",path:"/manager/dashboard",icon:GitBranch},{label:"Cashier",path:"/cashier/dashboard",icon:ShoppingCart}].map(p => {const Icon=p.icon;return <Button key={p.path} variant="ghost" onClick={() => navigate(p.path)}><Icon />{p.label}<ArrowRight /></Button>;})}</div>

      {/* KPI Stats */}
      <div className="summary-band">
        <StatCard
          title="Total Stores"
          value={stores.length}
          subtitle="Enrolled merchants"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Active Branches"
          value="142"
          subtitle="Physical outlets"
          icon={GitBranch}
          color="emerald"
        />
        <StatCard
          title="Total Users"
          value="892"
          subtitle="Cashiers & managers"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Platform MRR"
          value="₹58.2L"
          subtitle="Recurring revenue"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Active Plans"
          value="45"
          subtitle="Paying merchants"
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Pending Requests"
          value={pendingStores.length}
          subtitle="Needs verification"
          icon={ShieldAlert}
          color="amber"
        />
      </div>

      {/* Chart Section */}
      <div className="dashboard-section space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Platform Gross Merchant Volume (GMV) Growth
            </h3>
            <p className="text-xs text-gray-400">Total volume processed across all merchant stores</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl">
            +38% MoM Growth
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="adminGmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 100000}L`}
              />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString()}`, "Total GMV"]}
                contentStyle={{ borderRadius: "6px", border: "none", fontSize: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#adminGmv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Store Requests Preview */}
      <div className="dashboard-section space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Registered Merchant Stores
          </h3>
          <Badge variant="default">Database Synced</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
              <tr>
                <th className="py-2.5">Store Brand</th>
                <th className="py-2.5">Contact Email</th>
                <th className="py-2.5">Phone</th>
                <th className="py-2.5">Tier Plan</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {stores.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="py-3 font-bold text-gray-900 dark:text-white">
                    {s.brand}
                  </td>
                  <td className="py-3 text-gray-500">{s.email}</td>
                  <td className="py-3 text-gray-500">{s.phone}</td>
                  <td className="py-3 font-semibold text-purple-700 dark:text-purple-300">
                    {s.subscriptionPlan || "Enterprise Pro"}
                  </td>
                  <td className="py-3">
                    <Badge variant={s.storeStatus === "ACTIVE" ? "success" : "warning"} size="sm">
                      {s.storeStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
