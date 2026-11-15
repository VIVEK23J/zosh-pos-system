import { useState, useEffect } from "react";
import {
  Clock,
  Banknote,
  DollarSign,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  FileSpreadsheet,
} from "lucide-react";
import { shiftReportService } from "../../services/shiftReportService";
import { StatCard } from "../../components/common/StatCard";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import { useToast } from "../../components/common/Toast";

export function ShiftReports() {
  const toast = useToast();
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [openingCashInput, setOpeningCashInput] = useState("5000");
  const [closingCashInput, setClosingCashInput] = useState("");

  useEffect(() => {
    loadCurrentShift();
  }, []);

  const loadCurrentShift = async () => {
    setLoading(true);
    try {
      const data = await shiftReportService.getCurrentShift();
      setShift(data);
    } catch (err) {
      toast.error("Failed to load shift report");
    } finally {
      setLoading(false);
    }
  };

  const handleStartShift = async (e) => {
    e.preventDefault();
    try {
      const res = await shiftReportService.startShift(Number(openingCashInput) || 5000);
      setShift(res);
      setShowStartModal(false);
      toast.success("Shift Started", `Register opened with ₹${openingCashInput} initial cash drawer.`);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || err.message || "Could not start shift");
    }
  };

  const handleEndShift = async (e) => {
    e.preventDefault();
    try {
      const res = await shiftReportService.endShift(
        Number(closingCashInput) || (shift?.totalSales || 0),
        shift?.id
      );
      setShift(res);
      setShowEndModal(false);
      toast.success("Shift Closed", "Final sales and cash drawer reconciled successfully.");
    } catch (err) {
      toast.error("Error", err.response?.data?.message || err.message || "Could not close shift");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500 animate-pulse">
        Loading cashier shift progress...
      </div>
    );
  }

  const isShiftOpen = shift?.status === "OPEN";

  return (
    <div className="space-y-6">
      {/* Header and Action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Cashier Shift Terminal
            </h1>
            <Badge variant={isShiftOpen ? "success" : "warning"}>
              {isShiftOpen ? "Shift Active • Open" : "Shift Closed"}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cashier: <strong>{shift?.cashierName || "Vivek Sharma"}</strong> • Started at{" "}
            {shift?.shiftStartTime ? new Date(shift.shiftStartTime).toLocaleTimeString() : "Shift open"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isShiftOpen ? (
            <button
              onClick={() => {
                setClosingCashInput(String(shift?.totalSales || ""));
                setShowEndModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition"
            >
              <Square className="size-4" />
              <span>Close & End Shift</span>
            </button>
          ) : (
            <button
              onClick={() => setShowStartModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
            >
              <Play className="size-4" />
              <span>Start New Shift</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FileSpreadsheet className="size-4 text-emerald-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Opening Cash Float"
          value={`₹${(shift?.openingCash || 0).toLocaleString("en-IN")}`}
          subtitle="Cash drawer initial float"
          icon={Banknote}
          color="emerald"
        />
        <StatCard
          title="Total Shift Sales"
          value={`₹${(shift?.totalSales || 0).toLocaleString("en-IN")}`}
          subtitle="Net sales processed this shift"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Cash / Online Split"
          value={`₹${(shift?.cashSales || 0).toLocaleString("en-IN")} / ₹${(shift?.onlineSales || 0).toLocaleString("en-IN")}`}
          subtitle="Cash vs UPI/Card payments"
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Shift Refunds"
          value={`₹${(shift?.refunds || 0).toLocaleString("en-IN")}`}
          subtitle="Returned order deductions"
          icon={RotateCcw}
          color="rose"
        />
      </div>

      {/* Detailed Shift Breakdown Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Shift Balance & Reconciliation Summary
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500">Shift Started</span>
              <span className="font-semibold">
                {shift?.shiftStartTime ? new Date(shift.shiftStartTime).toLocaleString() : "Active Shift"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500">Shift Ended</span>
              <span className="font-semibold">
                {shift?.shiftEndTime ? new Date(shift.shiftEndTime).toLocaleString() : "In Progress"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500">Opening Cash</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                ₹{(shift?.openingCash || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500">Cash Collections</span>
              <span className="font-semibold">₹{(shift?.cashSales || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500">Online Collections (UPI / Card)</span>
              <span className="font-semibold">₹{(shift?.onlineSales || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500">Refund Deductions</span>
              <span className="font-semibold text-rose-600">-₹{(shift?.refunds || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <span>Expected Cash in Drawer</span>
              <span>₹{((shift?.openingCash || 0) + (shift?.cashSales || 0) - (shift?.refunds || 0)).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Cashier Verification Notice
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Before closing shift, count physical currency in register. Discrepancies between expected cash and closing cash will be flagged in manager audit reports.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
              <span>Shift is synchronized with Spring Boot `ShiftReportController` endpoint.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start Shift Modal */}
      <Modal isOpen={showStartModal} onClose={() => setShowStartModal(false)} title="Start Register Shift">
        <form onSubmit={handleStartShift} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Opening Cash Drawer Float (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={openingCashInput}
              onChange={(e) => setOpeningCashInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">Starting change provided for transactions.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowStartModal(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm"
            >
              Confirm Opening
            </button>
          </div>
        </form>
      </Modal>

      {/* End Shift Modal */}
      <Modal isOpen={showEndModal} onClose={() => setShowEndModal(false)} title="Close Register & End Shift">
        <form onSubmit={handleEndShift} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Final Cash Drawer Count (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={closingCashInput}
              onChange={(e) => setClosingCashInput(e.target.value)}
              placeholder="Count total physical cash"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">Enter physical cash counted in drawer to complete reconciliation.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowEndModal(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
            >
              Confirm End Shift
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ShiftReports;
