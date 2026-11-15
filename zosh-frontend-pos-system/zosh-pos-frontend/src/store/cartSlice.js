import { createSlice } from "@reduxjs/toolkit";

const calculateTotals = (state) => {
  const subtotal = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalQuantity = state.cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const safeDiscount = Math.max(0, Number(state.discountValue) || 0);
  const discountAmount =
    state.discountType === "percentage"
      ? (subtotal * Math.min(safeDiscount, 100)) / 100
      : Math.min(safeDiscount, subtotal);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * state.taxRate;
  const grandTotal = taxableAmount + tax;

  state.quantity = totalQuantity;
  state.subtotal = Number(subtotal.toFixed(2));
  state.discount = Number(discountAmount.toFixed(2));
  state.tax = Number(tax.toFixed(2));
  state.grandTotal = Number(grandTotal.toFixed(2));
};

const initialState = {
  cartItems: [],
  quantity: 0,
  subtotal: 0,
  discount: 0,
  discountType: "percentage", // 'percentage' | 'flat'
  discountValue: 0,
  taxRate: 0.05, // 5% GST / Sales Tax
  tax: 0,
  grandTotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // Add product to cart
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...product,
          quantity: 1,
        });
      }
      calculateTotals(state);
    },

    // Remove single product
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      calculateTotals(state);
    },

    // Increase product quantity
    increaseQty: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload
      );
      if (item) {
        item.quantity += 1;
        calculateTotals(state);
      }
    },

    // Decrease product quantity
    decreaseQty: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        calculateTotals(state);
      }
    },

    // Set specific quantity directly
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(1, Number(quantity) || 1);
        calculateTotals(state);
      }
    },

    // Apply percentage or flat discount
    applyDiscount: (state, action) => {
      const { type, value } = action.payload;
      if (type !== undefined) state.discountType = type;
      if (value !== undefined) state.discountValue = Math.max(0, Number(value) || 0);
      calculateTotals(state);
    },

    // Clear entire cart
    clearCart: (state) => {
      state.cartItems = [];
      state.discountValue = 0;
      calculateTotals(state);
    },

    // Reset all cart values
    resetCart: (state) => {
      state.cartItems = [];
      state.quantity = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.discountType = "percentage";
      state.discountValue = 0;
      state.tax = 0;
      state.grandTotal = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  updateItemQuantity,
  applyDiscount,
  clearCart,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
