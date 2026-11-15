import api from "./api";
import { mockCurrentShift } from "./mockData";

export const normalizeShift = (s) => {
  if (!s) return s;
  const isClosed = Boolean(s.shiftEnd || s.status === "CLOSED");
  return {
    ...s,
    id: s.id,
    status: isClosed ? "CLOSED" : "OPEN",
    cashierName: s.cashier?.fullName || s.cashierName || "Vivek Sharma",
    shiftStartTime: s.shiftStart || s.shiftStartTime || "2026-10-31T09:00:00",
    shiftEndTime: s.shiftEnd || s.shiftEndTime || (isClosed ? "2026-10-31T21:00:00" : null),
    openingCash: Number(s.openingCash || 5000),
    closingCash: Number(s.closingCash || s.totalSales || 0),
    totalSales: Number(s.totalSales || 0),
    totalRefunds: Number(s.totalRefunds || 0),
    netSales: Number(s.netSales != null ? s.netSales : (s.totalSales || 0) - (s.totalRefunds || 0)),
    totalOrders: Number(s.totalOrders || 0),
    paymentSummary: s.paymentSummary || [
      { paymentType: "CASH", totalAmount: (s.totalSales || 0) * 0.4, percentage: 40 },
      { paymentType: "CARD", totalAmount: (s.totalSales || 0) * 0.35, percentage: 35 },
      { paymentType: "UPT", totalAmount: (s.totalSales || 0) * 0.25, percentage: 25 },
    ],
    topSellingProducts: s.topSellingProducts || [],
    recentOrders: s.recentOrders || [],
  };
};

export const shiftReportService = {
  startShift: async (openingCash = 5000) => {
    try {
      const res = await api.post("/api/shiftReport/start", { openingCash });
      return normalizeShift({ ...res.data, openingCash });
    } catch {
      mockCurrentShift.status = "OPEN";
      mockCurrentShift.shiftStartTime = new Date().toISOString();
      mockCurrentShift.openingCash = Number(openingCash) || 5000;
      return normalizeShift(mockCurrentShift);
    }
  },

  endShift: async (closingCash, shiftReportId) => {
    try {
      const url = shiftReportId ? `/api/shiftReport/end?shiftReportId=${shiftReportId}` : `/api/shiftReport/end`;
      const res = await api.patch(url, { closingCash });
      return normalizeShift({ ...res.data, closingCash });
    } catch {
      mockCurrentShift.status = "CLOSED";
      mockCurrentShift.shiftEndTime = new Date().toISOString();
      mockCurrentShift.closingCash = Number(closingCash) || mockCurrentShift.totalSales;
      return normalizeShift(mockCurrentShift);
    }
  },

  getCurrentShift: async () => {
    try {
      const res = await api.get("/api/shiftReport/current");
      return normalizeShift(res.data);
    } catch {
      return normalizeShift(mockCurrentShift);
    }
  },

  getShiftReportsByBranch: async (branchId = 1) => {
    try {
      const res = await api.get(`/api/shiftReport/branch/${branchId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeShift);
      }
      return [normalizeShift(mockCurrentShift)];
    } catch {
      return [normalizeShift(mockCurrentShift)];
    }
  },

  getShiftReportsByCashier: async (cashierId = 1) => {
    try {
      const res = await api.get(`/api/shiftReport/cashier/${cashierId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeShift);
      }
      return [normalizeShift(mockCurrentShift)];
    } catch {
      return [normalizeShift(mockCurrentShift)];
    }
  },
};

export default shiftReportService;
