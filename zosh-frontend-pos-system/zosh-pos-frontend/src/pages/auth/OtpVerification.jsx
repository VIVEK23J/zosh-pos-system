import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "../../components/common/Toast";

export function OtpVerification() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "merchant@zoshpos.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (val, index) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Incomplete Code", "Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Verified!", "Code verified successfully.");
      navigate(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${code}`);
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
          Verify Security Code
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Enter the 6-digit verification code sent to <strong className="text-gray-900 dark:text-white">{email}</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="size-12 text-center text-lg font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length < 6}
          className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md shadow-emerald-900/10 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Verifying..." : (
            <>
              <CheckCircle2 className="size-4" />
              <span>Verify & Continue</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        Didn't receive code?{" "}
        <button
          type="button"
          onClick={() => toast.info("Resent", "New verification code has been dispatched.")}
          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default OtpVerification;
