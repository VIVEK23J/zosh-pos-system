export const analyticsService = {
  getOverviewMetrics: () => {
    return {
      totalRevenue: 582490,
      totalOrders: 428,
      avgOrderValue: 1360.95,
      activeCustomers: 124,
      revenueGrowth: "+14.6%",
      orderGrowth: "+8.2%",
    };
  },

  getDailyRevenue: () => {
    return [
      { time: "09 AM", revenue: 12400, orders: 8 },
      { time: "11 AM", revenue: 24800, orders: 15 },
      { time: "01 PM", revenue: 42100, orders: 28 },
      { time: "03 PM", revenue: 31500, orders: 19 },
      { time: "05 PM", revenue: 64200, orders: 36 },
      { time: "07 PM", revenue: 78900, orders: 45 },
      { time: "09 PM", revenue: 38200, orders: 22 },
    ];
  },

  getWeeklyRevenue: () => {
    return [
      { day: "Mon", revenue: 54000, orders: 42 },
      { day: "Tue", revenue: 68000, orders: 51 },
      { day: "Wed", revenue: 62000, orders: 48 },
      { day: "Thu", revenue: 74000, orders: 58 },
      { day: "Fri", revenue: 98000, orders: 74 },
      { day: "Sat", revenue: 124000, orders: 92 },
      { day: "Sun", revenue: 102000, orders: 78 },
    ];
  },

  getMonthlyRevenue: () => {
    return [
      { month: "May", revenue: 340000 },
      { month: "Jun", revenue: 410000 },
      { month: "Jul", revenue: 390000 },
      { month: "Aug", revenue: 460000 },
      { month: "Sep", revenue: 510000 },
      { month: "Oct", revenue: 582490 },
    ];
  },

  getPaymentBreakdown: () => {
    return [
      { name: "UPI", value: 45, amount: 262120, color: "#10b981" },
      { name: "Card", value: 35, amount: 203870, color: "#3b82f6" },
      { name: "Cash", value: 20, amount: 116500, color: "#f59e0b" },
    ];
  },

  getBranchWiseRevenue: () => {
    return [
      { branch: "Sector 29 Gurugram", revenue: 285400, orders: 210 },
      { branch: "Noida Cyber Branch", revenue: 178200, orders: 135 },
      { branch: "South Ex Delhi", revenue: 118890, orders: 83 },
    ];
  },

  getTopProducts: () => {
    return [
      { name: "Sony WH-1000XM4", sales: 42, revenue: 839958, category: "Audio" },
      { name: "Apple Watch Series 9", sales: 28, revenue: 979972, category: "Smart Devices" },
      { name: "JBL Flip 6", sales: 38, revenue: 341962, category: "Audio" },
      { name: "Logitech MX Master 3S", sales: 34, revenue: 271966, category: "Accessories" },
      { name: "Anker 65W Fast Charger", sales: 52, revenue: 171548, category: "Cables & Power" },
    ];
  },
};

export default analyticsService;
