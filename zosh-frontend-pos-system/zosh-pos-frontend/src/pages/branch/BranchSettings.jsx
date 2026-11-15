import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MapPin, Phone, Clock, Store, Save } from "lucide-react";
import { setCurrentBranch } from "../../store/authSlice";
import { branchService } from "../../services/branchService";
import { useToast } from "../../components/common/Toast";
import { ThemeToggle } from "../../components/common/ThemeToggle";

export function BranchSettings() {
  const dispatch = useDispatch();
  const toast = useToast();
  const currentBranch = useSelector((state) => state.auth.currentBranch);

  const [formData, setFormData] = useState({
    name: currentBranch?.name || "Main Branch - Sector 29",
    address: currentBranch?.address || "Cyber City, Gurugram, Haryana",
    phone: currentBranch?.phone || "0124-4598200",
    operatingHours: currentBranch?.operatingHours || "09:00 AM - 10:00 PM",
    taxRegistration: "07AAAAZ9999Z1Z5",
    receiptFooter: "Thank you for shopping at Zosh Retail!",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBranch?.id) {
        await branchService.updateBranch(currentBranch.id, formData);
      }
      dispatch(setCurrentBranch({ ...currentBranch, ...formData }));
      toast.success("Settings Saved", "Branch operational settings updated successfully.");
    } catch {
      dispatch(setCurrentBranch({ ...currentBranch, ...formData }));
      toast.info("Settings Saved (Offline Mode)", "Branch operational settings updated locally.");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Branch Configuration & Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Update branch physical address, register contact lines, operating hours and printed receipt footer
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5 text-xs">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Branch Display Name *
          </label>
          <div className="relative">
            <Store className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Physical Address *
          </label>
          <div className="relative">
            <MapPin className="size-4 text-gray-400 absolute left-3 top-3" />
            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Contact Phone / Telephone *
            </label>
            <div className="relative">
              <Phone className="size-4 text-gray-400 absolute left-3 top-3" />
              <input
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Operating Business Hours *
            </label>
            <div className="relative">
              <Clock className="size-4 text-gray-400 absolute left-3 top-3" />
              <input
                name="operatingHours"
                required
                value={formData.operatingHours}
                onChange={handleChange}
                placeholder="09:00 AM - 10:00 PM"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            GSTIN / State Tax Registration Number
          </label>
          <input
            name="taxRegistration"
            value={formData.taxRegistration}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Printed Receipt Slip Footer Message
          </label>
          <input
            name="receiptFooter"
            value={formData.receiptFooter}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <Save className="size-4" />
            <span>Save Branch Settings</span>
          </button>
        </div>
      </form>

      {/* Interface Theme & Appearance Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Branch Terminal Theme & Display
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Configure default display mode for this branch workstation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">
              Workstation Theme
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Select Light Mode, Dark Mode, or auto System Theme.
            </span>
          </div>
          <ThemeToggle variant="segmented" />
        </div>
      </div>
    </div>
  );
}

export default BranchSettings;
