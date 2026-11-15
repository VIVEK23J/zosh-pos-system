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
    <div className="professional-dashboard">
      <div className="page-heading"><div><p className="eyebrow">STORE / PERFORMANCE</p><h1>Store overview</h1><p className="page-subtitle">Zosh Retail Store</p></div><Badge variant="default">Enterprise Pro</Badge></div>

      {/* KPI Stats */}
      <div className="summary-band">
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
      <div className="dashboard-section space-y-4">
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
              <XAxis dataKey="branch" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString()}`, "Gross Revenue"]}
                contentStyle={{ borderRadius: "6px", border: "none", fontSize: "12px" }}
              />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Outlets Grid */}
      <div className="dashboard-section space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Retail Outlets & Operating Branches
        </h3>

        <div className="overflow-x-auto"><table className="workspace-table"><thead><tr><th>Branch</th><th>Address</th><th>Manager</th><th>Phone</th><th>Status</th></tr></thead><tbody>{branches.map(b => <tr key={b.id}><td className="font-semibold">{b.name}</td><td>{b.address}</td><td>{b.managerName}</td><td>{b.phone}</td><td><Badge variant="success" size="sm">Active</Badge></td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
}

export default StoreDashboard;
