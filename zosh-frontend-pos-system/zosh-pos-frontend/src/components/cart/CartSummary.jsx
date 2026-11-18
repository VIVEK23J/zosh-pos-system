import { useDispatch, useSelector } from "react-redux";
import { Tag, CreditCard, ReceiptText } from "lucide-react";
import { applyDiscount } from "../../store/cartSlice";

export function CartSummary({ onProceedToPayment }) {
  const dispatch = useDispatch();

  const {
    cartItems,
    quantity,
    subtotal,
    discount,
    discountType,
    discountValue,
    tax,
    grandTotal,
  } = useSelector((state) => state.cart);

  const handleTypeChange = (e) => {
    dispatch(
      applyDiscount({
        type: e.target.value,
        value: discountValue,
      })
    );
  };

  const handleValueChange = (e) => {
    const rawVal = e.target.value;
    const num = rawVal === "" ? 0 : Math.max(0, Number(rawVal));
    dispatch(
      applyDiscount({
        type: discountType,
        value: num,
      })
    );
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Summary Box matching ShiftReports breakdown well */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-2.5 text-xs">
        <div className="flex items-center justify-between pb-1 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
            <ReceiptText className="size-4 text-emerald-700 dark:text-emerald-400" />
            <span>Bill Calculation</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-400">
            {quantity} {quantity === 1 ? "unit" : "units"}
          </span>
        </div>

        <div className="flex justify-between py-0.5">
          <span className="text-gray-500">Items Subtotal</span>
          <span className="font-mono font-semibold text-gray-900 dark:text-white">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {/* Discount Controls */}
        <div className="py-2 border-y border-gray-200 dark:border-gray-700 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300 font-semibold flex items-center gap-1">
              <Tag className="size-3 text-emerald-700 dark:text-emerald-400" />
              <span>Discount</span>
            </span>
            {discount > 0 && (
              <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                -₹{discount.toFixed(2)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={discountType}
              onChange={handleTypeChange}
              aria-label="Discount Type"
              className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Cash (₹)</option>
            </select>

            <input
              type="number"
              min="0"
              max={discountType === "percentage" ? 100 : subtotal}
              value={discountValue === 0 ? "" : discountValue}
              placeholder="0"
              onChange={handleValueChange}
              aria-label="Discount Value"
              className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex justify-between py-0.5">
          <span className="text-gray-500">Tax (GST 5%)</span>
          <span className="font-mono font-semibold text-gray-900 dark:text-white">
            ₹{tax.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 text-sm font-bold text-emerald-800 dark:text-emerald-300">
          <span>Grand Total Payable</span>
          <span className="font-mono text-base">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Primary Action Proceed to Checkout Button */}
      <button
        type="button"
        disabled={cartItems.length === 0}
        onClick={onProceedToPayment}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <CreditCard className="size-4" />
        <span>Proceed to Payment (₹{grandTotal.toFixed(2)})</span>
      </button>
    </div>
  );
}

export default CartSummary;
