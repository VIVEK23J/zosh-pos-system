import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  GitBranch,
  Plus,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Mail,
} from "lucide-react";
import { branchService } from "../../services/branchService";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../components/common/Toast";

export function Branches() {
  const toast = useToast();
  const currentStore = useSelector((state) => state.auth.currentStore);
  const storeId = currentStore?.id || 1;

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "branch@zoshpos.com",
    operatingHours: "09:00 AM - 10:00 PM",
    managerName: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    loadBranches();
  }, [storeId]);

  const loadBranches = async () => {
    setLoading(true);
    try {
      const data = await branchService.getBranchesByStore(storeId);
      setBranches(data);
    } catch {
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "branch@zoshpos.com",
      operatingHours: "09:00 AM - 10:00 PM",
      managerName: "",
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name || "",
      address: branch.address || "",
      phone: branch.phone || "",
      email: branch.email || "branch@zoshpos.com",
      operatingHours: branch.operatingHours || "09:00 AM - 10:00 PM",
      managerName: branch.managerName || "",
      status: branch.status || "ACTIVE",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        const updated = await branchService.updateBranch(editingBranch.id, formData);
        setBranches(branches.map((b) => (b.id === editingBranch.id ? { ...b, ...formData } : b)));
        toast.success("Branch Updated", `${formData.name} updated.`);
      } else {
        const created = await branchService.createBranch({ ...formData, storeId });
        setBranches([...branches, created]);
        toast.success("Branch Created", `${formData.name} created successfully.`);
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "Could not save branch configuration");
    }
  };

  const handleToggleStatus = (branch) => {
    const nextStatus = branch.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setBranches(branches.map((b) => (b.id === branch.id ? { ...b, status: nextStatus } : b)));
    toast.info("Status Changed", `${branch.name} is now ${nextStatus}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await branchService.deleteBranch(deleteTarget.id);
      setBranches(branches.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Branch Removed", "Outlet removed from merchant network.");
    } catch {
      toast.error("Error", "Could not delete branch");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Branch Network Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Add physical store outlets, assign branch managers, and manage operating statuses
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
        >
          <Plus className="size-4" />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Branches Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={3} cols={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Branch Name</th>
                  <th className="px-5 py-3.5">Physical Address</th>
                  <th className="px-5 py-3.5">Manager & Phone</th>
                  <th className="px-5 py-3.5">Hours</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {branches.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-900 dark:text-white block text-sm">
                        {b.name}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">ID: #{b.id}</span>
                    </td>

                    <td className="px-5 py-4 max-w-xs text-gray-600 dark:text-gray-300">
                      {b.address}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {b.managerName || "Unassigned"}
                      </div>
                      <div className="text-[11px] text-gray-400">{b.phone}</div>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {b.operatingHours}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(b)}
                        className="inline-flex items-center gap-1.5 focus:outline-none"
                        title="Click to toggle status"
                      >
                        <Badge variant={b.status === "ACTIVE" ? "success" : "warning"} size="sm">
                          {b.status || "ACTIVE"}
                        </Badge>
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                          title="Edit Branch"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                          title="Delete Branch"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Branch Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBranch ? "Edit Branch Outlet" : "Create New Branch"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Branch Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. South Ex Flagship Outlet"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Physical Location & Address *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Full street address and city"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Branch Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Branch Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Branch Manager
              </label>
              <input
                type="text"
                placeholder="Manager name"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Operating Hours
            </label>
            <input
              type="text"
              value={formData.operatingHours}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-sm"
            >
              Save Branch
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Branch Outlet?"
        message={`Are you sure you want to remove ${deleteTarget?.name}? All associated terminal registers will be detached.`}
      />
    </div>
  );
}

export default Branches;
