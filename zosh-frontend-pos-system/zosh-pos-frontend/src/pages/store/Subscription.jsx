import { useState } from "react";
import {
  Sparkles,
  Check,
  CreditCard,
  Download,
  ShieldCheck,
  Zap,
  Building2,
  Calendar,
} from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { useToast } from "../../components/common/Toast";

export function Subscription() {
  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("Enterprise Pro");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const plans = [
    {
      name: "Starter Merchant",
      price: "₹1,999",
      period: "/ month",
      desc: "For single-register retail shop",
      features: [
        "1 Branch Location",
        "Up to 2 Cashier Registers",
        "500 Products & SKUs",
        "Standard Cash & UPI Billing",
        "Email Support",
      ],
      current: currentPlan === "Starter Merchant",
    },
    {
      name: "Growth Multi-Branch",
      price: "₹4,999",
      period: "/ month",
      desc: "For growing multi-outlet businesses",
      features: [
        "Up to 5 Branch Locations",
        "Unlimited Cashier Registers",
        "5,000 Products & SKUs",
        "Razorpay & Stripe Integrated",
        "Inventory Alerts & Reports",
        "Priority Support",
      ],
      current: currentPlan === "Growth Multi-Branch",
      popular: true,
    },
    {
      name: "Enterprise Pro",
      price: "₹9,999",
      period: "/ month",
      desc: "Full cloud multi-store corporate suite",
      features: [
        "Unlimited Branches & Outlets",
        "Unlimited Registers & Users",
        "Unlimited SKUs & Barcodes",
        "Central Shift Audits & Reports",
        "Advanced Analytics & Exports",
        "24/7 Dedicated Account Manager",
      ],
      current: currentPlan === "Enterprise Pro",
    },
  ];

  const billingHistory = [
    {
      invoice: "INV-2026-1002",
      date: "01 Oct 2026",
      amount: "₹9,999",
      plan: "Enterprise Pro",
      status: "PAID",
      gateway: "Razorpay (Credit Card)",
    },
    {
      invoice: "INV-2026-0902",
      date: "01 Sep 2026",
      amount: "₹9,999",
      plan: "Enterprise Pro",
      status: "PAID",
      gateway: "Razorpay (Credit Card)",
    },
    {
      invoice: "INV-2026-0802",
      date: "01 Aug 2026",
      amount: "₹4,999",
      plan: "Growth Multi-Branch",
      status: "PAID",
      gateway: "Stripe",
    },
  ];

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = () => {
    if (!selectedPlan) return;
    setCurrentPlan(selectedPlan.name);
    setShowUpgradeModal(false);
    toast.success("Subscription Updated", `Successfully upgraded to ${selectedPlan.name} plan!`);
  };

  return (
    <div className="space-y-6">
      {/* Current Active Plan Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/60 px-2.5 py-0.5 rounded-full border border-emerald-700">
            Active Merchant Tier
          </span>
          <h2 className="text-2xl font-extrabold mt-1.5 flex items-center gap-2">
            <span>{currentPlan}</span>
            <Sparkles className="size-5 text-amber-400" />
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Renews on 01 November 2026 • Connected via Auto-billing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" size="lg">
            Subscription Active
          </Badge>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
          Available Subscription Plans
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Upgrade or change tier at any time with automatic pro-rated billing
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-white dark:bg-gray-900 border transition-all duration-200 flex flex-col justify-between ${
                p.current
                  ? "border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/20 shadow-md"
                  : p.popular
                  ? "border-blue-300 dark:border-blue-800 shadow-sm"
                  : "border-gray-100 dark:border-gray-800 shadow-sm"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{p.name}</h4>
                  {p.current && <Badge variant="success" size="sm">Current</Badge>}
                  {p.popular && !p.current && <Badge variant="info" size="sm">Popular</Badge>}
                </div>
                <p className="text-xs text-gray-400 mb-4">{p.desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{p.price}</span>
                  <span className="text-xs text-gray-400">{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                  {p.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleUpgrade(p)}
                  disabled={p.current}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition ${
                    p.current
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm"
                  }`}
                >
                  {p.current ? "Active Plan" : "Upgrade Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing & Invoice History Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Billing & Invoicing History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
              <tr>
                <th className="py-2.5">Invoice ID</th>
                <th className="py-2.5">Billing Date</th>
                <th className="py-2.5">Plan Tier</th>
                <th className="py-2.5">Gateway / Payment</th>
                <th className="py-2.5">Amount</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {billingHistory.map((inv, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="py-3 font-mono font-bold text-gray-900 dark:text-white">
                    {inv.invoice}
                  </td>
                  <td className="py-3 text-gray-500">{inv.date}</td>
                  <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                    {inv.plan}
                  </td>
                  <td className="py-3 text-gray-500">{inv.gateway}</td>
                  <td className="py-3 font-bold text-gray-900 dark:text-white">
                    {inv.amount}
                  </td>
                  <td className="py-3">
                    <Badge variant="success" size="sm">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => toast.info("Invoice Slip", `Downloading PDF for ${inv.invoice}`)}
                      className="p-1 text-gray-400 hover:text-emerald-700"
                    >
                      <Download className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Confirmation Modal */}
      {selectedPlan && (
        <Modal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title={`Upgrade to ${selectedPlan.name}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              You are about to switch your active subscription to <strong>{selectedPlan.name}</strong> ({selectedPlan.price}{selectedPlan.period}).
            </p>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>New Tier</span>
                <span>{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-400">
                <span>Total Due Now</span>
                <span>{selectedPlan.price}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-sm"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Subscription;
