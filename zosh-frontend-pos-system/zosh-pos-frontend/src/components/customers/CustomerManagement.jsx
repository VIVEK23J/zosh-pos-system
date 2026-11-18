import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  UserPlus,
  ShoppingBag,
  IndianRupee,
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  Trash2,
} from "lucide-react";

import {
  fetchCustomers,
  createCustomerAsync,
  updateCustomerAsync,
  deleteCustomerAsync,
  setSelectedCustomer,
} from "../../store/customerSlice";
import { StatCard } from "../common/StatCard";
import { Badge } from "../common/Badge";
import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";
import CustomerDetails from "./CustomerDetails";

export function CustomerManagement({ onBack, onNavigateToPOS }) {
  const dispatch = useDispatch();

  const customers = useSelector((state) => state.customers.customers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "Active").length;

  const totalOrders = customers.reduce(
    (total, customer) => total + (customer.totalOrders || 0),
    0
  );

  const totalRevenue = customers.reduce(
    (total, customer) => total + (customer.totalSpent || 0),
    0
  );

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const handleSave = (customerData) => {
    if (editingCustomer) {
      dispatch(updateCustomerAsync({ id: editingCustomer.id, data: customerData }));
    } else {
      dispatch(createCustomerAsync(customerData));
    }

    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDeleteRequest = (id, name) => {
    setDeleteConfirm({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      dispatch(deleteCustomerAsync(deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const handleSelectForOrder = (customer) => {
    dispatch(setSelectedCustomer(customer));
    if (onNavigateToPOS) {
      onNavigateToPOS();
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Action controls - Shift Reports Design System */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Customer Directory
            </h1>
            <Badge variant="success">
              {totalCustomers} Customer Accounts
            </Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Maintain customer records, view order history, and assign customers to POS orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
            >
              <ArrowLeft className="size-4" />
              <span>Back to POS</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setEditingCustomer(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <UserPlus className="size-4" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          subtitle={`${activeCustomers} active retail accounts`}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Total Customer Orders"
          value={totalOrders}
          subtitle="Completed POS register checkouts"
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Customer Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          subtitle="Lifetime spend recorded"
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          title="Average Order Value"
          value={`₹${avgOrderValue.toFixed(0)}`}
          subtitle="Per order historical average"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Customers Table Component */}
      <CustomerTable
        customers={customers}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onView={setViewCustomer}
        onSelectForOrder={handleSelectForOrder}
      />

      {/* Add / Edit Customer Modal */}
      {showForm && (
        <CustomerForm
          key={editingCustomer?.id || "new"}
          customer={editingCustomer}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* View Customer Details Modal */}
      {viewCustomer && (
        <CustomerDetails
          customer={viewCustomer}
          onClose={() => setViewCustomer(null)}
          onStartOrder={handleSelectForOrder}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl space-y-4 text-center">
            <div className="size-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 flex items-center justify-center mx-auto">
              <AlertCircle className="size-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Delete Customer Profile?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action will permanently remove the record from your POS directory.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
              >
                <Trash2 className="size-4" />
                <span>Delete Customer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
