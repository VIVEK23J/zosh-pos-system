import { useState, useEffect } from "react";
import {
  DollarSign,
  GitBranch,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Building2,
  Sparkles,
} from "lucide-react";
import {
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
import { analyticsService } from "../../services/analyticsService";
import { branchService } from "../../services/branchService";

export function StoreDashboard() {
  const [metrics, setMetrics] = useState({});
  const [branchData, setBranchData] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    setMetrics(analyticsService.getOverviewMetrics());
    setBranchData(analyticsService.getBranchWiseRevenue());
    branchService.getBranchesByStore(1).then((data) => setBranches(data));
  }, []);

  return (
    <div className="space-y-6">
      {/* Store Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-900">
            Enterprise Merchant Headquarters
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5">
            Zosh Retail Store Master Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Omnichannel multi-branch performance, central catalog management and executive sales metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="lg">
            Plan: Enterprise Pro
          </Badge>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Store Revenue"
          value={`₹${(metrics.totalRevenue || 582490).toLocaleString("en-IN")}`}
          subtitle="All branch aggregations"
          icon={DollarSign}
          trend="+14.6%"
          trendPositive={true}
          color="emerald"
        />
        <StatCard
          title="Active Branches"
          value={branches.length}
          subtitle="Operating retail outlets"
          icon={GitBranch}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders || 428}
          subtitle="Customer receipts issued"
          icon={ShoppingCart}
          trend="+8.2%"
          trendPositive={true}
          color="purple"
        />
        <StatCard
          title="Master Catalog"
          value="8 SKUs"
          subtitle="Active stock keeping units"
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Total Employees"
          value="18"
          subtitle="Cashiers & managers"
          icon={Users}
          color="rose"
        />
      </div>

      {/* Branch Comparison Bar Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Branch-Wise Revenue Comparison
            </h3>
            <p className="text-xs text-gray-400">Total volume contribution across physical outlets</p>
          </div>
          <Badge variant="default">Audit Period: This Month</Badge>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="branch" stroke="#888" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#888"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString()}`, "Gross Revenue"]}
                contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }}
              />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Outlets Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Retail Outlets & Operating Branches
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {branches.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2 text-xs"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{b.name}</h4>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <p className="text-gray-500 leading-relaxed">{b.address}</p>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-[11px] text-gray-400">
                <span>Manager: {b.managerName}</span>
                <span>{b.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoreDashboard;
