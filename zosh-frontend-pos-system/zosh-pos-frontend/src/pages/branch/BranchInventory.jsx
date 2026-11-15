import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Package,
  Search,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  ArrowUpDown,
  History,
  CheckCircle2,
  X,
} from "lucide-react";
import { inventoryService } from "../../services/inventoryService";
import { productService } from "../../services/productService";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/Skeleton";
import { useToast } from "../../components/common/Toast";

export function BranchInventory() {
  const toast = useToast();
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const currentStore = useSelector((state) => state.auth.currentStore);
  const branchId = currentBranch?.id || 1;
  const storeId = currentStore?.id || 1;

  const [inventory, setInventory] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [addForm, setAddForm] = useState({
    productId: "",
    quantity: "20",
  });

  useEffect(() => {
    loadInventory();
  }, [branchId]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const [invData, prodData] = await Promise.all([
        inventoryService.getInventoryByBranch(branchId),
        productService.getProductsByStore(storeId),
      ]);
      setInventory(invData);
      setStoreProducts(prodData);
      if (prodData && prodData.length > 0 && !addForm.productId) {
        setAddForm((prev) => ({ ...prev, productId: String(prodData[0].id) }));
      }
    } catch {
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const updated = await inventoryService.updateInventory(editingItem.id, {
        quantity: Number(newQuantity),
      });

      setInventory(
        inventory.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                quantity: Number(newQuantity),
                isLowStock: Number(newQuantity) <= item.lowStockThreshold,
              }
            : item
        )
      );

      setEditingItem(null);
      toast.success("Inventory Updated", `Stock updated to ${newQuantity} units.`);
    } catch {
      toast.error("Error", "Could not update stock level");
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!addForm.productId) return;

    try {
      const created = await inventoryService.createInventory({
        branchId,
        productId: Number(addForm.productId),
        quantity: Number(addForm.quantity || 0),
      });

      setInventory([created, ...inventory]);
      setShowAddModal(false);
      toast.success("Product Assigned", "Product stock added to branch register.");
    } catch {
      toast.error("Error", "Could not assign product to branch inventory");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await inventoryService.deleteInventory(deleteTarget.id);
      setInventory(inventory.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Item Removed", "Product removed from branch stock tracking.");
    } catch {
      toast.error("Error", "Could not delete inventory item");
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const q = search.toLowerCase();
    const pName = item.product?.name || "";
    const pSku = item.product?.sku || "";
    const pCat = item.product?.categoryName || "";

    const matchesSearch =
      pName.toLowerCase().includes(q) ||
      pSku.toLowerCase().includes(q) ||
      pCat.toLowerCase().includes(q);

    const matchesLowStock = filterLowStock ? item.isLowStock : true;

    return matchesSearch && matchesLowStock;
  });

  const lowStockCount = inventory.filter((i) => i.isLowStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Branch Stock & Inventory Control
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Monitor real-time shelf stock, track low-stock thresholds, and record replenish adjustments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              filterLowStock
                ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
            }`}
          >
            <AlertTriangle className="size-3.5" />
            <span>Low Stock Alerts ({lowStockCount})</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition"
          >
            <Plus className="size-3.5" />
            <span>Assign Product Stock</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-sm">
          <Search className="size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name, SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs outline-none text-gray-900 dark:text-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400">
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Product SKU</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Unit Price</th>
                  <th className="px-5 py-3.5">Available Stock</th>
                  <th className="px-5 py-3.5">Threshold</th>
                  <th className="px-5 py-3.5">Inventory Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {item.product?.name}
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {item.product?.sku}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {item.product?.categoryName || "General"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800 dark:text-gray-200">
                      ₹{(item.product?.price || item.product?.sellingPrice || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-base text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <span className="text-gray-400 text-[11px] ml-1">units</span>
                    </td>

                    <td className="px-5 py-4 text-gray-400 font-mono">
                      {item.lowStockThreshold} units
                    </td>

                    <td className="px-5 py-4">
                      {item.isLowStock ? (
                        <Badge variant="warning" size="sm" dot>
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">
                          Sufficient
                        </Badge>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setNewQuantity(String(item.quantity));
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <Edit className="size-3.5 text-emerald-600" />
                          <span>Update</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-xs">
                      No stock records matched your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {editingItem && (
        <Modal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title={`Adjust Stock: ${editingItem.product?.name}`}
          subtitle={`SKU: ${editingItem.product?.sku}`}
        >
          <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                New Stock Quantity (Units) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Current count: {editingItem.quantity} units. Threshold is {editingItem.lowStockThreshold} units.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-sm"
              >
                Save Adjustment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Stock Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Assign Product to Branch Stock"
          subtitle="Select a master catalog product and set branch opening quantity"
        >
          <form onSubmit={handleAddStock} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Catalog Product *
              </label>
              <select
                value={addForm.productId}
                onChange={(e) => setAddForm({ ...addForm, productId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none"
                required
              >
                {storeProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) - ₹{p.price || p.sellingPrice}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Initial Stock Units *
              </label>
              <input
                type="number"
                min="1"
                required
                value={addForm.quantity}
                onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-sm"
              >
                Assign to Stock
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Stock Tracking?"
        message={`Are you sure you want to remove ${deleteTarget?.product?.name} from branch stock monitoring?`}
        confirmText="Remove Item"
        variant="danger"
      />
    </div>
  );
}

export default BranchInventory;
