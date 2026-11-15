import { useState } from "react";
import { Link, useNavigate } from "@/lib/rr-compat";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { User, Mail, Phone, Lock, Store, ArrowRight, UserPlus } from "lucide-react";
import { authService } from "../../services/authService";
import { loginSuccess } from "../../store/authSlice";
import { ROLES } from "../../constants/roles";
import { useToast } from "../../components/common/Toast";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().default(ROLES.STORE_ADMIN),
});

export function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: ROLES.STORE_ADMIN,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.signup(data);
      dispatch(loginSuccess(res));
      toast.success("Registration Successful!", "Welcome to Zosh POS Enterprise.");
      navigate("/store/dashboard");
    } catch (err) {
      toast.error("Registration Failed", err.response?.data?.message || "Could not register account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Register New Merchant
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Create an enterprise account to manage your retail stores, branches, and point of sale.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              {...register("fullName")}
              placeholder="e.g. Rahul Sharma"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
          </div>
          {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Business Email *
          </label>
          <div className="relative">
            <Mail className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="email"
              {...register("email")}
              placeholder="e.g. admin@merchant.com"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Mobile Number (10 digits) *
          </label>
          <div className="relative">
            <Phone className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="tel"
              {...register("phone")}
              maxLength={10}
              placeholder="e.g. 9876543210"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
          </div>
          {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Security Password *
          </label>
          <div className="relative">
            <Lock className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="password"
              {...register("password")}
              placeholder="Minimum 6 characters"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
          </div>
          {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Account Role
          </label>
          <select
            {...register("role")}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none"
          >
            <option value={ROLES.STORE_ADMIN}>Store Owner / Admin</option>
            <option value={ROLES.BRANCH_ADMIN}>Branch Manager</option>
            <option value={ROLES.CASHIER}>Cashier</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md shadow-emerald-900/10 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Registering Store..." : (
            <>
              <UserPlus className="size-4" />
              <span>Create Merchant Account</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        Already registered?{" "}
        <Link
          to="/auth/login"
          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
        >
          Sign In here <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}

export default Register;
