import api from "./api";
import { mockBranches } from "./mockData";

export const normalizeBranch = (b) => {
  if (!b) return b;
  let opHours = b.operatingHours;
  if (!opHours && (b.openingTime || b.closingTime)) {
    opHours = `${b.openingTime || "09:00"} - ${b.closingTime || "22:00"}`;
  }

  return {
    ...b,
    id: b.id,
    storeId: b.storeId || 1,
    name: b.name || "Branch Store",
    address: b.address || "Main Market",
    phone: b.phone || "0124-4598201",
    email: b.email || "branch@zoshpos.com",
    operatingHours: opHours || "09:00 AM - 10:00 PM",
    openingTime: b.openingTime || "09:00:00",
    closingTime: b.closingTime || "22:00:00",
    managerName: b.manager?.fullName || b.managerName || "Branch Manager",
    status: b.status || "ACTIVE",
  };
};

export const branchService = {
  getBranchesByStore: async (storeId = 1) => {
    try {
      const res = await api.get(`/api/branches/store/${storeId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeBranch);
      }
      return mockBranches.map(normalizeBranch);
    } catch {
      return mockBranches.filter((b) => b.storeId === Number(storeId)).map(normalizeBranch);
    }
  },

  getBranchById: async (id) => {
    try {
      const res = await api.get(`/api/branches/${id}`);
      return normalizeBranch(res.data);
    } catch {
      const found = mockBranches.find((b) => b.id === Number(id)) || mockBranches[0];
      return normalizeBranch(found);
    }
  },

  createBranch: async (data) => {
    const payload = {
      name: data.name,
      address: data.address,
      phone: data.phone || "0124-4598200",
      email: data.email || "branch@example.com",
      openingTime: data.openingTime || "09:00:00",
      closingTime: data.closingTime || "22:00:00",
      workingDays: data.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      storeId: Number(data.storeId || 1),
    };
    try {
      const res = await api.post("/api/branches", payload);
      return normalizeBranch(res.data);
    } catch {
      const newBranch = normalizeBranch({ ...payload, ...data, id: Date.now(), status: "ACTIVE" });
      mockBranches.push(newBranch);
      return newBranch;
    }
  },

  updateBranch: async (id, data) => {
    const payload = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email || "branch@example.com",
      openingTime: data.openingTime || "09:00:00",
      closingTime: data.closingTime || "22:00:00",
      workingDays: data.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    };
    try {
      const res = await api.put(`/api/branches/${id}`, payload);
      return normalizeBranch(res.data);
    } catch {
      const idx = mockBranches.findIndex((b) => b.id === Number(id));
      if (idx !== -1) {
        mockBranches[idx] = normalizeBranch({ ...mockBranches[idx], ...data });
        return mockBranches[idx];
      }
      return normalizeBranch(data);
    }
  },

  deleteBranch: async (id) => {
    try {
      const res = await api.delete(`/api/branches/${id}`);
      return res.data;
    } catch {
      const idx = mockBranches.findIndex((b) => b.id === Number(id));
      if (idx !== -1) mockBranches.splice(idx, 1);
      return { message: "Branch deleted" };
    }
  },
};

export default branchService;
