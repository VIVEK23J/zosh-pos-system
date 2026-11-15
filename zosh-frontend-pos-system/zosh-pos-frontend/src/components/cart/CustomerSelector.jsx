import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserRound,
  Search,
  Plus,
  X,
  Phone,
  Check,
  Mail,
  ExternalLink,
} from "lucide-react";
import {
  setSelectedCustomer,
  createCustomerAsync,
  fetchCustomers,
} from "../../store/customerSlice";

function CustomerSelector({ onNavigateToCustomers }) {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
  const selectedCustomer = useSelector(
    (state) => state.customers.selectedCustomer
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name || customer.fullName} ${customer.phone} ${customer.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const newCustomer = {
      fullName: name.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, "")}@example.com`,
      address: address.trim() || "Local Customer",
      totalOrders: 0,
      totalSpent: 0,
      status: "Active",
    };

    const action = await dispatch(createCustomerAsync(newCustomer));
    if (action.payload) {
      dispatch(setSelectedCustomer(action.payload));
    }

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setSearch("");
    setShowForm(false);
  };

  return (
    <div className="customer-selector">
      <div className="customer-heading">
        <div>
          <h3>
            <UserRound size={18} />
            Customer Information
          </h3>
          <p>Assign customer to apply history and receipts</p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {onNavigateToCustomers && (
            <button
              type="button"
              className="customer-directory-btn"
              onClick={onNavigateToCustomers}
              title="Open full customer directory"
              style={{
                background: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                padding: "5px 9px",
                fontSize: "12px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "#174b35",
              }}
            >
              <ExternalLink size={13} />
              Directory
            </button>
          )}

          {selectedCustomer && (
            <button
              type="button"
              className="customer-remove"
              onClick={() => dispatch(setSelectedCustomer(null))}
            >
              <X size={15} />
              Remove
            </button>
          )}
        </div>
      </div>

      {selectedCustomer ? (
        <div className="selected-customer">
          <div className="customer-avatar">
            {selectedCustomer.name.charAt(0).toUpperCase()}
          </div>

          <div className="customer-info">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <strong>{selectedCustomer.name}</strong>
              <span
                style={{
                  background: selectedCustomer.status === "Active" ? "#e6f4ea" : "#f1f3f4",
                  color: selectedCustomer.status === "Active" ? "#137333" : "#5f6368",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "600",
                }}
              >
                {selectedCustomer.status || "Active"}
              </span>
            </div>

            <span>
              <Phone size={12} />
              {selectedCustomer.phone}
            </span>

            {selectedCustomer.email && (
              <span style={{ fontSize: "11px", color: "#6b7280" }}>
                <Mail size={12} />
                {selectedCustomer.email}
              </span>
            )}
          </div>

          <Check size={20} color="#174b35" />
        </div>
      ) : (
        <>
          <div className="customer-search">
            <Search size={16} />
            <input
              placeholder="Search by customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {!showForm && (
            <div className="customer-list">
              {filteredCustomers.map((customer) => (
                <button
                  type="button"
                  className="customer-option"
                  key={customer.id}
                  onClick={() => {
                    dispatch(setSelectedCustomer(customer));
                    setSearch("");
                  }}
                >
                  <div className="customer-avatar">
                    {customer.name.charAt(0)}
                  </div>

                  <div className="customer-info">
                    <strong>{customer.name}</strong>
                    <span>
                      <Phone size={11} style={{ marginRight: 2 }} />
                      {customer.phone}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginLeft: "auto",
                    }}
                  >
                    {customer.totalOrders} orders
                  </span>
                </button>
              ))}

              {filteredCustomers.length === 0 && (
                <p className="customer-empty">
                  No matching customers found.
                </p>
              )}
            </div>
          )}

          {showForm ? (
            <form className="customer-form" onSubmit={handleAddCustomer}>
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="10-digit Phone Number *"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                maxLength={10}
                required
              />

              <input
                type="email"
                placeholder="Email Address (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="text"
                placeholder="Address / City (optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div className="customer-form-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Save & Select
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="add-customer-btn"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Quick Add Customer
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default CustomerSelector;
