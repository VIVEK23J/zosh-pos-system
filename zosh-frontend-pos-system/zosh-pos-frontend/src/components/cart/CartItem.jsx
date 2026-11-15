import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../../store/cartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);

  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="product-icon" style={{ overflow: "hidden", position: "relative" }}>
        {item.image && !imgError && item.image.startsWith("http") ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ) : (
          <span>{item.fallbackIcon || (typeof item.image === "string" && !item.image.startsWith("http") ? item.image : "📦")}</span>
        )}
      </div>

      <div className="item-details">
        <h3 title={item.name} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.name}
        </h3>
        <p>₹{item.price.toFixed(2)} each</p>

        <div className="quantity-control">
          <button
            type="button"
            title="Decrease quantity"
            onClick={() => dispatch(decreaseQty(item.id))}
            disabled={item.quantity <= 1}
            style={{ opacity: item.quantity <= 1 ? 0.4 : 1 }}
          >
            <Minus size={13} />
          </button>

          <span style={{ fontWeight: 600, minWidth: "22px", textAlign: "center" }}>
            {item.quantity}
          </span>

          <button
            type="button"
            title="Increase quantity"
            onClick={() => dispatch(increaseQty(item.id))}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div className="item-right">
        <strong style={{ fontSize: "15px" }}>
          ₹{lineTotal.toFixed(2)}
        </strong>

        <button
          type="button"
          className="remove-btn"
          title="Remove from cart"
          onClick={() => dispatch(removeFromCart(item.id))}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
