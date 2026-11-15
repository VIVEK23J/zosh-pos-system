import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Store, Mail, Phone, MapPin, Save } from "lucide-react";
import { setCurrentStore } from "../../store/authSlice";
import { storeService } from "../../services/storeService";
import { useToast } from "../../components/common/Toast";
import { ThemeToggle } from "../../components/common/ThemeToggle";

export function StoreSettings() {
  const dispatch = useDispatch();
  const toast = useToast();
  const currentStore = useSelector((state) => state.auth.currentStore);

  const [formData, setFormData] = useState({
    brand: currentStore?.brand || "Zosh Retail Store",
    description: currentStore?.description || "Flagship Retail & Electronics Store",
    email: currentStore?.email || "contact@zoshretail.com",
    phone: currentStore?.phone || "0124-4598200",
    currency: "INR (₹)",
    defaultTaxRate: "5",
    website: "https://zoshpos.com",
    corporateAddress: currentStore?.address || "DLF Cyber City, Sector 24, Gurugram, Haryana",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentStore?.id) {
        await storeService.updateStore(currentStore.id, formData);
      }
      dispatch(setCurrentStore({ ...currentStore, ...formData }));
      toast.success("Store Profile Updated", "Enterprise business information saved.");
    } catch {
      dispatch(setCurrentStore({ ...currentStore, ...formData }));
      toast.info("Store Profile Updated (Offline Mode)", "Enterprise business information saved locally.");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Store Brand & Corporate Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Manage master business identity, default sales tax rate, enterprise email and merchant profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5 text-xs">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Store Brand Name *
          </label>
          <div className="relative">
            <Store className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              name="brand"
              required
              value={formData.brand}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Store Business Description
          </label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Official Corporate Email
            </label>
            <div className="relative">
              <Mail className="size-4 text-gray-400 absolute left-3 top-3" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Corporate Telephone
            </label>
            <div className="relative">
              <Phone className="size-4 text-gray-400 absolute left-3 top-3" />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Default System Currency
            </label>
            <input
              name="currency"
              disabled
              value={formData.currency}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Standard Default Tax (GST %)
            </label>
            <input
              name="defaultTaxRate"
              type="number"
              value={formData.defaultTaxRate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Headquarters / Corporate Address
          </label>
          <div className="relative">
            <MapPin className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              name="corporateAddress"
              value={formData.corporateAddress}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <Save className="size-4" />
            <span>Update Store Settings</span>
          </button>
        </div>
      </form>

      {/* Interface Theme & Appearance Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Interface Theme & Appearance
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Choose how ZOSH POS looks for your cashier terminal and administrative dashboards.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">
              Color Theme Mode
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Toggle between light mode, dark mode, or follow your operating system settings.
            </span>
          </div>
          <ThemeToggle variant="segmented" />
        </div>
      </div>
    </div>
  );
}

export default StoreSettings;
