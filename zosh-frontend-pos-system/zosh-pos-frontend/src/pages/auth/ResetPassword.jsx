import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "../../components/common/Toast";

export function ResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password Reset!", "You can now log in with your new password.");
      navigate("/auth/login");
    }, 700);
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition"
        >
          <ArrowLeft className="size-3.5" /> Back to login
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Create New Password
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Choose a secure password for your merchant access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            New Password *
          </label>
          <div className="relative">
            <Lock className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Confirm New Password *
          </label>
          <div className="relative">
            <Lock className="size-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md shadow-emerald-900/10 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Updating..." : (
            <>
              <CheckCircle2 className="size-4" />
              <span>Update Password & Log In</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
