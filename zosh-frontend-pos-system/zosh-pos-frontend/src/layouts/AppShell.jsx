import { Outlet, useLocation } from "@/lib/rr-compat";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export function AppShell({ module, title }) {
  const { pathname } = useLocation();
  return <div className="workspace"><Sidebar module={module} /><div className="workspace-body"><Header title={title} /><main className="app-main"><div key={pathname} className="workspace-page"><Outlet /></div></main></div></div>;
}
export default AppShell;
