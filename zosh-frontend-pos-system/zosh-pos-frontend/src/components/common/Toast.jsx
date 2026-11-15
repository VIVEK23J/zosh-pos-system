import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type: "success", duration: 3500, ...toast };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title, message) => addToast({ type: "success", title, message }),
    error: (title, message) => addToast({ type: "error", title, message }),
    info: (title, message) => addToast({ type: "info", title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
              t.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
                : t.type === "error"
                ? "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100"
                : t.type === "warning"
                ? "bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100"
                : "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === "success" && <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />}
              {t.type === "error" && <AlertCircle className="size-5 text-red-600 dark:text-red-400" />}
              {t.type === "warning" && <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />}
              {t.type === "info" && <Info className="size-5 text-blue-600 dark:text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              {t.title && <h5 className="font-semibold text-sm leading-tight">{t.title}</h5>}
              {t.message && <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{t.message}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 shrink-0 p-0.5"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: (title, msg) => console.log("Toast success:", title, msg),
      error: (title, msg) => console.error("Toast error:", title, msg),
      info: (title, msg) => console.log("Toast info:", title, msg),
      warning: (title, msg) => console.warn("Toast warn:", title, msg),
    };
  }
  return context;
}

export default ToastContext;
