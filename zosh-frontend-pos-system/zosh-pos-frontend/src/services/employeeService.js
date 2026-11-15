import api from "./api";
import { mockEmployees } from "./mockData";
import { ROLES } from "../constants/roles";

export const normalizeEmployee = (e) => {
  if (!e) return e;
  return {
    ...e,
    id: e.id,
    fullName: e.fullName || "Staff Member",
    email: e.email || "staff@zoshpos.com",
    phone: e.phone || "9876543210",
    role: e.role || ROLES.CASHIER,
    status: e.status || "ACTIVE",
    totalSales: Number(e.totalSales || 0),
    storeId: e.storeId || 1,
    branchId: e.branchId || 1,
  };
};

export const employeeService = {
  getEmployeesByStore: async (storeId = 1, role) => {
    try {
      const url = role
        ? `/api/employees/store/${storeId}?role=${role}`
        : `/api/employees/store/${storeId}`;
      const res = await api.get(url);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeEmployee);
      }
      return mockEmployees.map(normalizeEmployee);
    } catch {
      return mockEmployees.map(normalizeEmployee);
    }
  },

  getEmployeesByBranch: async (branchId = 1, role) => {
    try {
      const url = role
        ? `/api/employees/branch/${branchId}?role=${role}`
        : `/api/employees/branch/${branchId}`;
      const res = await api.get(url);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeEmployee);
      }
      return mockEmployees.filter((e) => e.branchId === Number(branchId)).map(normalizeEmployee);
    } catch {
      return mockEmployees.filter((e) => e.branchId === Number(branchId)).map(normalizeEmployee);
    }
  },

  createStoreEmployee: async (storeId, data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role || ROLES.CASHIER,
      password: data.password || "password123",
      branchId: data.branchId ? Number(data.branchId) : null,
      storeId: Number(storeId || 1),
    };
    try {
      const res = await api.post(`/api/employees/store/${storeId}`, payload);
      return normalizeEmployee(res.data);
    } catch {
      const newEmp = normalizeEmployee({ ...payload, ...data, id: Date.now(), status: "ACTIVE", totalSales: 0 });
      mockEmployees.push(newEmp);
      return newEmp;
    }
  },

  createBranchEmployee: async (branchId, data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role || ROLES.CASHIER,
      password: data.password || "password123",
      branchId: Number(branchId || 1),
    };
    try {
      const res = await api.post(`/api/employees/branch/${branchId}`, payload);
      return normalizeEmployee(res.data);
    } catch {
      const newEmp = normalizeEmployee({ ...payload, ...data, id: Date.now(), status: "ACTIVE", totalSales: 0 });
      mockEmployees.push(newEmp);
      return newEmp;
    }
  },

  updateEmployee: async (employeeId, data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      password: data.password || undefined,
      branchId: data.branchId ? Number(data.branchId) : undefined,
    };
    try {
      const res = await api.put(`/api/employees/${employeeId}`, payload);
      return normalizeEmployee(res.data);
    } catch {
      const idx = mockEmployees.findIndex((e) => e.id === Number(employeeId));
      if (idx !== -1) {
        mockEmployees[idx] = normalizeEmployee({ ...mockEmployees[idx], ...data });
        return mockEmployees[idx];
      }
      return normalizeEmployee(data);
    }
  },

  deleteEmployee: async (employeeId) => {
    try {
      const res = await api.delete(`/api/employees/${employeeId}`);
      return res.data;
    } catch {
      const idx = mockEmployees.findIndex((e) => e.id === Number(employeeId));
      if (idx !== -1) mockEmployees.splice(idx, 1);
      return { message: "Employee deleted" };
    }
  },
};

export default employeeService;
