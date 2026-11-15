import { X, Phone, Mail, MapPin, ShoppingBag, IndianRupee, TrendingUp, CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSelectedCustomer } from "../../store/customerSlice";

function CustomerDetails({ customer, onClose, onStartOrder }) {
  const dispatch = useDispatch();

  if (!customer) return null;

  const avgOrderValue =
    customer.totalOrders > 0
      ? customer.totalSpent / customer.totalOrders
      : 0;

  const handleStartOrder = () => {
    dispatch(setSelectedCustomer(customer));
    if (onStartOrder) {
      onStartOrder(customer);
    }
    onClose();
  };

  return (
    <div className="customer-modal-overlay">
      <div className="customer-details-modal">
        <div className="customer-modal-header">
          <h2 style={{ fontSize: "18px", color: "#111827", margin: 0 }}>
            Customer Profile
          </h2>

          <button type="button" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="customer-profile">
          <div className="profile-avatar">
            {customer.name.charAt(0).toUpperCase()}
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>
            {customer.name}
          </h2>

          <span
            className="customer-status"
            style={{
              background: customer.status === "Active" ? "#e6f4ea" : "#f1f3f4",
              color: customer.status === "Active" ? "#137333" : "#5f6368",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {customer.status || "Active"}
          </span>
        </div>

        <div className="profile-information">
          <p>
            <Mail size={16} color="#174b35" />
            <span>{customer.email || "No email registered"}</span>
          </p>

          <p>
            <Phone size={16} color="#174b35" />
            <span>{customer.phone}</span>
          </p>

          <p>
            <MapPin size={16} color="#174b35" />
            <span>{customer.address || "No address specified"}</span>
          </p>
        </div>

        <div className="profile-stats">
          <div>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <ShoppingBag size={13} /> Total Orders
            </span>
            <strong>{customer.totalOrders}</strong>
          </div>

          <div>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IndianRupee size={13} /> Total Spent
            </span>
            <strong>₹{(customer.totalSpent || 0).toLocaleString("en-IN")}</strong>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={13} /> Avg Spend / Order
            </span>
            <strong>₹{avgOrderValue.toFixed(2)}</strong>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "24px" }}>
          <button
            type="button"
            className="profile-close-btn"
            onClick={onClose}
            style={{
              margin: 0,
              background: "#ffffff",
              border: "1px solid #d1d5db",
              color: "#374151",
            }}
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleStartOrder}
            style={{
              background: "#174b35",
              color: "white",
              border: "none",
              borderRadius: "7px",
              padding: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <CheckCircle size={16} />
            Bill Customer
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;
