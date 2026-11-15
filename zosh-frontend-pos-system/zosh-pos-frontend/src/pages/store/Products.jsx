import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Barcode,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../components/common/Toast";

export function Products() {
  const toast = useToast();
  const currentStore = useSelector((state) => state.auth.currentStore);
  const storeId = currentStore?.id || 1;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    brand: "General",
    image: "",
    sku: "",
    barcode: "",
    categoryId: 1,
    categoryName: "Audio & Sound",
    stock: 20,
    lowStockThreshold: 5,
    status: "ACTIVE",
  });

  useEffect(() => {
    loadData();
  }, [storeId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProductsByStore(storeId),
        categoryService.getCategoriesByStore(storeId),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=70",
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      categoryId: categories[0]?.id || 1,
      categoryName: categories[0]?.name || "General",
      stock: 20,
      lowStockThreshold: 5,
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || "",
      description: prod.description || "",
      price: String(prod.price || ""),
      image: prod.image || "",
      sku: prod.sku || "",
      barcode: prod.barcode || "",
      categoryId: prod.categoryId || 1,
      categoryName: prod.categoryName || "General",
      stock: prod.stock || 0,
      lowStockThreshold: prod.lowStockThreshold || 5,
      status: prod.status || "ACTIVE",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCat = categories.find((c) => c.id === Number(formData.categoryId));
      const priceNum = Number(formData.price || 0);
      const payload = {
        ...formData,
        price: priceNum,
        sellingPrice: priceNum,
        mrp: priceNum,
        brand: formData.brand || "General",
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        categoryName: selectedCat ? selectedCat.name : formData.categoryName,
        storeId,
      };

      if (editingProduct) {
        const updated = await productService.updateProduct(editingProduct.id, payload);
        setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p)));
        toast.success("Product Updated", `${payload.name} was updated successfully.`);
      } else {
        const created = await productService.createProduct(payload);
        setProducts([created, ...products]);
        toast.success("Product Added", `${payload.name} was added to master catalog.`);
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "Could not save product");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await productService.deleteProduct(deleteTarget.id);
      setProducts(products.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Product Deleted", "Item removed from master catalog.");
    } catch {
      toast.error("Error", "Could not delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.includes(q));

    const matchesCategory =
      selectedCategory === "ALL" || String(p.categoryId) === String(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Master Product Catalog & SKUs
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Configure enterprise product prices, barcodes, Cloudinary imagery, and category tagging
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
        >
          <Plus className="size-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-sm w-full sm:w-80">
          <Search className="size-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title, SKU, or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs outline-none text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 font-semibold">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Product & SKU</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Barcode / EAN</th>
                  <th className="px-5 py-3.5">Unit Retail Price</th>
                  <th className="px-5 py-3.5">Master Stock</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="size-10 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 border shrink-0"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block text-sm">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {p.categoryName || "General"}
                    </td>

                    <td className="px-5 py-4 font-mono text-gray-500">
                      {p.barcode || "—"}
                    </td>

                    <td className="px-5 py-4 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      ₹{p.price.toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`font-semibold ${
                          p.stock <= (p.lowStockThreshold || 5)
                            ? "text-rose-600 font-bold"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant="success" size="sm">
                        {p.status || "ACTIVE"}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                          title="Edit Product"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? "Edit Product" : "Create Master Product"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sony WH-1000XM4 Wireless Headphones"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Retail Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="19999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                SKU Reference *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Barcode / EAN
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Cloudinary / CDN Image URL
            </label>
            <input
              type="url"
              placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Initial Stock Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-sm"
            >
              Save Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product?"
        message={`Are you sure you want to delete ${deleteTarget?.name}? It will be removed from all branch registers.`}
      />
    </div>
  );
}

export default Products;
