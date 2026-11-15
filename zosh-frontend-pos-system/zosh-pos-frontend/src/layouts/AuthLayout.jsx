import { Outlet, Link } from "@/lib/rr-compat";
import { Store } from "lucide-react";
import { ThemeToggle } from "../components/common/ThemeToggle";
import heroImg from "@/assets/retail-counter.jpg";
export function AuthLayout() {
  return <div className="auth-workspace"><header className="auth-header"><Link to="/" className="workspace-brand"><Store className="size-6 text-primary" /><span>Zosh / POS</span></Link><ThemeToggle /></header><main className="auth-content"><div className="auth-form"><Outlet /></div><div className="auth-photo"><img src={heroImg} width={1024} height={1408} alt="Modern retail counter with a point of sale terminal" /><div className="auth-photo-caption"><span>ZOSH POINT OF SALE</span><h2>A new day.<br />Open for business.</h2><p>Retail, in good order.</p></div></div></main><footer className="auth-footer">© {new Date().getFullYear()} Zosh Point of Sale Systems</footer></div>;
}
export default AuthLayout;
