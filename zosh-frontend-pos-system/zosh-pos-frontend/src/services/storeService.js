import api from "./api";
import { mockStores } from "./mockData";

export const normalizeStore = (s) => {
  if (!s) return s;
  const email = s.contact?.email || s.email || "contact@zoshretail.com";
  const phone = s.contact?.phone || s.phone || "0124-4598200";
  const address = s.contact?.address || s.address || "DLF Cyber City, Gurugram, Haryana";

  return {
    ...s,
    id: s.id,
    brand: s.brand || "Zosh Retail Store",
    description: s.description || "Flagship Retail & Electronics Store",
    storeStatus: s.storeStatus || "ACTIVE",
    email,
    phone,
    address,
    contact: {
      address,
      email,
      phone,
    },
    subscriptionPlan: s.subscriptionPlan || "Enterprise Pro",
    createdAt: s.createdDate || s.createdAt || "2026-01-15T10:00:00",
  };
};

export const storeService = {
  getStoreByAdmin: async () => {
    try {
      const res = await api.get("/api/store/admin");
      return normalizeStore(res.data);
    } catch {
      return normalizeStore(mockStores[0]);
    }
  },

  getStoreById: async (id) => {
    try {
      const res = await api.get(`/api/store/${id}`);
      return normalizeStore(res.data);
    } catch {
      const found = mockStores.find((s) => s.id === Number(id)) || mockStores[0];
      return normalizeStore(found);
    }
  },

  getAllStores: async () => {
    try {
      const res = await api.get("/api/store/stores");
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeStore);
      }
      return mockStores.map(normalizeStore);
    } catch {
      return mockStores.map(normalizeStore);
    }
  },

  createStore: async (data) => {
    const payload = {
      brand: data.brand,
      description: data.description || "",
      storeType: data.storeType || "Retail POS",
      contact: {
        address: data.address || data.contact?.address || "",
        email: data.email || data.contact?.email || "",
        phone: data.phone || data.contact?.phone || "",
      },
    };
    try {
      const res = await api.post("/api/store", payload);
      return normalizeStore(res.data);
    } catch {
      const newStore = normalizeStore({ ...data, id: Date.now(), storeStatus: "PENDING" });
      mockStores.push(newStore);
      return newStore;
    }
  },

  updateStore: async (id, data) => {
    const payload = {
      brand: data.brand,
      description: data.description || "",
      storeType: data.storeType || "Retail POS",
      contact: {
        address: data.corporateAddress || data.address || data.contact?.address || "",
        email: data.email || data.contact?.email || "",
        phone: data.phone || data.contact?.phone || "",
      },
    };
    try {
      const res = await api.put(`/api/store/${id}`, payload);
      return normalizeStore(res.data);
    } catch {
      const idx = mockStores.findIndex((s) => s.id === Number(id));
      if (idx !== -1) {
        mockStores[idx] = normalizeStore({ ...mockStores[idx], ...data });
        return mockStores[idx];
      }
      return normalizeStore(data);
    }
  },

  moderateStore: async (id, status) => {
    // Map status to backend StoreStatus enum: ACTIVE | PENDING | BLOCKED
    let backendStatus = status;
    if (status === "REJECTED" || status === "SUSPENDED") {
      backendStatus = "BLOCKED";
    }

    try {
      const res = await api.put(`/api/store/${id}/moderate?status=${backendStatus}`);
      return normalizeStore(res.data);
    } catch {
      const store = mockStores.find((s) => s.id === Number(id));
      if (store) store.storeStatus = status;
      return store ? normalizeStore(store) : null;
    }
  },

  deleteStore: async (id) => {
    try {
      const res = await api.delete(`/api/store/${id}`);
      return res.data;
    } catch {
      const idx = mockStores.findIndex((s) => s.id === Number(id));
      if (idx !== -1) mockStores.splice(idx, 1);
      return { message: "Store deleted" };
    }
  },
};

export default storeService;
