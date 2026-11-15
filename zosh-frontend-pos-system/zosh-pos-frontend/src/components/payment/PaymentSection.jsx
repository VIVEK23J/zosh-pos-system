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
  Clock,
  Info,
} from "lucide-react";
import { recordCustomerOrder } from "../../store/customerSlice";
import { orderService } from "../../services/orderService";
import { paymentService, loadRazorpayScript } from "../../services/paymentService";
import { RazorpayQrTimer } from "./RazorpayQrTimer";

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

  // Real Cash state
  const [amountReceived, setAmountReceived] = useState("");

  // Real Card state (from terminal slip)
  const [cardAuthCode, setCardAuthCode] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [cardNetwork, setCardNetwork] = useState("VISA");
  const [cardType, setCardType] = useState("DEBIT");

  // Real UPI state (from customer's UPI app confirmation)
  const [transactionId, setTransactionId] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [failureError, setFailureError] = useState(null);

  // Razorpay Gateway Config
  const [rzpConfig, setRzpConfig] = useState(null);
  const [showConfigNotice, setShowConfigNotice] = useState(false);

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

  // Process and persist payment (Cash, Card, UPI, Stripe)
  const handlePayment = async () => {
    if (isRazorpay) {
      await handleRazorpayCheckout();
      return;
    }

    if (!canPay) return;
    setIsProcessing(true);
    setFailureError(null);

    try {
      let generatedPaymentRef = "CASH-PAID";
      if (isUpi) {
        generatedPaymentRef = transactionId.trim();
      } else if (isCard) {
        generatedPaymentRef = `${cardNetwork}-${cardType}-AUTH-${cardAuthCode.trim()}${cardLast4 ? ` (x${cardLast4.trim()})` : ""}`;
      } else if (isStripe) {
        generatedPaymentRef = `pi_str_${Date.now()}`;
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
      const orderData = await paymentService.createRazorpayOrder({
        amount: total,
        receipt: `rcpt_${Date.now()}`,
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
        description: `POS Checkout #${Date.now().toString().slice(-6)}`,
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

  // Callback from Dynamic QR Timer component
  const handleQrPaymentSuccess = ({ paymentRef, qrId, order }) => {
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
    <div className="payment-page">
      <div className="payment-header">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to Cart & Editing
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px", marginTop: "14px" }}>
          <div>
            <h2>Payment Checkout</h2>
            <p>Select customer payment tender, enter transaction details and process order</p>
          </div>
        </div>
      </div>

      {/* Gateway Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-300 text-xs mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-sky-600 dark:text-sky-400 shrink-0" />
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
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 underline"
        >
          <Info size={13} />
          {showConfigNotice ? "Hide Info" : "Switching to Live Keys Info"}
        </button>
      </div>

      {showConfigNotice && (
        <div className="mb-4 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
          <strong className="block font-bold mb-1">Production Keys Setup:</strong>
          <p className="mb-1.5">
            Set your production keys in <code>zosh-pos-system/.env</code>:
          </p>
          <code className="block bg-white dark:bg-gray-900 p-2 rounded border border-blue-200 dark:border-blue-700 font-mono text-[11px] mb-1.5">
            RAZORPAY_KEY_ID=rzp_live_your_actual_key_id<br />
            RAZORPAY_KEY_SECRET=your_actual_secret
          </code>
          <p className="text-[11px] text-gray-500">
            Restart the backend to automatically switch to live production payments.
          </p>
        </div>
      )}

      {failureError && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="size-5 text-red-600 shrink-0" />
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

      <div className="payment-layout">
        {/* Payment Methods & Input Section */}
        <section className="payment-method-section">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3.5">
            Select Payment Method
          </h3>

          <div
            className="payment-methods"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "10px",
            }}
          >
            {/* 1. Cash */}
            <button
              type="button"
              className={`payment-method ${paymentMethod === "cash" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("cash")}
            >
              <Banknote size={24} />
              <strong>Cash</strong>
              <span>Cash tender</span>
            </button>

            {/* 2. Card */}
            <button
              type="button"
              className={`payment-method ${paymentMethod === "card" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard size={24} />
              <strong>Card</strong>
              <span>EDC Terminal Slip</span>
            </button>

            {/* 3. Razorpay Standard Checkout */}
            <button
              type="button"
              className={`payment-method ${paymentMethod === "razorpay" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("razorpay")}
            >
              <Zap size={24} color="#0284c7" />
              <strong>Razorpay</strong>
              <span>Cards, NetBanking, UPI</span>
            </button>

            {/* 4. Razorpay Dynamic QR with Timer */}
            <button
              type="button"
              className={`payment-method ${paymentMethod === "razorpay_qr" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("razorpay_qr")}
            >
              <div className="relative">
                <QrCode size={24} color="#059669" />
                <Clock size={12} className="absolute -bottom-1 -right-1 text-emerald-600" />
              </div>
              <strong>QR Timer</strong>
              <span>Dynamic UPI QR</span>
            </button>

            {/* 5. UPI (Manual Reference) */}
            <button
              type="button"
              className={`payment-method ${paymentMethod === "upi" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("upi")}
            >
              <Smartphone size={24} />
              <strong>UPI (UTR)</strong>
              <span>12-Digit Reference</span>
            </button>

            {/* 6. Stripe */}
            <button
              type="button"
              className={`payment-method ${paymentMethod === "stripe" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("stripe")}
            >
              <Globe size={24} color="#6366f1" />
              <strong>Stripe</strong>
              <span>International Cards</span>
            </button>
          </div>

          {/* Cash Payment Details */}
          {isCash && (
            <div className="payment-input-section">
              <label>Amount Received from Customer (₹) *</label>

              <input
                type="number"
                min="0"
                step="1"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                placeholder="Enter tendered amount..."
                autoFocus
              />

              <div className="quick-amounts">
                <button
                  type="button"
                  style={{
                    background: numReceived === total ? "#174b35" : undefined,
                    color: numReceived === total ? "#fff" : undefined,
                    fontWeight: "600",
                  }}
                  onClick={() => setAmountReceived(total.toFixed(0))}
                >
                  Exact (₹{total.toFixed(2)})
                </button>

                {[100, 500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountReceived(String(amt))}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Cash Change Display */}
              <div
                className="change-display"
                style={{
                  backgroundColor: numReceived >= total && amountReceived !== "" ? "#eff7f1" : "#fef2f2",
                  border: `1px solid ${numReceived >= total && amountReceived !== "" ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                <div>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    {numReceived >= total ? "Change to Return" : "Remaining Due Amount"}
                  </span>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: numReceived >= total ? "#174b35" : "#dc2626" }}>
                    ₹{numReceived >= total ? change.toFixed(2) : remainingDue.toFixed(2)}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Tendered</span>
                  <div style={{ fontSize: "15px", fontWeight: "600" }}>
                    ₹{numReceived.toFixed(2)}
                  </div>
                </div>
              </div>

              {amountReceived !== "" && numReceived < total && (
                <p className="payment-error" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={15} />
                  Insufficient amount. Received ₹{numReceived.toFixed(2)} of ₹{total.toFixed(2)} payable.
                </p>
              )}
            </div>
          )}

          {/* Real Card Payment */}
          {isCard && (
            <div className="payment-input-section space-y-3">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <CreditCard size={28} />
                </div>
                <div>
                  <strong className="text-sm font-semibold text-gray-900 dark:text-white block">
                    EDC Card Machine Checkout
                  </strong>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Swipe or insert card in your EDC terminal and enter the approval code from the printed receipt slip.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Card Network</label>
                  <select
                    value={cardNetwork}
                    onChange={(e) => setCardNetwork(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                  >
                    <option value="VISA">Visa</option>
                    <option value="MASTERCARD">Mastercard</option>
                    <option value="RUPAY">RuPay</option>
                    <option value="AMEX">American Express</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Card Type</label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                  >
                    <option value="DEBIT">Debit Card</option>
                    <option value="CREDIT">Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Last 4 Digits (Optional)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 4321"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Approval / Auth Code *</label>
                  <input
                    type="text"
                    value={cardAuthCode}
                    onChange={(e) => setCardAuthCode(e.target.value)}
                    placeholder="e.g. APPR-192830"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Real UPI Payment */}
          {isUpi && (
            <div className="payment-input-section space-y-3">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="size-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0 p-1">
                  <QrCode size={48} className="text-emerald-800" />
                </div>

                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    Customer scans your static store QR (GPay, PhonePe, Paytm, BHIM)
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                    Payable: ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  12-Digit UPI UTR / Transaction Reference *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12-digit UTR from customer's payment screen..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 text-xs"
                  autoFocus
                />
                <span className="text-[11px] text-gray-500 block mt-1">
                  Found on customer's payment successful receipt (e.g., 429182910291)
                </span>
              </div>
            </div>
          )}

          {/* Razorpay Standard Checkout */}
          {isRazorpay && (
            <div className="payment-input-section">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 dark:bg-blue-950/40 dark:border-blue-900 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      Rzp
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-950 dark:text-blue-100">
                        Razorpay Standard Checkout
                      </h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Credit/Debit Cards, UPI Apps, NetBanking, EMI & Wallets
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isTestMode
                        ? "text-amber-800 bg-amber-100"
                        : "text-emerald-800 bg-emerald-100"
                    }`}
                  >
                    {isTestMode ? "Test Keys Active" : "Production Ready"}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-200/60 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <div>
                    <strong>Customer:</strong>{" "}
                    {selectedCustomer?.name || selectedCustomer?.fullName || "Walk-in Customer"}{" "}
                    {selectedCustomer?.phone ? `(${selectedCustomer.phone})` : ""}
                  </div>
                  <div>
                    <strong>Payable Total:</strong> ₹{total.toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRazorpayCheckout}
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <Zap size={18} />
                )}
                <span>Launch Razorpay Checkout (₹{total.toFixed(2)})</span>
              </button>
            </div>
          )}

          {/* Razorpay Dynamic QR with Live Timer */}
          {isRazorpayQr && (
            <div className="payment-input-section">
              <RazorpayQrTimer
                amount={total}
                orderDto={buildOrderDto("RAZORPAY", null, null)}
                customer={selectedCustomer}
                posRef={`RCPT-${Date.now()}`}
                onPaymentSuccess={handleQrPaymentSuccess}
                onError={(msg) => setFailureError(msg)}
              />
            </div>
          )}

          {/* Stripe Gateway */}
          {isStripe && (
            <div className="payment-input-section">
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-900 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    S
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-100">
                      Stripe Terminal
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">
                      International Cards & Cross-border Payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Order & Customer Summary Section */}
        <section className="payment-summary">
          <h3>Order & Customer Summary</h3>

          <div className="payment-customer">
            <span>Customer</span>
            <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <User size={14} color="#174b35" />
              {selectedCustomer?.name || selectedCustomer?.fullName || "Walk-in Customer"}
            </strong>
          </div>

          {selectedCustomer?.phone && (
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "-10px", marginBottom: "14px", textAlign: "right" }}>
              Phone: {selectedCustomer.phone}
            </div>
          )}

          <div className="payment-products">
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "8px" }}>
              Purchased Items ({cartItems.length})
            </span>
            {cartItems.map((item) => (
              <div className="payment-product" key={item.id}>
                <span>
                  {item.name} × <strong>{item.quantity}</strong>
                </span>
                <strong>₹{((item.price || item.sellingPrice || 0) * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Discount Applied</span>
            <span style={{ color: discount > 0 ? "#16a34a" : "inherit" }}>
              -₹{discount.toFixed(2)}
            </span>
          </div>

          <div className="summary-row">
            <span>Tax (5% GST)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="payment-total">
            <span>Grand Total Payable</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>

          {/* Confirm Button for Cash, Card, UPI, Stripe, Razorpay */}
          {!isRazorpayQr && (
            <button
              type="button"
              className="confirm-payment-btn"
              disabled={!canPay || isProcessing}
              onClick={handlePayment}
              style={{
                marginTop: "20px",
                opacity: canPay && !isProcessing ? 1 : 0.45,
                cursor: canPay && !isProcessing ? "pointer" : "not-allowed",
              }}
            >
              {isProcessing ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <CheckCircle size={19} />
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
            <div className="mt-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-semibold block mb-0.5">Listening for Payment</span>
              When customer completes UPI payment on their mobile, this register will automatically verify and complete the order.
            </div>
          )}

          {!canPay && validationMessage && !isRazorpayQr && (
            <p style={{ color: "#dc2626", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
              {validationMessage}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default PaymentSection;
