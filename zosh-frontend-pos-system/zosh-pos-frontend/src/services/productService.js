import api from "./api";

export const normalizeProduct = (p) => {
  if (!p) return p;
  const priceVal =
    p.sellingPrice != null
      ? Number(p.sellingPrice)
      : p.price != null
      ? Number(p.price)
      : Number(p.mrp || 0);

  return {
    ...p,
    id: p.id,
    price: priceVal,
    sellingPrice: priceVal,
    mrp: p.mrp != null ? Number(p.mrp) : priceVal,
    brand: p.brand || "Standard",
    categoryName: p.category?.categoryName || p.categoryName || "General",
    categoryId: p.categoryId || p.category?.id || 1,
    stock: p.stock != null ? Number(p.stock) : 25,
    lowStockThreshold: p.lowStockThreshold != null ? Number(p.lowStockThreshold) : 5,
    status: p.status || "ACTIVE",
    image:
      p.image ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=70",
  };
};

export const productService = {
  getProductsByStore: async (storeId = 1) => {
    try {
      const res = await api.get(`/api/products/store/${storeId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeProduct);
      }
    } catch {
      // Try universal endpoint
    }

    try {
      const resAll = await api.get("/api/products");
      if (Array.isArray(resAll.data) && resAll.data.length > 0) {
        return resAll.data.map(normalizeProduct);
      }
    } catch (err) {
      console.error("Failed to load products from server:", err);
    }

    return [];
  },

  searchProducts: async (keyword, storeId = 1) => {
    try {
      const res = await api.get(
        `/api/products/search?keyword=${encodeURIComponent(keyword)}&storeId=${storeId}`
      );
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeProduct);
      }
    } catch {
      // Fallback to local filter of products
    }

    const all = await productService.getProductsByStore(storeId);
    const q = keyword.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
    );
  },

  createProduct: async (data) => {
    const payload = {
      name: data.name,
      description: data.description || "",
      sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
      brand: data.brand || "General",
      sellingPrice: Number(data.price || data.sellingPrice || 0),
      mrp: Number(data.mrp || data.price || 0),
      image: data.image || "",
      categoryId: Number(data.categoryId || 1),
      storeId: Number(data.storeId || 1),
    };

    const res = await api.post("/api/products", payload);
    return normalizeProduct(res.data);
  },

  updateProduct: async (id, data) => {
    const payload = {
      name: data.name,
      description: data.description || "",
      sku: data.sku,
      brand: data.brand,
      sellingPrice: Number(data.price || data.sellingPrice || 0),
      mrp: Number(data.mrp || data.price || 0),
      image: data.image,
      categoryId: Number(data.categoryId || 1),
    };

    const res = await api.put(`/api/products/${id}`, payload);
    return normalizeProduct(res.data);
  },

  deleteProduct: async (id) => {
    await api.delete(`/api/products/${id}`);
    return true;
  },
};

export default productService;
