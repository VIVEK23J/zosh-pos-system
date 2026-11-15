import api from "./api";
import { mockCategories } from "./mockData";

export const normalizeCategory = (c) => {
  if (!c) return c;
  return {
    ...c,
    name: c.categoryName || c.name || "General",
    categoryName: c.categoryName || c.name || "General",
    productCount: c.productCount || 0,
    storeId: c.storeId || 1,
  };
};

export const categoryService = {
  getCategoriesByStore: async (storeId = 1) => {
    try {
      const res = await api.get(`/api/categories/store/${storeId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeCategory);
      }
      return mockCategories.map(normalizeCategory);
    } catch {
      return mockCategories.map(normalizeCategory);
    }
  },

  createCategory: async (data) => {
    const payload = {
      categoryName: data.categoryName || data.name,
      storeId: Number(data.storeId || 1),
    };
    try {
      const res = await api.post("/api/categories", payload);
      return normalizeCategory(res.data);
    } catch {
      const newCat = normalizeCategory({
        ...payload,
        id: Date.now(),
        productCount: 0,
      });
      mockCategories.push(newCat);
      return newCat;
    }
  },

  updateCategory: async (id, data) => {
    const payload = {
      categoryName: data.categoryName || data.name,
      storeId: Number(data.storeId || 1),
    };
    try {
      const res = await api.put(`/api/categories/${id}`, payload);
      return normalizeCategory(res.data);
    } catch {
      const idx = mockCategories.findIndex((c) => c.id === Number(id));
      if (idx !== -1) {
        mockCategories[idx] = normalizeCategory({ ...mockCategories[idx], ...data });
        return mockCategories[idx];
      }
      return normalizeCategory(data);
    }
  },

  deleteCategory: async (id) => {
    try {
      const res = await api.delete(`/api/categories/${id}`);
      return res.data;
    } catch {
      const idx = mockCategories.findIndex((c) => c.id === Number(id));
      if (idx !== -1) mockCategories.splice(idx, 1);
      return { message: "Category deleted" };
    }
  },
};

export default categoryService;
