import { useState, useEffect } from "react";
import {
  RotateCcw,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { refundService } from "../../services/refundService";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../components/common/Toast";

export function Refunds() {
  const toast = useToast();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    orderId: "",
    amount: "",
    reason: "",
    customerName: "",
  });

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    setLoading(true);
    try {
      const data = await refundService.getAllRefunds();
      setRefunds(data);
    } catch {
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRefund = async (e) => {
    e.preventDefault();
    if (!formData.orderId || !formData.amount) return;

    try {
      const newRefund = await refundService.createRefund({
        orderId: Number(formData.orderId),
        amount: Number(formData.amount),
        reason: formData.reason || "Customer return request",
        customerName: formData.customerName || "Customer",
        cashierName: "Vivek Sharma",
        branchId: 1,
      });

      setRefunds([newRefund, ...refunds]);
      setShowCreateModal(false);
      setFormData({ orderId: "", amount: "", reason: "", customerName: "" });
      toast.success("Refund Processed", `Refund of ₹${newRefund.amount} registered successfully.`);
    } catch (err) {
      toast.error("Error", "Could not process refund");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await refundService.deleteRefund(deleteTarget.id);
      setRefunds(refunds.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Refund Removed", "Record deleted from registry.");
    } catch (err) {
      toast.error("Error", "Could not delete refund record");
    }
  };

  const filteredRefunds = refunds.filter((r) => {
    const q = search.toLowerCase();
    return (
      String(r.id).includes(q) ||
      String(r.orderId).includes(q) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.reason && r.reason.toLowerCase().includes(q))
    );
  });

  const totalRefundAmount = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Customer Refund Registry
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Process item returns, reconcile order credits and audit cash refunds
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
        >
          <Plus className="size-4" />
          <span>Process New Refund</span>
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
            Total Processed Refunds
          </span>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{refunds.length}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Approved return transactions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
            Total Returned Amount
          </span>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            ₹{totalRefundAmount.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Deducted from register drawer</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
            Settlement Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle2 className="size-5 text-emerald-600" />
            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">100% Reconciled</h4>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Synced with shift accounting</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-sm">
          <Search className="size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search refund ID, order #, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs outline-none text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Refunds Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : filteredRefunds.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Refund ID</th>
                  <th className="px-5 py-3.5">Order Ref</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                      #{refund.id}
                    </td>

                    <td className="px-5 py-4 font-semibold text-emerald-800 dark:text-emerald-400">
                      Order #{refund.orderId}
                    </td>

                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                      {refund.customerName || "Customer"}
                    </td>

                    <td className="px-5 py-4 max-w-xs text-gray-600 dark:text-gray-400 truncate">
                      {refund.reason}
                    </td>

                    <td className="px-5 py-4 font-bold text-rose-600 dark:text-rose-400 text-sm">
                      ₹{refund.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant="success">
                        {refund.status || "APPROVED"}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(refund)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        title="Delete refund"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={RotateCcw}
            title="No refunds found"
            description="No customer refund records match your search."
          />
        )}
      </div>

      {/* Process Refund Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Process Order Refund">
        <form onSubmit={handleCreateRefund} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Original Order ID *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 1001"
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Customer Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Refund Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              placeholder="Enter amount to return"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Reason for Refund *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Defective product, customer exchange, wrong item..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-sm"
            >
              Issue Refund
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Refund Record?"
        message={`Are you sure you want to delete refund #${deleteTarget?.id} for ₹${deleteTarget?.amount}?`}
      />
    </div>
  );
}

export default Refunds;
