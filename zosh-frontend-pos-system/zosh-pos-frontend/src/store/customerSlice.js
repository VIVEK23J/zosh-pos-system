import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customerService } from "../services/customerService";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await customerService.getAllCustomers();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCustomerAsync = createAsyncThunk(
  "customers/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const created = await customerService.createCustomer(customerData);
      return created;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCustomerAsync = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await customerService.updateCustomer(id, data);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCustomerAsync = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      await customerService.deleteCustomer(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialCustomers = [
  {
    id: 1,
    name: "Rahul Sharma",
    fullName: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    address: "Plot 42, Sector 29, Gurugram, Haryana",
    totalOrders: 12,
    totalSpent: 18500,
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Verma",
    fullName: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "9876543211",
    address: "B-104, Green Park, South Delhi, Delhi",
    totalOrders: 8,
    totalSpent: 12400,
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Kumar",
    fullName: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "9876543212",
    address: "Tower 3, Sector 62, Noida, Uttar Pradesh",
    totalOrders: 5,
    totalSpent: 7600,
    status: "Active",
  },
];

const initialState = {
  customers: initialCustomers,
  selectedCustomer: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,

  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },

    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },

    addCustomer: (state, action) => {
      const newCustomer = {
        ...action.payload,
        id: action.payload.id || Date.now(),
        fullName: action.payload.fullName || action.payload.name,
        name: action.payload.name || action.payload.fullName,
        totalOrders: action.payload.totalOrders || 0,
        totalSpent: action.payload.totalSpent || 0,
        status: action.payload.status || "Active",
      };
      state.customers.unshift(newCustomer);
    },

    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(
        (customer) => customer.id === action.payload.id
      );

      if (index !== -1) {
        state.customers[index] = {
          ...state.customers[index],
          ...action.payload,
        };

        if (state.selectedCustomer && state.selectedCustomer.id === action.payload.id) {
          state.selectedCustomer = {
            ...state.selectedCustomer,
            ...action.payload,
          };
        }
      }
    },

    deleteCustomer: (state, action) => {
      const idToDelete = action.payload;
      state.customers = state.customers.filter(
        (customer) => customer.id !== idToDelete
      );

      if (state.selectedCustomer && state.selectedCustomer.id === idToDelete) {
        state.selectedCustomer = null;
      }
    },

    recordCustomerOrder: (state, action) => {
      const { customerId, amount } = action.payload;
      if (!customerId) return;

      const customer = state.customers.find((c) => c.id === customerId);
      if (customer) {
        customer.totalOrders = (customer.totalOrders || 0) + 1;
        customer.totalSpent = (customer.totalSpent || 0) + (Number(amount) || 0);

        if (state.selectedCustomer && state.selectedCustomer.id === customerId) {
          state.selectedCustomer = { ...customer };
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.customers = action.payload;
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomerAsync.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
      })
      .addCase(updateCustomerAsync.fulfilled, (state, action) => {
        const idx = state.customers.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) {
          state.customers[idx] = { ...state.customers[idx], ...action.payload };
        }
        if (state.selectedCustomer && state.selectedCustomer.id === action.payload.id) {
          state.selectedCustomer = { ...state.selectedCustomer, ...action.payload };
        }
      })
      .addCase(deleteCustomerAsync.fulfilled, (state, action) => {
        state.customers = state.customers.filter((c) => c.id !== action.payload);
        if (state.selectedCustomer && state.selectedCustomer.id === action.payload) {
          state.selectedCustomer = null;
        }
      });
  },
});

export const {
  setCustomers,
  setSelectedCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  recordCustomerOrder,
} = customerSlice.actions;

export default customerSlice.reducer;
