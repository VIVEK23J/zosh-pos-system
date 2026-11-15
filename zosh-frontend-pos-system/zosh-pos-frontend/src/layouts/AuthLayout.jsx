import { Outlet, Link } from "react-router-dom";
import { Store, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { ThemeToggle } from "../components/common/ThemeToggle";

export function AuthLayout() {

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Left Column: Form Outlet */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-sm">
              <Store className="size-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
              ZOSH POS
            </span>
          </Link>

          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-8">
          <Outlet />
        </div>

        <div className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Zosh Point of Sale Systems. All rights reserved.
        </div>
      </div>

      {/* Right Column: Hero Visuals */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-emerald-900 via-emerald-950 to-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent_70%)]" />

        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
            Enterprise Cloud Architecture
          </span>
          <h2 className="text-3xl font-extrabold mt-6 leading-tight">
            Streamlined Retail, Inventory & Multi-Branch POS.
          </h2>
          <p className="text-sm text-emerald-200/80 mt-3 max-w-md leading-relaxed">
            Connected with Spring Boot Java 21, MySQL database, and Razorpay/Stripe checkout rails.
          </p>
        </div>

        <div className="relative z-10 space-y-4 my-auto py-12">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Fast Cashier Billing</h4>
              <p className="text-xs text-gray-300">Quick barcode search, instant discounts, and receipt generation.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="size-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Real-time Analytics</h4>
              <p className="text-xs text-gray-300">Shift reports, low-stock alerts, and store revenue tracking.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="size-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Role-based Access</h4>
              <p className="text-xs text-gray-300">Custom views for Cashier, Branch Manager, Store Admin & Super Admin.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-emerald-300/60 pt-6 border-t border-white/10">
          <span>Spring Security • JWT Validated</span>
          <span>Version 2.0 Production</span>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
