import { useState } from "react";
import { X, Check } from "lucide-react";

function CustomerForm({ customer, onSave, onClose }) {
  const [formData, setFormData] = useState(() => ({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    status: customer?.status || "Active",
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Customer name is required.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      errs.phone = "Valid 10-digit phone number required.";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      ...(customer ? { id: customer.id } : {}),
    });
  };

  return (
    <div className="customer-modal-overlay">
      <div className="customer-modal">
        <div className="customer-modal-header">
          <h2 style={{ fontSize: "18px", color: "#111827", margin: 0 }}>
            {customer ? "Edit Customer Details" : "Add New Customer"}
          </h2>

          <button type="button" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Customer Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              autoFocus
            />
            {errors.name && (
              <span style={{ color: "#dc2626", fontSize: "11px", marginTop: "2px", display: "block" }}>
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label>10-Digit Mobile Phone *</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              maxLength={10}
              placeholder="e.g. 9876543210"
            />
            {errors.phone && (
              <span style={{ color: "#dc2626", fontSize: "11px", marginTop: "2px", display: "block" }}>
                {errors.phone}
              </span>
            )}
          </div>

          <div>
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. customer@example.com"
            />
            {errors.email && (
              <span style={{ color: "#dc2626", fontSize: "11px", marginTop: "2px", display: "block" }}>
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label>Delivery / Billing Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Flat 302, Green Avenue, Delhi"
              rows={3}
            />
          </div>

          <div>
            <label>Customer Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                outlineColor: "#174b35",
                background: "white",
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="customer-form-actions">
            <button
              type="button"
              onClick={onClose}
              style={{ background: "#f3f4f6", color: "#374151" }}
            >
              Cancel
            </button>

            <button type="submit" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={16} />
              {customer ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;
