import { Phone, Mail, MapPin, ShoppingBag, IndianRupee, TrendingUp, CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSelectedCustomer } from "../../store/customerSlice";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";

export function CustomerDetails({ customer, onClose, onStartOrder }) {
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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Customer Profile & History"
      subtitle={`Account record for ${customer.name || customer.fullName}`}
    >
      <div className="space-y-4 text-xs">
        {/* Customer Avatar & Hero Banner */}
        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-emerald-800 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {(customer.name || customer.fullName || "C").charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {customer.name || customer.fullName}
              </h3>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                Customer Record #{customer.id}
              </span>
            </div>
          </div>

          <Badge variant="success">
            {customer.status || "Active"}
          </Badge>
        </div>

        {/* Contact Info Well */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Phone className="size-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="font-mono">{customer.phone}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Mail className="size-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{customer.email || "No email registered"}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MapPin className="size-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{customer.address || "No address provided"}</span>
          </div>
        </div>

        {/* KPI Mini-cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1 font-semibold block mb-0.5">
              <ShoppingBag className="size-3" /> Total Orders
            </span>
            <strong className="text-base font-bold text-gray-900 dark:text-white font-mono">
              {customer.totalOrders}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1 font-semibold block mb-0.5">
              <IndianRupee className="size-3" /> Total Spent
            </span>
            <strong className="text-base font-bold text-emerald-800 dark:text-emerald-400 font-mono">
              ₹{(customer.totalSpent || 0).toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="col-span-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1 font-semibold block mb-0.5">
              <TrendingUp className="size-3" /> Average Ticket Size
            </span>
            <strong className="text-base font-bold text-emerald-800 dark:text-emerald-300 font-mono">
              ₹{avgOrderValue.toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleStartOrder}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <CheckCircle className="size-4" />
            <span>Select & Bill on POS</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CustomerDetails;
