import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../../store/cartSlice";

export function CartItem({ item }) {
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);

  const lineTotal = Number(item.price || item.sellingPrice || 0) * (item.quantity || 1);

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Product Thumbnail / Icon */}
        <div className="size-11 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden shrink-0">
          {item.image && !imgError && item.image.startsWith("http") ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg">
              {item.fallbackIcon ||
                (typeof item.image === "string" && !item.image.startsWith("http")
                  ? item.image
                  : "📦")}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="min-w-0 space-y-1">
          <h4
            title={item.name}
            className="text-xs font-bold text-gray-900 dark:text-white truncate"
          >
            {item.name}
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 font-mono">
              ₹{Number(item.price || item.sellingPrice || 0).toFixed(2)} each
            </span>
          </div>

          {/* Stepper Quantity Control */}
          <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-0.5">
            <button
              type="button"
              title="Decrease quantity"
              onClick={() => dispatch(decreaseQty(item.id))}
              disabled={item.quantity <= 1}
              className="size-5 rounded flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition"
            >
              <Minus className="size-3" />
            </button>

            <span className="font-mono font-bold text-xs min-w-[20px] text-center text-gray-900 dark:text-white">
              {item.quantity}
            </span>

            <button
              type="button"
              title="Increase quantity"
              onClick={() => dispatch(increaseQty(item.id))}
              className="size-5 rounded flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Line Total & Remove */}
      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
        <strong className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-400">
          ₹{lineTotal.toFixed(2)}
        </strong>

        <button
          type="button"
          title="Remove from cart"
          onClick={() => dispatch(removeFromCart(item.id))}
          className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
