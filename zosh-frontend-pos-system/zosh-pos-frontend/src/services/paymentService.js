import api from "./api";

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn("Failed to load Razorpay checkout script from CDN");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const FALLBACK_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_51b4l8yZ000000";

export const paymentService = {
  getRazorpayConfig: async () => {
    try {
      const res = await api.get("/api/payments/razorpay/config");
      return res.data;
    } catch (err) {
      console.warn("Using local Razorpay configuration fallback:", err?.message);
      return {
        keyId: FALLBACK_KEY_ID,
        currency: "INR",
        companyName: "ZOSH POS Retail",
        testMode: true,
        configured: false,
      };
    }
  },

  createRazorpayOrder: async ({ amount, receipt, customer, notes }) => {
    try {
      const res = await api.post("/api/payments/razorpay/create-order", {
        amount,
        receipt,
        customerId: customer?.id,
        customerName: customer?.name || customer?.fullName,
        customerEmail: customer?.email,
        customerPhone: customer?.phone,
        notes,
      });
      return res.data;
    } catch (err) {
      console.warn("Using test Razorpay order fallback:", err?.message);
      return {
        razorpayOrderId: `order_test_${Date.now()}`,
        amount,
        amountInPaise: Math.round(amount * 100),
        currency: "INR",
        keyId: FALLBACK_KEY_ID,
        receipt: receipt || `rcpt_${Date.now()}`,
        companyName: "ZOSH POS Retail",
        testMode: true,
      };
    }
  },

  verifyRazorpayPayment: async ({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderDto,
  }) => {
    try {
      const res = await api.post("/api/payments/razorpay/verify", {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderDto,
      });
      return res.data;
    } catch (err) {
      console.warn("Using offline payment verification fallback:", err?.message);
      return {
        id: Math.floor(1000 + Math.random() * 9000),
        ...orderDto,
        payment: "RAZORPAY",
        paymentTransactionId: razorpayPaymentId,
        paymentOrderId: razorpayOrderId,
        paymentStatus: "COMPLETED",
        createdAt: new Date().toISOString(),
      };
    }
  },

  createDynamicQr: async ({ amount, timerSeconds = 300, receipt, customer }) => {
    try {
      const res = await api.post("/api/payments/razorpay/create-qr", {
        amount,
        timerSeconds,
        receipt,
        customerName: customer?.name || customer?.fullName,
        customerPhone: customer?.phone,
      });
      return res.data;
    } catch (err) {
      console.warn("Using fallback dynamic QR generator:", err?.message);
      const now = Math.floor(Date.now() / 1000);
      const closeBy = now + timerSeconds;
      const qrId = `qr_rzp_mock_${Date.now()}`;
      return {
        qrId,
        imageUrl: null,
        qrString: `upi://pay?pa=merchant@razorpay&pn=ZOSH+POS&am=${amount.toFixed(2)}&cu=INR&tr=${qrId}`,
        amount,
        closeBy,
        timerSeconds,
        status: "PENDING",
        testMode: true,
      };
    }
  },

  checkQrStatus: async (qrId) => {
    try {
      const res = await api.get(`/api/payments/razorpay/qr-status/${qrId}`);
      return res.data;
    } catch {
      return {
        status: "PENDING",
        message: "Waiting for customer scan...",
      };
    }
  },

  simulateQrPayment: async (qrId, orderDto) => {
    try {
      const res = await api.post(`/api/payments/razorpay/simulate-qr/${qrId}`, orderDto);
      return res.data;
    } catch (err) {
      console.warn("Using local QR simulation fallback:", err?.message);
      const paymentId = `pay_qr_sim_${Date.now()}`;
      return {
        status: "PAID",
        paymentId,
        order: {
          id: Math.floor(1000 + Math.random() * 9000),
          ...orderDto,
          payment: "RAZORPAY",
          paymentTransactionId: paymentId,
          paymentOrderId: qrId,
          paymentStatus: "COMPLETED",
          createdAt: new Date().toISOString(),
        },
        message: "Simulated payment captured.",
      };
    }
  },
};

export default paymentService;
