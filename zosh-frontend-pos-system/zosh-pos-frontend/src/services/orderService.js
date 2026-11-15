import api from "./api";

export const normalizeOrder = (o) => {
  if (!o) return o;
  const items = o.items || (o.item ? o.item.map((i) => ({
    id: i.id,
    productId: i.productId || i.product?.id,
    name: i.product?.name || i.name || "Item",
    price: i.price != null ? Number(i.price) : Number(i.product?.sellingPrice || 0),
    quantity: Number(i.quantity || 1),
  })) : []);

  const orderId = o.id || o.orderId;

  return {
    ...o,
    id: orderId,
    orderId: orderId,
    totalAmount: Number(o.totalAmount || 0),
    createdAt: o.createdAt || new Date().toISOString(),
    customerName: o.customer?.fullName || o.customerName || "Walk-in Customer",
    customerPhone: o.customer?.phone || o.customerPhone || "",
    payment: o.payment || "CASH",
    paymentTransactionId: o.paymentTransactionId || "",
    paymentOrderId: o.paymentOrderId || "",
    paymentStatus: o.paymentStatus || "COMPLETED",
    status: o.status || "COMPLETED",
    items,
    item: items,
  };
};

export const orderService = {
  createOrder: async (orderDto) => {
    const payload = {
      customerId: orderDto.customerId || null,
      customer: orderDto.customer || null,
      payment: orderDto.payment || "CASH",
      paymentTransactionId: orderDto.paymentTransactionId || null,
      paymentOrderId: orderDto.paymentOrderId || null,
      paymentStatus: orderDto.paymentStatus || "COMPLETED",
      item: (orderDto.item || orderDto.items || []).map((i) => ({
        productId: Number(i.productId || i.id),
        quantity: Number(i.quantity || 1),
        price: Number(i.price || 0),
      })),
    };

    const res = await api.post("/api/orders", payload);
    return normalizeOrder(res.data);
  },

  getAllOrders: async () => {
    try {
      const res = await api.get("/api/orders");
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeOrder);
      }
      return [];
    } catch (err) {
      console.error("Failed to load orders from API:", err);
      return [];
    }
  },

  getOrderById: async (id) => {
    const res = await api.get(`/api/orders/${id}`);
    return normalizeOrder(res.data);
  },

  getOrdersByBranch: async (branchId = 1, filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const url = params
        ? `/api/orders/branch/${branchId}?${params}`
        : `/api/orders/branch/${branchId}`;
      const res = await api.get(url);
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeOrder);
      }
      return [];
    } catch {
      // Fallback to universal endpoint
      try {
        const resAll = await api.get("/api/orders");
        if (Array.isArray(resAll.data)) {
          return resAll.data.map(normalizeOrder);
        }
      } catch (err) {
        console.error("Failed to retrieve orders:", err);
      }
      return [];
    }
  },

  getTodayOrdersByBranch: async (branchId = 1) => {
    try {
      const res = await api.get(`/api/orders/today/branch/${branchId}`);
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeOrder);
      }
      return [];
    } catch {
      return [];
    }
  },

  getOrdersByCashier: async (cashierId = 1) => {
    try {
      const res = await api.get(`/api/orders/cashier/${cashierId}`);
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeOrder);
      }
      return [];
    } catch {
      return [];
    }
  },

  deleteOrder: async (id) => {
    await api.delete(`/api/orders/${id}`);
    return true;
  },
};

export default orderService;
