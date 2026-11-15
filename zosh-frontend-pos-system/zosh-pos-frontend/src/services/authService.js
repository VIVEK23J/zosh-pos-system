import api from "./api";
import { ROLES, normalizeRole } from "../constants/roles";

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const data = response.data;
    // Normalize user object from backend
    if (data && data.user) {
      data.user = {
        ...data.user,
        role: normalizeRole(data.user.role),
        storeId: data.user.storeId || 1,
        branchId: data.user.branchId || 1,
      };
    }
    return data;
  },

  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    const data = response.data;
    if (data && data.user) {
      data.user = {
        ...data.user,
        role: normalizeRole(data.user.role),
        storeId: data.user.storeId || 1,
        branchId: data.user.branchId || 1,
      };
    }
    return data;
  },

  getProfile: async () => {
    try {
      const response = await api.get("/api/users/profile");
      const user = response.data;
      if (user) {
        return {
          ...user,
          role: normalizeRole(user.role),
          storeId: user.storeId || 1,
          branchId: user.branchId || 1,
        };
      }
      return user;
    } catch (err) {
      const saved = localStorage.getItem("pos_user");
      return saved ? JSON.parse(saved) : null;
    }
  },
};

export default authService;
