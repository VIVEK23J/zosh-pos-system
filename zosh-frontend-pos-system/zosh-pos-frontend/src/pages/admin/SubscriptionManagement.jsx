import { useState } from "react";
import { CreditCard, CheckCircle2, AlertCircle, Sparkles, DollarSign, Download } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { StatCard } from "../../components/common/StatCard";

export function SubscriptionManagement() {
  const [filter, setFilter] = useState("ALL");

  const subscriptions = [
    {
      id: 1,
      store: "Zosh Retail Store",
      plan: "Enterprise Pro",
      amount: "₹9,999 / mo",
      status: "ACTIVE",
      billingCycle: "Monthly Auto-renew",
      nextBilling: "01 Nov 2026",
    },
    {
      id: 2,
      store: "Urban Mart Superstore",
      plan: "Growth Multi-Branch",
      amount: "₹4,999 / mo",
      status: "ACTIVE",
      billingCycle: "Monthly Auto-renew",
      nextBilling: "20 Nov 2026",
    },
    {
      id: 3,
      store: "Apex Electronics Hub",
      plan: "Starter Merchant",
      amount: "₹1,999 / mo",
      status: "TRIAL",
      billingCycle: "14-Day Free Trial",
      nextBilling: "15 Nov 2026",
    },
    {
      id: 4,
      store: "Metro Super Bazar",
      plan: "Growth Multi-Branch",
      amount: "₹4,999 / mo",
      status: "EXPIRED",
      billingCycle: "Lapsed Subscription",
      nextBilling: "Past Due (10 Oct)",
    },
  ];

  const filteredSubs = subscriptions.filter((s) => {
    if (filter === "ACTIVE") return s.status === "ACTIVE";
    if (filter === "EXPIRED") return s.status === "EXPIRED";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Platform Subscriptions & Billing Control
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage merchant SaaS tiers, monitor recurring ARR/MRR, and inspect billing collections
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
          {["ALL", "ACTIVE", "EXPIRED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === tab
                  ? "bg-white dark:bg-gray-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Platform MRR"
          value="₹58,24,900"
          subtitle="Monthly recurring revenue"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Active Subscriptions"
          value="45 Merchants"
          subtitle="Enterprise & Growth tiers"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Expired / At Risk"
          value="3 Stores"
          subtitle="Requires renewal follow-up"
          icon={AlertCircle}
          color="rose"
        />
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Merchant Store</th>
                <th className="px-5 py-3.5">Subscription Plan</th>
                <th className="px-5 py-3.5">Pricing</th>
                <th className="px-5 py-3.5">Billing Terms</th>
                <th className="px-5 py-3.5">Next Renewal</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredSubs.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    {s.store}
                  </td>
                  <td className="px-5 py-4 font-semibold text-purple-700 dark:text-purple-300">
                    {s.plan}
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-700 dark:text-emerald-400">
                    {s.amount}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{s.billingCycle}</td>
                  <td className="px-5 py-4 text-gray-500">{s.nextBilling}</td>
                  <td className="px-5 py-4 text-right">
                    <Badge
                      variant={s.status === "ACTIVE" ? "success" : s.status === "TRIAL" ? "info" : "danger"}
                      size="sm"
                    >
                      {s.status}
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

export default SubscriptionManagement;
