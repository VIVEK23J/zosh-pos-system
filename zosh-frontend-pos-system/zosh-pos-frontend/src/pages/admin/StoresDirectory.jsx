import { useState, useEffect } from "react";
import { Building2, Search, MapPin, Mail, Phone, ShieldCheck, Trash2 } from "lucide-react";
import { storeService } from "../../services/storeService";
import { Badge } from "../../components/common/Badge";
import { TableSkeleton } from "../../components/common/Skeleton";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useToast } from "../../components/common/Toast";

export function StoresDirectory() {
  const toast = useToast();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      const data = await storeService.getAllStores();
      setStores(data);
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (store) => {
    const nextStatus = store.storeStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await storeService.moderateStore(store.id, nextStatus);
      setStores(stores.map((s) => (s.id === store.id ? { ...s, storeStatus: nextStatus } : s)));
      toast.info("Status Updated", `${store.brand} is now ${nextStatus}`);
    } catch {
      toast.error("Error", "Could not change status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await storeService.deleteStore(deleteTarget.id);
      setStores(stores.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Store Deleted", "Merchant record removed from platform.");
    } catch {
      toast.error("Error", "Could not delete store");
    }
  };

  const filtered = stores.filter((s) => {
    const q = search.toLowerCase();
    return s.brand?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Enrolled Merchant Stores Directory
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Full directory of multi-tenant retail businesses onboarded to the POS platform
          </p>
        </div>

        <Badge variant="purple" size="lg">
          {stores.length} Registered Merchants
        </Badge>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-sm">
          <Search className="size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stores by brand or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs outline-none text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Store Brand</th>
                  <th className="px-5 py-3.5">Contact Line</th>
                  <th className="px-5 py-3.5">Registered Address</th>
                  <th className="px-5 py-3.5">Status (Click to toggle)</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        {s.brand}
                      </div>
                      <span className="text-[11px] text-gray-400">{s.description}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-gray-700 dark:text-gray-300">{s.email}</div>
                      <div className="text-[11px] text-gray-400">{s.phone}</div>
                    </td>

                    <td className="px-5 py-4 max-w-xs text-gray-500 truncate">
                      {s.address || "Corporate Location"}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(s)}
                        className="cursor-pointer"
                        title="Click to toggle Active / Suspended"
                      >
                        <Badge
                          variant={s.storeStatus === "ACTIVE" ? "success" : s.storeStatus === "PENDING" ? "warning" : "danger"}
                          size="sm"
                        >
                          {s.storeStatus}
                        </Badge>
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        title="Delete Merchant Store"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Merchant Store?"
        message={`Are you sure you want to permanently delete ${deleteTarget?.brand}? All associated branches, products, and employee records will be removed.`}
      />
    </div>
  );
}

export default StoresDirectory;
