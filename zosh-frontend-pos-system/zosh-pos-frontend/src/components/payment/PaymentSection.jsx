import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Banknote,
  CreditCard,
  Smartphone,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  User,
  Zap,
  Globe,
  RefreshCw,
  XCircle,
  Info,
} from "lucide-react";
import { recordCustomerOrder } from "../../store/customerSlice";
import { orderService } from "../../services/orderService";
import { paymentService, loadRazorpayScript } from "../../services/paymentService";
import { RazorpayQrTimer } from "./RazorpayQrTimer";
import { Badge } from "../common/Badge";

export function PaymentSection({ onBack, onComplete }) {
  const dispatch = useDispatch();

  const {
    cartItems,
    subtotal,
    discount,
    tax,
    grandTotal,
  } = useSelector((state) => state.cart);

  const selectedCustomer = useSelector(
    (state) => state.customers.selectedCustomer
  );

  // 'cash' | 'card' | 'upi' | 'razorpay' | 'razorpay_qr' | 'stripe'
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Cash state
  const [amountReceived, setAmountReceived] = useState("");

  // Card state (terminal slip)
  const [cardAuthCode, setCardAuthCode] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [cardNetwork, setCardNetwork] = useState("VISA");
  const [cardType, setCardType] = useState("DEBIT");

  // UPI state
  const [transactionId, setTransactionId] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [failureError, setFailureError] = useState(null);

  // Razorpay Gateway Config
  const [rzpConfig, setRzpConfig] = useState(null);
  const [showConfigNotice, setShowConfigNotice] = useState(false);

  // Stable pos reference across renders
  const [posReceiptRef, setPosReceiptRef] = useState("");
  useEffect(() => {
    setPosReceiptRef(`RCPT-${Date.now()}`);
  }, []);

  useEffect(() => {
    paymentService.getRazorpayConfig().then((cfg) => {
      setRzpConfig(cfg);
    });
  }, []);

  const total = grandTotal;
  const numReceived = Number(amountReceived) || 0;
  const isCash = paymentMethod === "cash";
  const isCard = paymentMethod === "card";
  const isUpi = paymentMethod === "upi";
  const isRazorpay = paymentMethod === "razorpay";
  const isRazorpayQr = paymentMethod === "razorpay_qr";
  const isStripe = paymentMethod === "stripe";

  const change = Math.max(0, numReceived - total);
  const remainingDue = Math.max(0, total - numReceived);

  // Validation logic
  let canPay = false;
  let validationMessage = "";

  if (total <= 0) {
    canPay = false;
    validationMessage = "Cart is empty or payable amount is zero.";
  } else if (isCash) {
    if (amountReceived === "") {
      canPay = false;
      validationMessage = "Please enter amount received from customer.";
    } else if (numReceived < total) {
      canPay = false;
      validationMessage = `Insufficient cash received. Remaining due: ₹${remainingDue.toFixed(2)}`;
    } else {
      canPay = true;
    }
  } else if (isCard) {
    if (cardAuthCode.trim().length >= 4) {
      canPay = true;
    } else {
      canPay = false;
      validationMessage = "Enter the Approval / Auth code from the card terminal receipt slip.";
    }
  } else if (isUpi) {
    if (transactionId.trim().length >= 6) {
      canPay = true;
    } else {
      canPay = false;
      validationMessage = "Enter the customer's 12-digit UPI UTR / Transaction Reference.";
    }
  } else if (isRazorpay || isStripe) {
    canPay = true;
  } else if (isRazorpayQr) {
    canPay = false; // Triggered automatically by QR timer auto-detection
  }

  // Build standard order DTO
  const buildOrderDto = (paymentTypeEnum, paymentTxId, paymentOrdId) => {
    return {
      customerId: selectedCustomer?.id || null,
      customer: selectedCustomer?.id
        ? {
            id: selectedCustomer.id,
            fullName: selectedCustomer.fullName || selectedCustomer.name,
            email: selectedCustomer.email,
            phone: selectedCustomer.phone,
          }
        : null,
      payment: paymentTypeEnum,
      paymentTransactionId: paymentTxId || null,
      paymentOrderId: paymentOrdId || null,
      paymentStatus: "COMPLETED",
      item: cartItems.map((item) => ({
        productId: Number(item.id),
        quantity: Number(item.quantity || 1),
        price: Number(item.price || item.sellingPrice || 0),
      })),
    };
  };

  // Process payment
  const handlePayment = async () => {
    if (isRazorpay) {
      await handleRazorpayCheckout();
      return;
    }

    if (!canPay) return;
    setIsProcessing(true);
    setFailureError(null);

    try {
      const nowTs = new Date().getTime();
      let generatedPaymentRef = "CASH-PAID";
      if (isUpi) {
        generatedPaymentRef = transactionId.trim();
      } else if (isCard) {
        generatedPaymentRef = `${cardNetwork}-${cardType}-AUTH-${cardAuthCode.trim()}${cardLast4 ? ` (x${cardLast4.trim()})` : ""}`;
      } else if (isStripe) {
        generatedPaymentRef = `pi_str_${nowTs}`;
      }

      const paymentTypeEnum =
        isUpi
          ? "UPT"
          : isCard
          ? "CARD"
          : "CASH";

      const orderDto = buildOrderDto(paymentTypeEnum, generatedPaymentRef, null);
      const savedOrder = await orderService.createOrder(orderDto);

      if (selectedCustomer?.id) {
        dispatch(
          recordCustomerOrder({
            customerId: selectedCustomer.id,
            amount: total,
          })
        );
      }

      const orderDatabaseId = savedOrder?.id || savedOrder?.orderId;

      onComplete({
        orderId: orderDatabaseId,
        transactionId: `ORD-${orderDatabaseId}`,
        paymentRef: generatedPaymentRef,
        method: paymentMethod,
        amount: total,
        subtotal,
        discount,
        tax,
        amountReceived: isCash ? numReceived : total,
        change: isCash ? change : 0,
        customer: selectedCustomer,
        items: cartItems,
        completedAt: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });
    } catch (err) {
      console.error("Order processing error", err);
      setFailureError(
        err.response?.data?.message || err.message || "Failed to submit transaction to backend."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Dedicated Razorpay Checkout Modal
  const handleRazorpayCheckout = async () => {
    setIsProcessing(true);
    setFailureError(null);

    try {
      const receiptTs = Date.now();
      const orderData = await paymentService.createRazorpayOrder({
        amount: total,
        receipt: `rcpt_${receiptTs}`,
        customer: selectedCustomer,
      });

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error(
          "Unable to load Razorpay checkout script. Please check your internet connectivity."
        );
      }

      const orderDto = buildOrderDto(
        "RAZORPAY",
        null,
        orderData.razorpayOrderId
      );

      const activeKey = rzpConfig?.keyId || orderData.keyId;
      const options = {
        key: activeKey,
        amount: orderData.amountInPaise,
        currency: orderData.currency || "INR",
        name: rzpConfig?.companyName || "ZOSH POS Retail",
        description: `POS Checkout #${receiptTs.toString().slice(-6)}`,
        order_id:
          orderData.razorpayOrderId &&
          orderData.razorpayOrderId.startsWith("order_") &&
          !orderData.razorpayOrderId.includes("test")
            ? orderData.razorpayOrderId
            : undefined,
        prefill: {
          name:
            selectedCustomer?.name ||
            selectedCustomer?.fullName ||
            "Walk-in Customer",
          email: selectedCustomer?.email || "customer@pos.local",
          contact: selectedCustomer?.phone || "9999999999",
        },
        theme: {
          color: "#174b35",
        },
        handler: async function (response) {
          try {
            setIsProcessing(true);
            const verifiedOrder = await paymentService.verifyRazorpayPayment({
              razorpayOrderId:
                response.razorpay_order_id || orderData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderDto,
            });

            if (selectedCustomer?.id) {
              dispatch(
                recordCustomerOrder({
                  customerId: selectedCustomer.id,
                  amount: total,
                })
              );
            }

            const orderDatabaseId = verifiedOrder?.id || verifiedOrder?.orderId;

            onComplete({
              orderId: orderDatabaseId,
              transactionId: `ORD-${orderDatabaseId}`,
              paymentRef: response.razorpay_payment_id,
              method: "razorpay",
              amount: total,
              subtotal,
              discount,
              tax,
              amountReceived: total,
              change: 0,
              customer: selectedCustomer,
              items: cartItems,
              completedAt: new Date().toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            });
          } catch (verifErr) {
            console.error("Signature verification error:", verifErr);
            setFailureError(
              verifErr.response?.data?.message ||
                verifErr.message ||
                "Razorpay signature verification failed."
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on("payment.failed", function (failResp) {
        setIsProcessing(false);
        setFailureError(
          failResp.error?.description ||
            failResp.error?.reason ||
            "Payment failed on Razorpay rail."
        );
      });

      rzpInstance.open();
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      setIsProcessing(false);
      setFailureError(
        err.response?.data?.message ||
          err.message ||
          "Could not open Razorpay checkout modal."
      );
    }
  };

  const handleQrPaymentSuccess = ({ paymentRef, order }) => {
    if (selectedCustomer?.id) {
      dispatch(
        recordCustomerOrder({
          customerId: selectedCustomer.id,
          amount: total,
        })
      );
    }

    const orderDatabaseId = order?.id || order?.orderId;

    onComplete({
      orderId: orderDatabaseId,
      transactionId: `ORD-${orderDatabaseId}`,
      paymentRef: paymentRef || `pay_rzp_qr_${Date.now()}`,
      method: "razorpay_qr",
      amount: total,
      subtotal,
      discount,
      tax,
      amountReceived: total,
      change: 0,
      customer: selectedCustomer,
      items: cartItems,
      completedAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
  };

  const isTestMode = rzpConfig ? rzpConfig.testMode : true;

  return (
    <div className="space-y-6">
      {/* Header and Action controls - Matches Shift Reports Design System */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Tender Checkout & Settlement
            </h1>
            <Badge variant="success">Active Terminal</Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select payment tender, capture authorization receipt, and finalize register transaction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Cart & Products</span>
          </button>
        </div>
      </div>

      {/* Gateway Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-300 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>
            <strong>Razorpay Gateway:</strong>{" "}
            <span
              className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                isTestMode
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
              }`}
            >
              {isTestMode ? "TEST MODE ACTIVE" : "LIVE PRODUCTION"}
            </span>{" "}
            • Key:{" "}
            <code className="font-mono font-semibold">
              {rzpConfig?.keyId ? `${rzpConfig.keyId.slice(0, 14)}...` : "rzp_test_..."}
            </code>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowConfigNotice((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 hover:underline"
        >
          <Info className="size-3.5" />
          <span>{showConfigNotice ? "Hide Info" : "Production Keys Info"}</span>
        </button>
      </div>

      {showConfigNotice && (
        <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
          <strong className="block font-bold">Production Keys Setup:</strong>
          <p>Configure live API credentials in <code>zosh-pos-system/.env</code>:</p>
          <code className="block bg-white dark:bg-gray-900 p-2 rounded-xl border border-blue-200 dark:border-blue-700 font-mono text-[11px]">
            RAZORPAY_KEY_ID=rzp_live_your_actual_key_id<br />
            RAZORPAY_KEY_SECRET=your_actual_secret
          </code>
        </div>
      )}

      {failureError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="size-4.5 text-rose-600 shrink-0" />
            <span>{failureError}</span>
          </div>
          <button
            type="button"
            onClick={() => setFailureError(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Two-Column Tender Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Payment Tenders & Capture Inputs */}
        <div className="lg:col-span-7 xl:col-span-8 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Select Payment Tender
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose the customer's tender method to capture transaction details
            </p>
          </div>

          {/* Tender Tabs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: "cash", label: "Cash", sub: "Physical Currency", icon: Banknote },
              { id: "card", label: "Card", sub: "Terminal Slip Auth", icon: CreditCard },
              { id: "razorpay", label: "Razorpay", sub: "All Online Rails", icon: Zap, iconColor: "text-blue-600" },
              { id: "razorpay_qr", label: "QR Timer", sub: "Dynamic UPI QR", icon: QrCode, iconColor: "text-emerald-600" },
              { id: "upi", label: "UPI (UTR)", sub: "12-Digit Reference", icon: Smartphone },
              { id: "stripe", label: "Stripe", sub: "Global Cards", icon: Globe, iconColor: "text-emerald-700" },
            ].map((tender) => {
              const Icon = tender.icon;
              const isSelected = paymentMethod === tender.id;
              return (
                <button
                  key={tender.id}
                  type="button"
                  onClick={() => setPaymentMethod(tender.id)}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className={`size-5 ${tender.iconColor || (isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500")}`} />
                  <strong className="text-xs font-bold block">{tender.label}</strong>
                  <span className="text-[10px] text-gray-400 block">{tender.sub}</span>
                </button>
              );
            })}
          </div>

          {/* 1. Cash Tender Details */}
          {isCash && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Amount Received from Customer (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="Enter tendered amount..."
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Fast denomination buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAmountReceived(total.toFixed(0))}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                    numReceived === total
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Exact (₹{total.toFixed(2)})
                </button>

                {[100, 500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountReceived(String(amt))}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Change calculation card */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                  numReceived >= total && amountReceived !== ""
                    ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                }`}
              >
                <div>
                  <span className="text-[11px] font-semibold block mb-0.5 opacity-80">
                    {numReceived >= total ? "Change to Return" : "Remaining Due Amount"}
                  </span>
                  <div className="text-xl font-bold font-mono">
                    ₹{numReceived >= total ? change.toFixed(2) : remainingDue.toFixed(2)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold block mb-0.5 opacity-80">
                    Tendered Amount
                  </span>
                  <div className="text-sm font-bold font-mono">
                    ₹{numReceived.toFixed(2)}
                  </div>
                </div>
              </div>

              {amountReceived !== "" && numReceived < total && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5">
                  <AlertTriangle className="size-4" />
                  <span>
                    Insufficient cash tendered. ₹{remainingDue.toFixed(2)} remaining.
                  </span>
                </p>
              )}
            </div>
          )}

          {/* 2. EDC Card Tender Details */}
          {isCard && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center gap-3.5 text-xs">
                <div className="size-11 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-800">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white block font-bold">
                    EDC Card Machine Checkout
                  </strong>
                  <span className="text-gray-400 text-[11px]">
                    Swipe / tap card on POS EDC machine and enter authorization approval code.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Card Network
                  </label>
                  <select
                    value={cardNetwork}
                    onChange={(e) => setCardNetwork(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none"
                  >
                    <option value="VISA">Visa</option>
                    <option value="MASTERCARD">Mastercard</option>
                    <option value="RUPAY">RuPay</option>
                    <option value="AMEX">American Express</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Card Type
                  </label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none"
                  >
                    <option value="DEBIT">Debit Card</option>
                    <option value="CREDIT">Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Last 4 Digits (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 4321"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Approval / Auth Code *
                  </label>
                  <input
                    type="text"
                    value={cardAuthCode}
                    onChange={(e) => setCardAuthCode(e.target.value)}
                    placeholder="e.g. APPR-192830"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Razorpay Standard Checkout */}
          {isRazorpay && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 dark:bg-blue-950/40 dark:border-blue-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      Rzp
                    </div>
                    <div>
                      <strong className="font-bold text-blue-950 dark:text-blue-100 block">
                        Razorpay Standard Checkout
                      </strong>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400">
                        Cards, UPI, NetBanking, EMI & Wallets
                      </span>
                    </div>
                  </div>
                  <Badge variant="info">Online</Badge>
                </div>

                <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 space-y-1 text-[11px]">
                  <p>Payable Total: <strong>₹{total.toFixed(2)}</strong></p>
                  <p>Customer: <strong>{selectedCustomer?.name || selectedCustomer?.fullName || "Walk-in Customer"}</strong></p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRazorpayCheckout}
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <Zap className="size-4" />
                )}
                <span>Launch Razorpay Modal (₹{total.toFixed(2)})</span>
              </button>
            </div>
          )}

          {/* 4. Razorpay Dynamic QR with Live Timer */}
          {isRazorpayQr && (
            <div className="pt-2">
              <RazorpayQrTimer
                amount={total}
                orderDto={buildOrderDto("RAZORPAY", null, null)}
                customer={selectedCustomer}
                posRef={posReceiptRef}
                onPaymentSuccess={handleQrPaymentSuccess}
                onError={(msg) => setFailureError(msg)}
              />
            </div>
          )}

          {/* 5. UPI (Manual Reference) */}
          {isUpi && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center gap-3.5 text-xs">
                <div className="size-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800">
                  <QrCode className="size-6" />
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white block font-bold">
                    Store Static QR Scan
                  </strong>
                  <span className="text-gray-400 text-[11px]">
                    Customer scans store QR code via PhonePe, GPay, Paytm or BHIM.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  12-Digit UPI UTR / Transaction Reference *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12-digit UTR from customer's screen..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 dark:text-white"
                  autoFocus
                />
                <span className="text-[11px] text-gray-400 block mt-1">
                  Found on customer payment success receipt screen.
                </span>
              </div>
            </div>
          )}

          {/* 6. Stripe Gateway */}
          {isStripe && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 dark:border-emerald-900 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <strong className="font-bold text-emerald-950 dark:text-emerald-100 block">
                      Stripe Terminal Gateway
                    </strong>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Cross-border & International Credit Cards
                    </span>
                  </div>
                </div>
                <Badge variant="success">Global</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Customer & Order Reconciliation Card */}
        <div className="lg:col-span-5 xl:col-span-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 sticky top-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Order & Customer Summary
          </h3>

          {/* Customer Summary Box */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                <User className="size-4" />
              </div>
              <div className="min-w-0">
                <strong className="font-bold text-gray-900 dark:text-white block truncate">
                  {selectedCustomer?.name || selectedCustomer?.fullName || "Walk-in Customer"}
                </strong>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block truncate">
                  {selectedCustomer?.phone || "No phone linked"}
                </span>
              </div>
            </div>

            <Badge variant="success" size="sm">
              {selectedCustomer?.id ? "Assigned" : "Walk-in"}
            </Badge>
          </div>

          {/* Purchased Items List */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block pb-1 border-b border-gray-200 dark:border-gray-700">
              Purchased Items ({cartItems.length})
            </span>

            <div className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-gray-100 dark:divide-gray-800">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-1.5 first:pt-0 flex justify-between items-center">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Qty: {item.quantity} × ₹{Number(item.price || item.sellingPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <strong className="font-mono text-gray-900 dark:text-white shrink-0">
                    ₹{((item.price || item.sellingPrice || 0) * item.quantity).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown Numbers */}
          <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Discount</span>
                <span className="font-mono">-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Tax (GST 5%)</span>
              <span className="font-mono text-gray-900 dark:text-white">₹{tax.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <span>Grand Total</span>
              <span className="font-mono text-base">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Confirm Button */}
          {!isRazorpayQr && (
            <button
              type="button"
              disabled={!canPay || isProcessing}
              onClick={handlePayment}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <CheckCircle className="size-4" />
              )}
              <span>
                {isProcessing
                  ? "Processing Tender..."
                  : isRazorpay
                  ? `Pay via Razorpay (₹${total.toFixed(2)})`
                  : `Confirm & Complete (₹${total.toFixed(2)})`}
              </span>
            </button>
          )}

          {isRazorpayQr && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-semibold block mb-0.5">Listening for Payment</span>
              When customer completes UPI payment on their mobile, this register will automatically verify and complete the order.
            </div>
          )}

          {!canPay && validationMessage && !isRazorpayQr && (
            <p className="text-xs text-rose-600 text-center">{validationMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentSection;
