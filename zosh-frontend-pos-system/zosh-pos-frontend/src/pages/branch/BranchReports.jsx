import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  Download,
  TrendingUp,
  CreditCard,
  Award,
  FileSpreadsheet,
} from "lucide-react";
import { analyticsService } from "../../services/analyticsService";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";

export function BranchReports() {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    setDailyData(analyticsService.getDailyRevenue());
    setMonthlyData(analyticsService.getMonthlyRevenue());
    setPaymentBreakdown(analyticsService.getPaymentBreakdown());
    setTopProducts(analyticsService.getTopProducts());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Branch Revenue & Performance Reports
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Audit daily hourly sales, monthly trajectory, cashier performance and payment distribution
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold hover:bg-gray-50 transition"
        >
          <Download className="size-4 text-emerald-600" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* Hourly Daily Sales Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Today's Hourly Sales Velocity
            </h3>
            <p className="text-xs text-gray-400">Peak transaction periods throughout business hours</p>
          </div>
          <Badge variant="success">Live Register Feed</Badge>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="time" stroke="#888" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#888"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString()}`, "Sales"]}
                contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Sales & Payment Mix */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            6-Month Sales Trajectory
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
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
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Tender Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Payment Mix
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

          <div className="space-y-1.5 text-xs">
            {paymentBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BranchReports;
