import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import { storeService } from "../../services/storeService";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../components/common/Toast";

export function PendingRequests() {
  const toast = useToast();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      const data = await storeService.getAllStores();
      setStores(data);
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, brand) => {
    try {
      await storeService.moderateStore(id, "ACTIVE");
      setStores(
        stores.map((s) => (s.id === id ? { ...s, storeStatus: "ACTIVE" } : s))
      );
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, storeStatus: "ACTIVE" });
      }
      toast.success("Merchant Approved", `${brand} is now an active merchant.`);
    } catch {
      toast.error("Error", "Could not approve merchant");
    }
  };

  const handleReject = async (id, brand) => {
    try {
      await storeService.moderateStore(id, "REJECTED");
      setStores(
        stores.map((s) => (s.id === id ? { ...s, storeStatus: "REJECTED" } : s))
      );
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, storeStatus: "REJECTED" });
      }
      toast.warning("Merchant Rejected", `${brand} registration was rejected.`);
    } catch {
      toast.error("Error", "Could not update merchant status");
    }
  };

  const pendingList = stores.filter((s) => s.storeStatus === "PENDING");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Merchant Store Registration Requests
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Review onboarding submissions, verify tax documents and grant cloud access
          </p>
        </div>

        <Badge variant={pendingList.length > 0 ? "warning" : "success"} size="lg">
          {pendingList.length} Pending Actions
        </Badge>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={3} cols={6} />
        ) : stores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Store Brand</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Selected Plan</th>
                  <th className="px-5 py-3.5">Registered Date</th>
                  <th className="px-5 py-3.5">Current Status</th>
                  <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-xs">
                          {store.brand?.charAt(0) || "S"}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block text-sm">
                            {store.brand}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">ID: #{store.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-gray-600 dark:text-gray-300">{store.email}</div>
                      <div className="text-[11px] text-gray-400">{store.phone}</div>
                    </td>

                    <td className="px-5 py-4 font-semibold text-purple-700 dark:text-purple-300">
                      {store.subscriptionPlan || "Starter Plan"}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : "Just now"}
                    </td>

                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          store.storeStatus === "ACTIVE"
                            ? "success"
                            : store.storeStatus === "PENDING"
                            ? "warning"
                            : "danger"
                        }
                        size="sm"
                      >
                        {store.storeStatus}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(store)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </button>

                        {store.storeStatus === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(store.id, store.brand)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-semibold text-[11px] shadow-xs"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(store.id, store.brand)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold text-[11px] shadow-xs"
                            >
                              <XCircle className="size-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No registration requests"
            description="All store onboarding submissions have been reviewed."
          />
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={`Merchant Application: ${selectedRequest.brand}`}
          subtitle={`Registration Submission #${selectedRequest.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Business Brand</span>
                <strong className="text-gray-900 dark:text-white">{selectedRequest.brand}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span>{selectedRequest.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone</span>
                <span>{selectedRequest.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Address</span>
                <span>{selectedRequest.address || "Main Street"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Selected Plan</span>
                <span className="font-semibold text-purple-600">{selectedRequest.subscriptionPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <Badge variant={selectedRequest.storeStatus === "ACTIVE" ? "success" : "warning"} size="sm">
                  {selectedRequest.storeStatus}
                </Badge>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                Close
              </button>
              {selectedRequest.storeStatus === "PENDING" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedRequest.id, selectedRequest.brand)}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedRequest.id, selectedRequest.brand)}
                    className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
                  >
                    Approve Merchant
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PendingRequests;
