import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { employeeService } from "../../services/employeeService";
import { ROLES, ROLE_LABELS } from "../../constants/roles";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../components/common/Toast";

export function BranchEmployees() {
  const toast = useToast();
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const branchId = currentBranch?.id || 1;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "password123",
    role: ROLES.CASHIER,
    status: "ACTIVE",
  });

  useEffect(() => {
    loadEmployees();
  }, [branchId]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getEmployeesByBranch(branchId);
      setEmployees(data);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "password123",
      role: ROLES.CASHIER,
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      fullName: emp.fullName || "",
      email: emp.email || "",
      phone: emp.phone || "",
      password: "",
      role: emp.role || ROLES.CASHIER,
      status: emp.status || "ACTIVE",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const updated = await employeeService.updateEmployee(editingEmployee.id, formData);
        setEmployees(employees.map((e) => (e.id === editingEmployee.id ? { ...e, ...formData } : e)));
        toast.success("Employee Updated", `${formData.fullName}'s profile was updated.`);
      } else {
        const created = await employeeService.createBranchEmployee(branchId, formData);
        setEmployees([...employees, created]);
        toast.success("Employee Added", `${formData.fullName} added to branch staff.`);
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "Could not save employee profile");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await employeeService.deleteEmployee(deleteTarget.id);
      setEmployees(employees.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Employee Removed", "Staff member removed from branch directory.");
    } catch {
      toast.error("Error", "Could not remove employee");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = search.toLowerCase();
    return (
      emp.fullName?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Branch Staff & Employee Directory
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage cashier terminals, branch manager privileges and personnel status
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
        >
          <UserPlus className="size-4" />
          <span>Add Branch Employee</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-sm">
          <Search className="size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employee by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs outline-none text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Employee Name</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">System Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                          {emp.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">
                            {emp.fullName}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">ID: #{emp.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Phone className="size-3 text-gray-400" />
                        <span>{emp.phone}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="size-3 text-gray-400" />
                        <span>{emp.email}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant="purple" size="sm">
                        {ROLE_LABELS[emp.role] || emp.role}
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={emp.status === "ACTIVE" ? "success" : "warning"} size="sm">
                        {emp.status || "ACTIVE"}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                          title="Edit Employee"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                          title="Remove Employee"
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

      {/* Add / Edit Employee Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEmployee ? "Edit Employee Profile" : "Register Branch Staff"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Mobile Phone (10 digits) *
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {editingEmployee ? "Reset Password (Leave blank to keep current)" : "Password *"}
            </label>
            <div className="relative">
              <Lock className="size-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required={!editingEmployee}
                value={formData.password || ""}
                placeholder={editingEmployee ? "••••••••" : "Minimum 6 characters"}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Branch Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            >
              <option value={ROLES.CASHIER}>Cashier POS Operator</option>
              <option value={ROLES.BRANCH_ADMIN}>Branch Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive / On Leave</option>
            </select>
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
              Save Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Employee?"
        message={`Are you sure you want to remove ${deleteTarget?.fullName} from this branch?`}
      />
    </div>
  );
}

export default BranchEmployees;
