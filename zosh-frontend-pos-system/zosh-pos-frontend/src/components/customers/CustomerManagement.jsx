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

import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";
import CustomerDetails from "./CustomerDetails";

function CustomerManagement({ onBack, onNavigateToPOS }) {
  const dispatch = useDispatch();

  const customers = useSelector((state) => state.customers.customers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }

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
    <div className="customer-dashboard">
      <header className="customer-dashboard-header">
        <div>
          {onBack && (
            <button
              type="button"
              className="customer-back-btn"
              onClick={onBack}
            >
              <ArrowLeft size={17} />
              Back to POS Billing
            </button>
          )}

          <h1 style={{ marginTop: "12px", color: "#111827", fontSize: "26px", fontWeight: "800" }}>
            Customer Management
          </h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>
            Maintain customer records, view order history, and assign customers to POS orders
          </p>
        </div>

        <button
          type="button"
          className="new-customer-btn"
          onClick={() => {
            setEditingCustomer(null);
            setShowForm(true);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#174b35",
            color: "white",
            padding: "11px 18px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(23,75,53,0.2)",
          }}
        >
          <UserPlus size={18} />
          Add New Customer
        </button>
      </header>

      {/* KPI Stats Grid */}
      <div className="customer-stat-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="customer-stat-card">
          <div className="stat-icon green">
            <Users size={22} />
          </div>
          <span>Total Customers</span>
          <h2>{totalCustomers}</h2>
          <small style={{ color: "#16a34a", fontSize: "11px", marginTop: "4px" }}>
            {activeCustomers} Active accounts
          </small>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon blue">
            <ShoppingBag size={22} />
          </div>
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
          <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px" }}>
            Completed POS checkouts
          </small>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon orange">
            <IndianRupee size={22} />
          </div>
          <span>Total Customer Revenue</span>
          <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
          <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px" }}>
            Lifetime customer spend
          </small>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon" style={{ background: "#f3e8ff", color: "#9333ea" }}>
            <TrendingUp size={22} />
          </div>
          <span>Average Order Value</span>
          <h2>₹{avgOrderValue.toFixed(0)}</h2>
          <small style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px" }}>
            Per order average
          </small>
        </div>
      </div>

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
        <div className="customer-modal-overlay">
          <div className="customer-modal" style={{ maxWidth: "420px", textAlign: "center", padding: "26px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#fef2f2",
                color: "#dc2626",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertCircle size={28} />
            </div>

            <h3 style={{ fontSize: "18px", color: "#111827", marginBottom: "8px" }}>
              Delete Customer?
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "22px" }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action will remove the record from your POS directory.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: "11px",
                  borderRadius: "7px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#374151",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{
                  padding: "11px",
                  borderRadius: "7px",
                  border: "none",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
