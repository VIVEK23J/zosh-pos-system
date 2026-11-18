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
import { Badge } from "../common/Badge";

export function CustomerSelector({ onNavigateToCustomers }) {
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
    `${customer.name || customer.fullName || ""} ${customer.phone || ""} ${customer.email || ""}`
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
      email:
        email.trim() ||
        `${name.trim().toLowerCase().replace(/\s+/g, "")}@example.com`,
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
    <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800">
      {/* Header with Title and Unified Customer Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
            <UserRound className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              Customer Assignment
            </h3>
            <p className="text-[11px] text-gray-400">
              Attach customer profile to order
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToCustomers && (
            <button
              type="button"
              onClick={onNavigateToCustomers}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition"
              title="Open full customer directory"
            >
              <ExternalLink className="size-3.5" />
              <span>Customer</span>
            </button>
          )}

          {selectedCustomer && (
            <button
              type="button"
              onClick={() => dispatch(setSelectedCustomer(null))}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="Deselect customer"
            >
              <X className="size-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Customer View */}
      {selectedCustomer ? (
        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-emerald-800 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              {(selectedCustomer.name || selectedCustomer.fullName || "C")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <strong className="text-xs font-bold text-gray-900 dark:text-white truncate block">
                  {selectedCustomer.name || selectedCustomer.fullName}
                </strong>
                <Badge variant="success" size="sm">
                  {selectedCustomer.status || "Active"}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Phone className="size-3 text-emerald-700 dark:text-emerald-400" />
                  {selectedCustomer.phone}
                </span>

                {selectedCustomer.email && (
                  <span className="hidden sm:flex items-center gap-1 truncate">
                    <Mail className="size-3" />
                    {selectedCustomer.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="size-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Check className="size-3.5 stroke-[3]" />
          </div>
        </div>
      ) : (
        /* Unselected Customer State */
        <div className="space-y-2.5">
          {/* Search Box */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-xs">
            <Search className="size-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Quick Dropdown Options (when searching or available) */}
          {!showForm && search.trim() && (
            <div className="max-h-40 overflow-y-auto space-y-1 p-1 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-xs">
              {filteredCustomers.slice(0, 5).map((customer) => (
                <button
                  type="button"
                  key={customer.id}
                  onClick={() => {
                    dispatch(setSelectedCustomer(customer));
                    setSearch("");
                  }}
                  className="w-full p-2 rounded-lg hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 text-left flex items-center justify-between gap-2 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {(customer.name || customer.fullName || "C").charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <strong className="text-xs font-semibold text-gray-900 dark:text-white truncate block">
                        {customer.name || customer.fullName}
                      </strong>
                      <span className="text-[10px] text-gray-400 block">
                        {customer.phone}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                    Select
                  </span>
                </button>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="p-3 text-center text-[11px] text-gray-400">
                  No matching customers found.
                </div>
              )}
            </div>
          )}

          {/* Quick Add Customer Form */}
          {showForm ? (
            <form
              onSubmit={handleAddCustomer}
              className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between pb-1 border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  New Customer Quick Add
                </span>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="10-digit Phone Number *"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  maxLength={10}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Address / Locality (optional)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition"
                >
                  Save & Assign
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="size-3.5" />
              <span>Quick Add Customer</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerSelector;
