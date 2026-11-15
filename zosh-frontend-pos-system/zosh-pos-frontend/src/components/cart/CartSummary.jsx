import { useDispatch, useSelector } from "react-redux";
import { Tag, CreditCard, ReceiptText } from "lucide-react";
import { applyDiscount } from "../../store/cartSlice";

function CartSummary({ onProceedToPayment }) {
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
    <div className="cart-summary">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px", fontSize: "17px" }}>
          <ReceiptText size={18} color="#174b35" />
          Order Summary
        </h2>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>
          {quantity} {quantity === 1 ? "unit" : "units"}
        </span>
      </div>

      <div className="summary-row">
        <span>Items Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <div className="discount-section">
        <label>
          <Tag size={15} color="#174b35" />
          Discount Offer
        </label>

        <div className="discount-controls">
          <select
            value={discountType}
            onChange={handleTypeChange}
            aria-label="Discount Type"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat (₹)</option>
          </select>

          <input
            type="number"
            min="0"
            max={discountType === "percentage" ? 100 : subtotal}
            value={discountValue === 0 ? "" : discountValue}
            placeholder="0"
            onChange={handleValueChange}
            aria-label="Discount Value"
          />
        </div>
      </div>

      <div className="summary-row">
        <span>
          Discount ({discountType === "percentage" ? `${discountValue}%` : "Flat"})
        </span>
        <span style={{ color: discount > 0 ? "#16a34a" : "inherit" }}>
          -₹{discount.toFixed(2)}
        </span>
      </div>

      <div className="summary-row">
        <span>Tax (GST 5%)</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>

      <div className="summary-divider"></div>

      <div className="total-row">
        <strong>Grand Total</strong>
        <strong>₹{grandTotal.toFixed(2)}</strong>
      </div>

      <button
        type="button"
        className="checkout-btn"
        disabled={cartItems.length === 0}
        onClick={onProceedToPayment}
      >
        <CreditCard size={18} />
        Proceed to Payment (₹{grandTotal.toFixed(2)})
      </button>
    </div>
  );
}

export default CartSummary;
