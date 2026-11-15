import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layers, Plus, Edit, Trash2, Tag, CheckCircle2 } from "lucide-react";
import { categoryService } from "../../services/categoryService";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../components/common/Toast";

export function Categories() {
  const toast = useToast();
  const currentStore = useSelector((state) => state.auth.currentStore);
  const storeId = currentStore?.id || 1;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    loadCategories();
  }, [storeId]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategoriesByStore(storeId);
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name || "");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, {
          name: categoryName.trim(),
          storeId,
        });
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id ? { ...c, name: categoryName.trim() } : c
          )
        );
        toast.success("Category Updated", `Category renamed to ${categoryName}.`);
      } else {
        const created = await categoryService.createCategory({
          name: categoryName.trim(),
          storeId,
        });
        setCategories([...categories, created]);
        toast.success("Category Created", `${categoryName} added.`);
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "Could not save category");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await categoryService.deleteCategory(deleteTarget.id);
      setCategories(categories.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Category Removed", "Category deleted from store.");
    } catch {
      toast.error("Error", "Could not delete category");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Category Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Organize catalog products into clean taxonomy groups for POS cashier filters
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
        >
          <Plus className="size-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={4} cols={3} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Category ID</th>
                  <th className="px-5 py-3.5">Category Name</th>
                  <th className="px-5 py-3.5">Assigned Products</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-5 py-4 font-mono text-gray-500">#{c.id}</td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                          <Tag className="size-3.5" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {c.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {c.productCount || 0} items
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                          title="Edit Category"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                          title="Delete Category"
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? "Edit Category Name" : "Create New Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Category Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless Audio"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
              autoFocus
            />
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
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category?"
        message={`Are you sure you want to delete ${deleteTarget?.name}? Associated products will become uncategorized.`}
      />
    </div>
  );
}

export default Categories;
