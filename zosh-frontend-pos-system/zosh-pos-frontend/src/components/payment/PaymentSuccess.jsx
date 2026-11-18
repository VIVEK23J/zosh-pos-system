import { useState } from "react";
import { useNavigate } from "@/lib/rr-compat";
import {
  CheckCircle2,
  ShoppingBag,
  Printer,
  Copy,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Zap,
  QrCode,
  Globe,
  FileText,
  User,
} from "lucide-react";

export function PaymentSuccess({ payment, onNewOrder }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const orderDisplayId = payment?.orderId
    ? `#ORD-${payment.orderId}`
    : payment?.transactionId || "#ORD-COMPLETED";

  const handleCopyRef = () => {
    if (payment?.orderId || payment?.transactionId) {
      navigator.clipboard.writeText(
        String(payment?.orderId ? `ORD-${payment.orderId}` : payment.transactionId)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "card":
        return <CreditCard className="size-4" />;
      case "upi":
        return <Smartphone className="size-4" />;
      case "razorpay_qr":
        return <QrCode className="size-4 text-emerald-600" />;
      case "razorpay":
        return <Zap className="size-4 text-sky-600" />;
      case "stripe":
        return <Globe className="size-4 text-emerald-700" />;
      default:
        return <Banknote className="size-4" />;
    }
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case "razorpay_qr":
        return "RAZORPAY DYNAMIC QR";
      case "razorpay":
        return "RAZORPAY";
      case "stripe":
        return "STRIPE";
      case "upi":
        return "UPI";
      case "card":
        return "CARD";
      default:
        return "CASH";
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 my-6">
      <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-5">
        {/* Success Icon */}
        <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="size-10" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Payment Completed Successfully!
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Order confirmed & registered in database. Thermal receipt ready for printing.
          </p>
        </div>

        {/* Database Order ID Badge Card */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              Registered Order ID
            </span>
            <div className="text-lg font-extrabold font-mono text-emerald-950 dark:text-emerald-200">
              {orderDisplayId}
            </div>
            {payment?.orderId && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Database Record #{payment.orderId}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyRef}
            title="Copy Order Reference"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-700 transition"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy ID"}</span>
          </button>
        </div>

        {/* Printable Receipt Summary Box */}
        <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs text-left space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Timestamp</span>
              <strong className="text-gray-900 dark:text-white font-medium">{payment.completedAt}</strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Tender</span>
              <strong className="inline-flex items-center gap-1 text-gray-900 dark:text-white">
                {getMethodIcon(payment.method)}
                {getMethodLabel(payment.method)}
              </strong>
            </div>
          </div>

          {/* Customer line */}
          <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-500">Customer</span>
            <strong className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
              <User className="size-3 text-emerald-700" />
              {payment.customer
                ? `${payment.customer.name || payment.customer.fullName} (${payment.customer.phone || "No phone"})`
                : "Walk-in Customer"}
            </strong>
          </div>

          {/* Items breakdown */}
          {payment.items && payment.items.length > 0 && (
            <div className="py-2 border-b border-dashed border-gray-200 dark:border-gray-700 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Purchased Items ({payment.items.length})
              </span>
              {payment.items.map((item, idx) => (
                <div key={item.id || idx} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                  <span>
                    {item.name} × <strong>{item.quantity}</strong>
                  </span>
                  <span className="font-mono">
                    ₹{((item.price || item.sellingPrice || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1 text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">₹{(payment.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
              <span>Discount</span>
              <span className="font-mono">-₹{(payment.discount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5% GST)</span>
              <span className="font-mono">₹{(payment.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <span>Grand Total Paid</span>
              <span className="font-mono text-base">₹{payment.amount.toFixed(2)}</span>
            </div>
          </div>

          {payment.method === "cash" && (
            <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 space-y-1">
              <div className="flex justify-between text-gray-500">
                <span>Cash Tendered</span>
                <strong className="font-mono text-gray-900 dark:text-white">
                  ₹{payment.amountReceived.toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                <span>Change Returned</span>
                <strong className="font-mono">₹{payment.change.toFixed(2)}</strong>
              </div>
            </div>
          )}

          {payment.paymentRef && payment.method !== "cash" && (
            <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                Transaction Reference:
              </span>
              <code className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">
                {payment.paymentRef}
              </code>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <Printer className="size-4" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/cashier/orders")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <FileText className="size-4" />
            <span>Order History</span>
          </button>

          <button
            type="button"
            onClick={onNewOrder}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <ShoppingBag className="size-4" />
            <span>New Sale</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
