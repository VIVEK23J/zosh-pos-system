import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export function StoreLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors">
      <Sidebar module="store-admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Store Admin HQ & Catalog Management" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StoreLayout;
