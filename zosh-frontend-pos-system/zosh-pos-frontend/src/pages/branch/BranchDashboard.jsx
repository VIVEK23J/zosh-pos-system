import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileCheck2,
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
import { analyticsService } from "../../services/analyticsService";
import { orderService } from "../../services/orderService";
import { inventoryService } from "../../services/inventoryService";

export function BranchDashboard() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    setWeeklyData(analyticsService.getWeeklyRevenue());
    setTopProducts(analyticsService.getTopProducts());

    orderService.getRecentOrders(1).then((orders) => setRecentOrders(orders));
    inventoryService.getInventoryByBranch(1).then((items) => {
      setLowStockItems(items.filter((i) => i.isLowStock));
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Branch Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
            Sector 29 Gurugram Branch
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5">
            Branch Performance & Store Operations
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time branch sales analytics, floor inventory monitoring, and register status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-gray-400 block">Today's Branch Revenue</span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">₹73,895</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Weekly Revenue"
          value="₹5,82,490"
          subtitle="+14.2% from previous week"
          icon={DollarSign}
          trend="+14.2%"
          trendPositive={true}
          color="emerald"
        />
        <StatCard
          title="Branch Orders"
          value="428"
          subtitle="Orders processed this week"
          icon={ShoppingCart}
          trend="+8.5%"
          trendPositive={true}
          color="blue"
        />
        <StatCard
          title="Active Employees"
          value="8"
          subtitle="3 cashiers on duty right now"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Stock Warning"
          value={`${lowStockItems.length} Items`}
          subtitle="Requires immediate replenishment"
          icon={AlertTriangle}
          trend="Action Needed"
          trendPositive={false}
          color="amber"
        />
      </div>

      {/* Charts Section: Weekly Revenue & Top Products */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Revenue Trend (Past 7 Days)
              </h3>
              <p className="text-xs text-gray-400">Daily gross retail sales trajectory</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
              Avg ₹83.2k / day
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="day" stroke="#888" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#888"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Top Velocity Products
            </h3>
            <p className="text-xs text-gray-400">Fastest moving SKUs this month</p>
          </div>

          <div className="space-y-3">
            {topProducts.slice(0, 4).map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition text-xs"
              >
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white leading-tight">
                    {p.name}
                  </h5>
                  <span className="text-[11px] text-gray-400">{p.category} • {p.sales} units</span>
                </div>
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                  ₹{(p.revenue / 1000).toFixed(0)}k
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Branch Orders & Low Stock Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Branch Orders Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Checkout Orders
            </h3>
            <Badge variant="default">Real-time Stream</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                <tr>
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Tender</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.slice(0, 4).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="py-3 font-bold text-gray-900 dark:text-white">#{o.id}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">{o.customerName || "Customer"}</td>
                    <td className="py-3 font-semibold text-emerald-700 dark:text-emerald-400">{o.payment}</td>
                    <td className="py-3 font-bold text-gray-900 dark:text-white">₹{o.totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <Badge variant="success">Completed</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Low Stock Warnings
            </h3>
          </div>

          <div className="space-y-2.5">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-amber-900 dark:text-amber-200">
                      {item.product?.name}
                    </h5>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400">
                      SKU: {item.product?.sku}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-rose-600 text-sm block">
                      {item.quantity} left
                    </span>
                    <span className="text-[10px] text-gray-400">Min: {item.lowStockThreshold}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">
                All inventory quantities are above safety threshold.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BranchDashboard;
