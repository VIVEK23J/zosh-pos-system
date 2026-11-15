import api from "./api";
import { mockRefunds } from "./mockData";

export const normalizeRefund = (r) => {
  if (!r) return r;
  return {
    ...r,
    id: r.id,
    orderId: r.orderId || r.order?.id || 1001,
    amount: Number(r.amount || 0),
    reason: r.reason || "Customer return",
    customerName: r.customerName || r.order?.customer?.fullName || "Customer",
    cashierName: r.cashierName || r.cashier?.fullName || "Vivek Sharma",
    branchId: r.branchId || r.branch?.id || 1,
    status: r.status || "APPROVED",
    createdAt: r.createdAt || new Date().toISOString(),
  };
};

export const refundService = {
  createRefund: async (refundData) => {
    const payload = {
      orderId: Number(refundData.orderId),
      amount: Number(refundData.amount),
      reason: refundData.reason,
    };
    try {
      const res = await api.post("/api/refunds", payload);
      return normalizeRefund(res.data);
    } catch {
      const newRefund = normalizeRefund({
        ...refundData,
        id: Math.floor(500 + Math.random() * 500),
        status: "APPROVED",
        createdAt: new Date().toISOString(),
      });
      mockRefunds.unshift(newRefund);
      return newRefund;
    }
  },

  getAllRefunds: async () => {
    try {
      const res = await api.get("/api/refunds");
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeRefund);
      }
      return mockRefunds.map(normalizeRefund);
    } catch {
      return mockRefunds.map(normalizeRefund);
    }
  },

  getRefundsByBranch: async (branchId = 1) => {
    try {
      const res = await api.get(`/api/refunds/branchId/${branchId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeRefund);
      }
      return mockRefunds.filter((r) => r.branchId === Number(branchId)).map(normalizeRefund);
    } catch {
      return mockRefunds.filter((r) => r.branchId === Number(branchId)).map(normalizeRefund);
    }
  },

  deleteRefund: async (refundId) => {
    try {
      const res = await api.delete(`/api/refunds/${refundId}`);
      return res.data;
    } catch {
      const idx = mockRefunds.findIndex((r) => r.id === Number(refundId));
      if (idx !== -1) mockRefunds.splice(idx, 1);
      return { message: "Refund deleted" };
    }
  },
};

export default refundService;
