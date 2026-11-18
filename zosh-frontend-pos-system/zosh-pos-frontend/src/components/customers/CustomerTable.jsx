import {
  Search,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  X,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Badge } from "../common/Badge";

export function CustomerTable({
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
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
      {/* Table Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Registered Customers Directory
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredCustomers.length} of {customers.length} total customers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs">
            {["All", "Active", "Inactive"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  statusFilter === st
                    ? "bg-emerald-800 text-white shadow-2xs"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs w-full sm:w-64">
            <Search className="size-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
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
        </div>
      </div>

      {/* Customer Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact Details</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3 text-center">Orders</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCustomers.map((customer) => {
              const isSelected = selectedCustomer?.id === customer.id;

              return (
                <tr
                  key={customer.id}
                  className={`hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition ${
                    isSelected ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                          isSelected
                            ? "bg-emerald-800 text-white"
                            : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        }`}
                      >
                        {(customer.name || customer.fullName || "C")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-xs font-bold text-gray-900 dark:text-white">
                            {customer.name || customer.fullName}
                          </strong>
                          {isSelected && (
                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              CURRENT POS
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 block font-mono">
                          ID: #{String(customer.id).slice(-4)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                    <div className="space-y-0.5 text-xs">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Phone className="size-3 text-emerald-700 dark:text-emerald-400" />
                        {customer.phone}
                      </span>
                      {customer.email && (
                        <span className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <Mail className="size-3" />
                          {customer.email}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 max-w-[180px] text-gray-500 dark:text-gray-400 truncate">
                    {customer.address || "—"}
                  </td>

                  <td className="px-4 py-3.5 text-center font-mono font-bold text-gray-800 dark:text-gray-200">
                    {customer.totalOrders}
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-800 dark:text-emerald-400">
                    ₹{(customer.totalSpent || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-3.5">
                    <Badge variant={customer.status === "Active" ? "success" : "default"}>
                      {customer.status || "Active"}
                    </Badge>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        title="Select for POS order"
                        onClick={() => onSelectForOrder(customer)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          isSelected
                            ? "bg-emerald-900 text-white shadow-2xs"
                            : "bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs"
                        }`}
                      >
                        <CheckCircle className="size-3.5" />
                        <span>{isSelected ? "Selected" : "Select"}</span>
                      </button>

                      <button
                        type="button"
                        title="View profile"
                        onClick={() => onView(customer)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <Eye className="size-4" />
                      </button>

                      <button
                        type="button"
                        title="Edit customer"
                        onClick={() => onEdit(customer)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <Pencil className="size-4" />
                      </button>

                      <button
                        type="button"
                        title="Delete customer"
                        onClick={() => onDelete(customer.id, customer.name)}
                        className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-400 space-y-2">
            <User className="size-8 mx-auto text-gray-300 dark:text-gray-600" />
            <p className="font-semibold text-gray-600 dark:text-gray-300">No customers found</p>
            <p>Try searching for a different keyword or switch the status filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerTable;
