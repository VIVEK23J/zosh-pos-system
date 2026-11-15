import {
  Search,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { useSelector } from "react-redux";

function CustomerTable({
  customers,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onEdit,
  onDelete,
  onView,
  onSelectForOrder,
}) {
  const selectedCustomer = useSelector(
    (state) => state.customers.selectedCustomer
  );

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();
    const matchesSearch =
      (customer.name && customer.name.toLowerCase().includes(query)) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.phone && customer.phone.includes(query)) ||
      (customer.address && customer.address.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="customer-table-card">
      <div className="customer-table-heading">
        <div>
          <h2>Registered Customers Directory</h2>
          <p>
            Showing {filteredCustomers.length} of {customers.length} total customers
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Status Filter Tabs */}
          <div style={{ display: "flex", background: "#f3f4f6", padding: "3px", borderRadius: "8px", gap: "2px" }}>
            {["All", "Active", "Inactive"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: statusFilter === st ? "#ffffff" : "transparent",
                  color: statusFilter === st ? "#174b35" : "#6b7280",
                  boxShadow: statusFilter === st ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="customer-table-search">
            <Search size={16} color="#6b7280" />
            <input
              placeholder="Search by name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="customer-table-scroll">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => {
              const isSelected = selectedCustomer?.id === customer.id;

              return (
                <tr
                  key={customer.id}
                  style={{
                    backgroundColor: isSelected ? "#f0fdf4" : undefined,
                  }}
                >
                  <td>
                    <div className="table-customer">
                      <div
                        className="table-avatar"
                        style={{
                          backgroundColor: isSelected ? "#174b35" : undefined,
                          color: isSelected ? "#ffffff" : undefined,
                        }}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <strong>{customer.name}</strong>
                          {isSelected && (
                            <span
                              style={{
                                background: "#bbf7d0",
                                color: "#166534",
                                fontSize: "10px",
                                fontWeight: "700",
                                padding: "1px 5px",
                                borderRadius: "4px",
                              }}
                            >
                              CURRENT POS
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>
                          ID: #{customer.id.toString().slice(-4)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "13px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Phone size={12} color="#6b7280" />
                        {customer.phone}
                      </span>
                      {customer.email && (
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#6b7280", fontSize: "12px" }}>
                          <Mail size={12} color="#9ca3af" />
                          {customer.email}
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ maxWidth: "200px" }}>
                    <span
                      title={customer.address}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "13px",
                        color: "#4b5563",
                      }}
                    >
                      {customer.address || "—"}
                    </span>
                  </td>

                  <td>
                    <strong style={{ fontSize: "14px" }}>
                      {customer.totalOrders}
                    </strong>
                  </td>

                  <td>
                    <strong style={{ color: "#174b35", fontSize: "14px" }}>
                      ₹{(customer.totalSpent || 0).toLocaleString("en-IN")}
                    </strong>
                  </td>

                  <td>
                    <span
                      className="customer-status"
                      style={{
                        background: customer.status === "Active" ? "#e6f4ea" : "#f1f3f4",
                        color: customer.status === "Active" ? "#137333" : "#5f6368",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                        display: "inline-block",
                      }}
                    >
                      {customer.status || "Active"}
                    </span>
                  </td>

                  <td>
                    <div className="customer-actions" style={{ justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        title="Select for POS order"
                        onClick={() => onSelectForOrder(customer)}
                        style={{
                          color: isSelected ? "#16a34a" : "#174b35",
                          background: isSelected ? "#dcfce7" : "#f0fdf4",
                          padding: "6px 9px",
                          borderRadius: "6px",
                          border: "1px solid #bbf7d0",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        <CheckCircle size={14} />
                        {isSelected ? "Selected" : "Bill"}
                      </button>

                      <button
                        type="button"
                        title="View profile"
                        onClick={() => onView(customer)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        title="Edit customer"
                        onClick={() => onEdit(customer)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete customer"
                        onClick={() => onDelete(customer.id, customer.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="7" className="customer-no-results" style={{ textAlign: "center", padding: "40px" }}>
                  <p style={{ color: "#374151", fontWeight: "600", marginBottom: "4px" }}>
                    No customers match your criteria.
                  </p>
                  <span style={{ color: "#9ca3af", fontSize: "13px" }}>
                    Try adjusting search keywords or changing the status filter.
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerTable;
