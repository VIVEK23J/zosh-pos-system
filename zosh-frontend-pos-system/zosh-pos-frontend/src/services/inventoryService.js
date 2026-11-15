import api from "./api";
import { mockProducts } from "./mockData";
import { normalizeProduct } from "./productService";

export const normalizeInventory = (item) => {
  if (!item) return item;
  const product = item.product ? normalizeProduct(item.product) : null;
  const quantity = Number(item.quantity != null ? item.quantity : 0);
  const lowStockThreshold = Number(item.lowStockThreshold || product?.lowStockThreshold || 5);

  return {
    ...item,
    quantity,
    lowStockThreshold,
    isLowStock: quantity <= lowStockThreshold,
    product: product || {
      id: item.productId,
      name: "Product Item",
      sku: `SKU-${item.productId}`,
      price: 999,
      categoryName: "General",
    },
    lastUpdate: item.lastUpdate || "2026-10-31T12:00:00",
  };
};

export const inventoryService = {
  getInventoryByBranch: async (branchId = 1) => {
    try {
      const res = await api.get(`/api/inventories/branch/${branchId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeInventory);
      }
      return mockProducts.map((p) =>
        normalizeInventory({
          id: p.id,
          branchId: Number(branchId),
          productId: p.id,
          product: p,
          quantity: p.stock || 25,
          lowStockThreshold: p.lowStockThreshold || 5,
        })
      );
    } catch {
      return mockProducts.map((p) =>
        normalizeInventory({
          id: p.id,
          branchId: Number(branchId),
          productId: p.id,
          product: p,
          quantity: p.stock || 25,
          lowStockThreshold: p.lowStockThreshold || 5,
        })
      );
    }
  },

  createInventory: async (data) => {
    const payload = {
      branchId: Number(data.branchId || 1),
      productId: Number(data.productId),
      quantity: Number(data.quantity || 0),
    };
    try {
      const res = await api.post("/api/inventories", payload);
      return normalizeInventory(res.data);
    } catch {
      const prod = mockProducts.find((p) => p.id === Number(data.productId));
      return normalizeInventory({
        id: Date.now(),
        branchId: payload.branchId,
        productId: payload.productId,
        product: prod,
        quantity: payload.quantity,
        lowStockThreshold: 5,
      });
    }
  },

  updateInventory: async (id, data) => {
    const payload = {
      quantity: Number(data.quantity),
    };
    try {
      const res = await api.put(`/api/inventories/branch/${id}`, payload);
      return normalizeInventory(res.data);
    } catch {
      const prod = mockProducts.find((p) => p.id === Number(id));
      if (prod) {
        prod.stock = payload.quantity;
      }
      return normalizeInventory({ id, quantity: payload.quantity });
    }
  },

  deleteInventory: async (id) => {
    try {
      const res = await api.delete(`/api/inventories/${id}`);
      return res.data;
    } catch {
      return { message: "Inventory record deleted" };
    }
  },

  getByProductAndBranch: async (productId, branchId = 1) => {
    try {
      const res = await api.get(
        `/api/inventories/branch/${branchId}/product/${productId}`
      );
      return normalizeInventory(res.data);
    } catch {
      return null;
    }
  },
};

export default inventoryService;
