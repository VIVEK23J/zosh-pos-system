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
} from "lucide-react";

function PaymentSuccess({ payment, onNewOrder }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const orderDisplayId = payment?.orderId ? `#ORD-${payment.orderId}` : payment?.transactionId || "#ORD-COMPLETED";

  const handleCopyRef = () => {
    if (payment?.orderId || payment?.transactionId) {
      navigator.clipboard.writeText(String(payment?.orderId ? `ORD-${payment.orderId}` : payment.transactionId));
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
        return <CreditCard size={16} />;
      case "upi":
        return <Smartphone size={16} />;
      case "razorpay_qr":
        return <QrCode size={16} className="text-emerald-600" />;
      case "razorpay":
        return <Zap size={16} className="text-sky-600" />;
      case "stripe":
        return <Globe size={16} className="text-indigo-600" />;
      default:
        return <Banknote size={16} />;
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
    <div className="payment-success" style={{ maxWidth: "560px", margin: "40px auto" }}>
      <div className="success-icon" style={{ color: "#16a34a" }}>
        <CheckCircle2 size={62} />
      </div>

      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
        Payment Completed Successfully!
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Order recorded in database. Thermal receipt ready for printing.
      </p>

      {/* Prominent Database Order ID Card */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 mb-5">
        <div className="text-left">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Generated Order ID
          </span>
          <div className="text-base font-extrabold font-mono text-emerald-900 dark:text-emerald-200">
            {orderDisplayId}
          </div>
          {payment?.orderId && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Database Record #{payment.orderId}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopyRef}
          title="Copy Order ID"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-700 transition"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          <span>{copied ? "Copied" : "Copy ID"}</span>
        </button>
      </div>

      {/* Printable Receipt Card */}
      <div className="success-details" style={{ textAlign: "left", padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px", marginBottom: "12px" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Timestamp</span>
            <strong style={{ display: "block", fontSize: "13px" }}>{payment.completedAt}</strong>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Payment Method</span>
            <strong style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" }}>
              {getMethodIcon(payment.method)}
              {getMethodLabel(payment.method)}
            </strong>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span>Customer</span>
          <strong>
            {payment.customer ? `${payment.customer.name || payment.customer.fullName} (${payment.customer.phone || "No phone"})` : "Walk-in Customer"}
          </strong>
        </div>

        {/* Itemized Purchased List */}
        {payment.items && payment.items.length > 0 && (
          <div style={{ borderTop: "1px dashed #d1d5db", borderBottom: "1px dashed #d1d5db", padding: "10px 0", margin: "10px 0" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Purchased Items ({payment.items.length})
            </span>
            {payment.items.map((item, idx) => (
              <div key={item.id || idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{((item.price || item.sellingPrice || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
          <span>Subtotal</span>
          <span>₹{(payment.subtotal || 0).toFixed(2)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
          <span>Discount</span>
          <span style={{ color: "#16a34a" }}>-₹{(payment.discount || 0).toFixed(2)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
          <span>Tax (5% GST)</span>
          <span>₹{(payment.tax || 0).toFixed(2)}</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "10px",
            fontSize: "16px",
            fontWeight: "700",
            color: "#174b35",
          }}
        >
          <span>Grand Total Paid</span>
          <span>₹{payment.amount.toFixed(2)}</span>
        </div>

        {payment.method === "cash" && (
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #e5e7eb", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>Cash Tendered</span>
              <strong>₹{payment.amountReceived.toFixed(2)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
              <span>Change Returned</span>
              <strong>₹{payment.change.toFixed(2)}</strong>
            </div>
          </div>
        )}

        {payment.paymentRef && payment.method !== "cash" && (
          <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px dashed #e5e7eb", fontSize: "11px", color: "#6b7280" }}>
            <span className="block font-medium">Payment / Auth Reference:</span>
            <code className="text-emerald-700 font-mono text-xs font-semibold">{payment.paymentRef}</code>
          </div>
        )}
      </div>

      {/* Post-Transaction Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          type="button"
          onClick={handlePrint}
          className="print-receipt-btn"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Printer size={18} />
          Print Thermal Receipt
        </button>

        <button
          type="button"
          onClick={() => navigate("/cashier/orders")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #174b35",
            background: "#eff7f1",
            color: "#174b35",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <FileText size={18} />
          View Order History
        </button>

        <button
          type="button"
          onClick={onNewOrder}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#174b35",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <ShoppingBag size={18} />
          New Sale
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
