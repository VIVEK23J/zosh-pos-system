import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import customerReducer from "./customerSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    customers: customerReducer,
    auth: authReducer,
  },
});

export default store;
