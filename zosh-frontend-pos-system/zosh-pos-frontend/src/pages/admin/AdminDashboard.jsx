import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
            Platform Master Console
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5">
            Super Admin Governance Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Monitor merchant stores, manage platform subscriptions, approve registrations, and audit cloud activity.
          </p>
        </div>

        <Badge variant="warning" size="lg">
          {pendingStores.length} Pending Approval
        </Badge>
      </div>

      {/* Super Admin Direct Access Section: Cashier, Branch, Store */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="size-4 text-amber-500" />
              <span>Full Dashboard Access Control</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              As Super Admin, you have master access to inspect and operate the Store, Branch, and Cashier dashboards directly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate("/store-admin/dashboard")}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-900/40 hover:border-purple-500 dark:hover:border-purple-500 cursor-pointer transition shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center group-hover:scale-110 transition">
                <Store className="size-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Store HQ
              </span>
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition">
              Store Admin Dashboard
            </h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Access store branch configuration, product catalog, categories, staff directories, and store settings.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Open Store Dashboard</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div
            onClick={() => navigate("/manager/dashboard")}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/40 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center group-hover:scale-110 transition">
                <GitBranch className="size-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Branch Ops
              </span>
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
              Branch Manager Dashboard
            </h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Track branch live inventory, inspect store branch orders, monitor staff schedules, and view daily sales reports.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Open Branch Dashboard</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div
            onClick={() => navigate("/cashier/dashboard")}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition">
                <ShoppingCart className="size-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                POS Terminal
              </span>
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition">
              Cashier POS Dashboard
            </h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Launch POS register checkout, test transaction billing, review shift reports, and audit customer refunds.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Open Cashier Terminal</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
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
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="month" stroke="#888" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#888"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 100000}L`}
              />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString()}`, "Total GMV"]}
                contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#d97706"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#adminGmv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Store Requests Preview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
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
