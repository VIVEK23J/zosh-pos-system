import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "./Modal";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm",
  confirmVariant = "danger",
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" title={title}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`size-14 rounded-full flex items-center justify-center mb-4 ${
            confirmVariant === "danger"
              ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
              : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          }`}
        >
          {confirmVariant === "danger" ? (
            <Trash2 className="size-7" />
          ) : (
            <AlertTriangle className="size-7" />
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 ${
              confirmVariant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
