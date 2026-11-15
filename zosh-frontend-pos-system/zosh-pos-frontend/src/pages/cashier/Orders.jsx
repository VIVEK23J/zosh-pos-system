import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Search,
  Eye,
  FileCheck2,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  X,
  Zap,
  QrCode,
  Hash,
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";

export function Orders() {
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const user = useSelector((state) => state.auth.user);
  const branchId = currentBranch?.id || user?.branchId || 1;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [branchId]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let data = await orderService.getOrdersByBranch(branchId);
      if (!data || data.length === 0) {
        data = await orderService.getAllOrders();
      }
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    const orderIdStr = String(order.id || order.orderId || "");
    const matchesSearch =
      orderIdStr.includes(q) ||
      `ord-${orderIdStr}`.includes(q) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.customerPhone && order.customerPhone.includes(q)) ||
      (order.paymentTransactionId && order.paymentTransactionId.toLowerCase().includes(q));

    let matchesPayment = true;
    if (paymentFilter !== "ALL") {
      const p = String(order.payment || "").toUpperCase();
      if (paymentFilter === "UPI") {
        matchesPayment = p === "UPT" || p === "UPI" || p === "RAZORPAY_QR";
      } else if (paymentFilter === "RAZORPAY") {
        matchesPayment = p === "RAZORPAY" || p === "RAZORPAY_QR";
      } else {
        matchesPayment = p === paymentFilter;
      }
    }

    return matchesSearch && matchesPayment;
  });

  const getPaymentBadge = (type, txId) => {
    const p = String(type || "").toUpperCase();
    if (p === "CARD") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <CreditCard className="size-3.5 text-sky-600" />
          <span>CARD</span>
        </span>
      );
    }
    if (p === "RAZORPAY") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Zap className="size-3.5 text-blue-600" />
          <span>RAZORPAY</span>
        </span>
      );
    }
    if (p === "UPT" || p === "UPI" || p === "RAZORPAY_QR") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Smartphone className="size-3.5 text-emerald-600" />
          <span>UPI</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Banknote className="size-3.5" />
        <span>CASH</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Order History & Invoices
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real database transaction records with Order IDs, payment tender details and customer receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="lg">
            {filteredOrders.length} {filteredOrders.length === 1 ? "Order" : "Orders"}
          </Badge>
          <button
            type="button"
            onClick={loadOrders}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-xs font-semibold"
            title="Refresh Orders"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full sm:w-80">
          <Search className="size-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Order ID (#1, ORD-1), customer, phone, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs outline-none text-gray-900 dark:text-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Payment Filter Chips */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "CASH", label: "Cash" },
            { id: "CARD", label: "Card" },
            { id: "UPI", label: "UPI" },
            { id: "RAZORPAY", label: "Razorpay" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPaymentFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                paymentFilter === tab.id
                  ? "bg-white dark:bg-gray-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Payment Method</th>
                  <th className="px-5 py-3.5">Transaction Ref</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredOrders.map((order) => {
                  const displayId = order.id || order.orderId;
                  return (
                    <tr
                      key={displayId}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* Prominent Order ID */}
                      <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-700">
                            #ORD-{displayId}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {order.customerName || "Walk-in Customer"}
                        </div>
                        {order.customerPhone && (
                          <div className="text-[11px] text-gray-400">{order.customerPhone}</div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>

                      <td className="px-5 py-4">
                        {getPaymentBadge(order.payment, order.paymentTransactionId)}
                      </td>

                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                        {order.paymentTransactionId ? (
                          <span className="truncate block max-w-[140px]" title={order.paymentTransactionId}>
                            {order.paymentTransactionId}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Cash Tender</span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant={order.status === "COMPLETED" ? "success" : "warning"}>
                          {order.status || "COMPLETED"}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                          title="View Order Details"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={FileCheck2}
            title="No orders found"
            description="No transactions match your current search or payment filter."
          />
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order #ORD-${selectedOrder.id || selectedOrder.orderId} Details`}
          subtitle={`Processed on ${new Date(selectedOrder.createdAt).toLocaleString("en-IN")}`}
        >
          <div className="space-y-4 text-xs">
            {/* Header info card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Order Identification
                </span>
                <strong className="text-sm font-mono text-emerald-800 dark:text-emerald-400 block">
                  #ORD-{selectedOrder.id || selectedOrder.orderId}
                </strong>
                <span className="text-[11px] text-gray-500">Database ID: #{selectedOrder.id || selectedOrder.orderId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Customer
                </span>
                <strong className="text-gray-900 dark:text-white block">
                  {selectedOrder.customerName || "Walk-in Customer"}
                </strong>
                {selectedOrder.customerPhone && (
                  <span className="text-gray-500">{selectedOrder.customerPhone}</span>
                )}
              </div>
            </div>

            {/* Payment & Audit Info */}
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Payment Tender
                  </span>
                  <strong className="text-gray-800 dark:text-gray-200">
                    {selectedOrder.payment === "UPT"
                      ? "UPI"
                      : selectedOrder.payment}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Transaction / Auth Reference
                  </span>
                  <code className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">
                    {selectedOrder.paymentTransactionId || "CASH-TRANSACTION"}
                  </code>
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Purchased Items ({selectedOrder.items?.length || 0})
              </span>
              <div className="space-y-2 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-1 border-b last:border-b-0 border-gray-100 dark:border-gray-800"
                    >
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white block">
                          {item.name}
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          Qty: {item.quantity} × ₹{Number(item.price || 0).toFixed(2)}
                        </span>
                      </div>
                      <strong className="text-gray-800 dark:text-gray-200">
                        ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                      </strong>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 italic py-1">Standard Item Summary</div>
                )}
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm font-bold">
              <span>Grand Total</span>
              <span className="text-emerald-700 dark:text-emerald-400 text-base">
                ₹{Number(selectedOrder.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-50 transition"
              >
                <Printer className="size-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Orders;
