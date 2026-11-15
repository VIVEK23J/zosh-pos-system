import api from "./api";

const initialMockCustomers = [
  {
    id: 1,
    fullName: "Rahul Sharma",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    address: "Sector 29, Gurugram, Haryana",
    totalOrders: 14,
    totalSpent: 47498,
    status: "Active",
  },
  {
    id: 2,
    fullName: "Priya Verma",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "9876543211",
    address: "Green Park, South Delhi",
    totalOrders: 9,
    totalSpent: 47399,
    status: "Active",
  },
  {
    id: 3,
    fullName: "Amit Kumar",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "9876543212",
    address: "Sector 62, Noida, UP",
    totalOrders: 6,
    totalSpent: 17498,
    status: "Active",
  },
  {
    id: 4,
    fullName: "Sneha Patel",
    name: "Sneha Patel",
    email: "sneha.patel@example.com",
    phone: "9876543213",
    address: "Marine Lines, Mumbai",
    totalOrders: 16,
    totalSpent: 39299,
    status: "Active",
  },
  {
    id: 5,
    fullName: "Vikram Malhotra",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "9876543214",
    address: "Indiranagar, Bengaluru",
    totalOrders: 3,
    totalSpent: 4200,
    status: "Inactive",
  },
];

export const normalizeCustomer = (c) => {
  if (!c) return c;
  const name = c.fullName || c.name || "Customer";
  return {
    ...c,
    id: c.id,
    fullName: name,
    name: name,
    email: c.email || "",
    phone: c.phone || "",
    address: c.address || "Local Customer",
    totalOrders: c.totalOrders != null ? c.totalOrders : 0,
    totalSpent: c.totalSpent != null ? c.totalSpent : 0,
    status: c.status || "Active",
  };
};

export const customerService = {
  getAllCustomers: async () => {
    try {
      const res = await api.get("/api/customers");
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeCustomer);
      }
      return initialMockCustomers.map(normalizeCustomer);
    } catch {
      return initialMockCustomers.map(normalizeCustomer);
    }
  },

  searchCustomers: async (query) => {
    try {
      const res = await api.get(`/api/customers/search?q=${encodeURIComponent(query)}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeCustomer);
      }
      const q = query.toLowerCase();
      return initialMockCustomers
        .map(normalizeCustomer)
        .filter(
          (c) =>
            c.fullName.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.email.toLowerCase().includes(q)
        );
    } catch {
      const q = query.toLowerCase();
      return initialMockCustomers
        .map(normalizeCustomer)
        .filter(
          (c) =>
            c.fullName.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.email.toLowerCase().includes(q)
        );
    }
  },

  createCustomer: async (customer) => {
    const payload = {
      fullName: customer.fullName || customer.name || "New Customer",
      email: customer.email || `${Date.now()}@customer.com`,
      phone: customer.phone || "9999999999",
    };
    try {
      const res = await api.post("/api/customers", payload);
      return normalizeCustomer({
        ...res.data,
        ...customer,
        id: res.data.id,
      });
    } catch {
      const newCust = normalizeCustomer({
        ...customer,
        ...payload,
        id: Date.now(),
        totalOrders: 0,
        totalSpent: 0,
        status: "Active",
      });
      initialMockCustomers.unshift(newCust);
      return newCust;
    }
  },

  updateCustomer: async (id, customer) => {
    const payload = {
      fullName: customer.fullName || customer.name,
      email: customer.email,
      phone: customer.phone,
    };
    try {
      const res = await api.put(`/api/customers/${id}`, payload);
      return normalizeCustomer({ ...res.data, ...customer });
    } catch {
      const idx = initialMockCustomers.findIndex((c) => c.id === Number(id));
      if (idx !== -1) {
        initialMockCustomers[idx] = normalizeCustomer({
          ...initialMockCustomers[idx],
          ...customer,
        });
        return initialMockCustomers[idx];
      }
      return normalizeCustomer({ id, ...customer });
    }
  },

  deleteCustomer: async (id) => {
    try {
      const res = await api.delete(`/api/customers/${id}`);
      return res.data;
    } catch {
      const idx = initialMockCustomers.findIndex((c) => c.id === Number(id));
      if (idx !== -1) initialMockCustomers.splice(idx, 1);
      return { message: "Customer deleted successfully" };
    }
  },
};

export default customerService;
