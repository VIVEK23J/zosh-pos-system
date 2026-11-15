import { useState } from "react";
import { Link, useNavigate } from "@/lib/rr-compat";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "../../services/authService";
import { loginSuccess, setLoading, setError } from "../../store/authSlice";
import { ROLES, getRoleDashboard } from "../../constants/roles";
import { useToast } from "../../components/common/Toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [demoRole, setDemoRole] = useState(ROLES.CASHIER);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "cashier@zoshpos.com",
      password: "123456",
    },
  });

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    try {
      const res = await authService.login(data);
      dispatch(loginSuccess(res));
      toast.success("Welcome back!", `Signed in as ${res.user.fullName}`);

      // Route strictly based on authenticated role
      const targetDashboard = getRoleDashboard(res.user.role);
      navigate(targetDashboard);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials. Please verify your email and password.";
      dispatch(setError(msg));
      toast.error("Login Failed", msg);
    }
  };

  const handleQuickFill = (role, email) => {
    setDemoRole(role);
    setValue("email", email);
    setValue("password", "123456");
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Sign in
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Welcome back to Zosh POS.
        </p>
      </div>

      {/* Role Credentials Quick Switcher */}
      <div className="login-role-selector">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
          
          <span>Demo accounts</span>
        </div>
        <div className="role-tabs">
          <Button variant="ghost"
            type="button"
            onClick={() => handleQuickFill(ROLES.CASHIER, "cashier@zoshpos.com")}
            className={`p-1.5 rounded-lg border text-left font-medium transition ${
              demoRole === ROLES.CASHIER
                ? "bg-white dark:bg-gray-800 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs"
                : "bg-transparent border-transparent hover:bg-white/50 text-gray-600 dark:text-gray-300"
            }`}
          >
            Cashier POS
          </Button>
          <Button variant="ghost"
            type="button"
            onClick={() => handleQuickFill(ROLES.MANAGER, "manager@zoshpos.com")}
            className={`p-1.5 rounded-lg border text-left font-medium transition ${
              demoRole === ROLES.MANAGER
                ? "bg-white dark:bg-gray-800 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs"
                : "bg-transparent border-transparent hover:bg-white/50 text-gray-600 dark:text-gray-300"
            }`}
          >
            Branch Manager
          </Button>
          <Button variant="ghost"
            type="button"
            onClick={() => handleQuickFill(ROLES.STORE_ADMIN, "storeadmin@zoshpos.com")}
            className={`p-1.5 rounded-lg border text-left font-medium transition ${
              demoRole === ROLES.STORE_ADMIN
                ? "bg-white dark:bg-gray-800 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs"
                : "bg-transparent border-transparent hover:bg-white/50 text-gray-600 dark:text-gray-300"
            }`}
          >
            Store Admin
          </Button>
          <Button variant="ghost"
            type="button"
            onClick={() => handleQuickFill(ROLES.SUPER_ADMIN, "admin@zoshpos.com")}
            className={`p-1.5 rounded-lg border text-left font-medium transition ${
              demoRole === ROLES.SUPER_ADMIN
                ? "bg-white dark:bg-gray-800 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs"
                : "bg-transparent border-transparent hover:bg-white/50 text-gray-600 dark:text-gray-300"
            }`}
          >
            Super Admin
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="email"
              {...register("email")}
              placeholder="e.g. cashier@zoshpos.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button variant="ghost"
          type="submit"
          disabled={isLoading}
          className="login-submit"
        >
          {isLoading ? (
            "Authenticating..."
          ) : (
            <>
              <LogIn className="size-4" />
              <span>Sign In to Register</span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        New merchant store?{" "}
        <Link
          to="/auth/register"
          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
        >
          Create an account <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}

export default Login;
