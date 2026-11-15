import { createSlice } from "@reduxjs/toolkit";
import { ROLES, normalizeRole } from "../constants/roles";

const savedUserStr = localStorage.getItem("pos_user");
const savedJwt = localStorage.getItem("pos_jwt");

const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

const initialUser = savedUser
  ? { ...savedUser, role: normalizeRole(savedUser.role) }
  : {
      id: 12,
      fullName: "Vivek Sharma (Cashier)",
      email: "cashier@zoshpos.com",
      phone: "9876543210",
      role: ROLES.CASHIER,
      storeId: 1,
      branchId: 1,
    };

const validInitialJwt =
  "eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3OTM2MzY3MjQsImV4cCI6MTc5MzcyMzEyNCwiZW1haWwiOiJjYXNoaWVyQHpvc2hwb3MuY29tIiwiYXV0aG9yaXRpZXMiOiJST0xFX0NBU0hJRVIifQ.KocJ3Cmo7CwPiJbX5R_Gaxy3hWgJpjmU1ndcdZ7F6WcLRL8G4IufwEMb_igmegv-";

const initialState = {
  user: initialUser,
  token: savedJwt && !savedJwt.includes("demo-pos-jwt") ? savedJwt : validInitialJwt,
  isAuthenticated: true,
  isLoading: false,
  error: null,
  currentStore: {
    id: 1,
    brand: "Zosh Retail Store",
    storeStatus: "ACTIVE",
    description: "Flagship Retail & Electronics Store",
  },
  currentBranch: {
    id: 1,
    name: "Main Branch - Sector 29",
    address: "Cyber City, Gurugram, Haryana",
    phone: "0124-4598200",
    operatingHours: "09:00 AM - 10:00 PM",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    loginSuccess: (state, action) => {
      const { user, jwt } = action.payload;
      const normalizedUser = {
        ...user,
        role: normalizeRole(user.role),
      };

      state.user = normalizedUser;
      state.token = jwt;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      localStorage.setItem("pos_jwt", jwt);
      localStorage.setItem("pos_user", JSON.stringify(normalizedUser));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      localStorage.removeItem("pos_jwt");
      localStorage.removeItem("pos_user");
    },
    setCurrentStore: (state, action) => {
      state.currentStore = action.payload;
    },
    setCurrentBranch: (state, action) => {
      state.currentBranch = action.payload;
    },
    updateUserProfile: (state, action) => {
      const updated = {
        ...state.user,
        ...action.payload,
        // Role cannot be self-elevated via profile update
        role: state.user.role,
      };
      state.user = updated;
      localStorage.setItem("pos_user", JSON.stringify(updated));
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  logout,
  setCurrentStore,
  setCurrentBranch,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
