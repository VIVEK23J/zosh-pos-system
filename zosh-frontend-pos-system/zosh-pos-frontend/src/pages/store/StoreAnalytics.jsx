import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Filter,
  Download,
  CreditCard,
  PieChart as PieIcon,
  BarChart2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { analyticsService } from "../../services/analyticsService";

export function StoreAnalytics() {
  const [dateRange, setDateRange] = useState("30D");
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState([]);
  const [branchWiseRevenue, setBranchWiseRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    setDailyData(analyticsService.getDailyRevenue());
    setWeeklyData(analyticsService.getWeeklyRevenue());
    setMonthlyData(analyticsService.getMonthlyRevenue());
    setPaymentBreakdown(analyticsService.getPaymentBreakdown());
    setBranchWiseRevenue(analyticsService.getBranchWiseRevenue());
    setTopProducts(analyticsService.getTopProducts());
  }, [dateRange]);

  return (
    <div className="space-y-6">
      {/* Header and Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Comprehensive Store Analytics & Intelligence
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Audit storewide revenue, tender breakdown, branch velocity and category performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range filters */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
            {["7D", "30D", "90D", "1Y"].map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  dateRange === r
                    ? "bg-white dark:bg-gray-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition"
            title="Export Report"
          >
            <Download className="size-4" />
          </button>
        </div>
      </div>

      {/* Top 4 Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Store Revenue"
          value="₹5,82,490"
          subtitle="Net revenue for selected range"
          icon={DollarSign}
          trend="+14.6%"
          trendPositive={true}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value="428"
          subtitle="Total verified customer orders"
          icon={ShoppingCart}
          trend="+8.2%"
          trendPositive={true}
          color="blue"
        />
        <StatCard
          title="Average Order Value"
          value="₹1,360.95"
          subtitle="Spend per customer checkout"
          icon={TrendingUp}
          trend="+5.4%"
          trendPositive={true}
          color="purple"
        />
        <StatCard
          title="Unique Customers"
          value="124"
          subtitle="Active shoppers this month"
          icon={BarChart2}
          color="amber"
        />
      </div>

      {/* Section 1: Revenue Trajectory & Branch Comparison */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Revenue Trajectory Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Revenue Trend & Growth Trajectory
              </h3>
              <p className="text-xs text-gray-400">Total multi-branch gross sales timeline</p>
            </div>
            <Badge variant="success">Recharts Active</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorMainRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="month" stroke="#888" fontSize={11} tickLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMainRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Tender Breakdown Donut */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Revenue by Payment Method
          </h3>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {paymentBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</span>
                  <span className="text-gray-400 text-[10px] ml-1.5">({item.value}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Branch Comparison & Top Selling Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Branch-wise Revenue Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Branch-wise Volume Comparison
            </h3>
            <span className="text-xs text-gray-400">3 physical outlets</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchWiseRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="branch" stroke="#888" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#888"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString()}`, "Revenue"]}
                  contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top-Selling Products Velocity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Top-Selling Products
            </h3>
            <Badge variant="purple">Catalog Leaders</Badge>
          </div>

          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs"
              >
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{p.name}</h4>
                  <span className="text-[11px] text-gray-400">{p.category} • {p.sales} units sold</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 block text-sm">
                    ₹{p.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreAnalytics;
