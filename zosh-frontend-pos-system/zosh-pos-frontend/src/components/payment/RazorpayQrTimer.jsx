import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Clock,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { paymentService } from "../../services/paymentService";

// Web Audio API chime for real payment confirmation
function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Ignore audio policy errors
  }
}

export function RazorpayQrTimer({
  amount,
  orderDto,
  customer,
  posRef,
  onPaymentSuccess,
  onError,
}) {
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Generating Razorpay Dynamic QR...");

  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const isPaidRef = useRef(false);

  // Initialize Dynamic QR Code
  const initQr = async () => {
    setLoading(true);
    setIsExpired(false);
    isPaidRef.current = false;
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);

    try {
      setStatusMessage("Generating secure Razorpay UPI Dynamic QR...");
      const data = await paymentService.createDynamicQr({
        amount,
        timerSeconds: 300,
        receipt: posRef,
        customer,
      });

      setQrData(data);
      const secs = data.timerSeconds || 300;
      setTotalSeconds(secs);
      setTimeLeft(secs);
      setStatusMessage("Scan QR with Google Pay, PhonePe, Paytm or any UPI app");
      setLoading(false);
    } catch (err) {
      console.error("Failed to generate dynamic QR:", err);
      setLoading(false);
      onError?.(err?.message || "Failed to generate dynamic Razorpay QR.");
    }
  };

  useEffect(() => {
    initQr();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, [amount, posRef]);

  // Real Countdown Timer
  useEffect(() => {
    if (loading || !qrData || isExpired) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          setIsExpired(true);
          setStatusMessage("QR Code Expired. Please tap Reset Timer to generate a new QR.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, qrData, isExpired]);

  // Real Payment Status Polling via Gateway API
  useEffect(() => {
    if (loading || !qrData || isExpired) return;

    setIsPolling(true);
    pollRef.current = setInterval(async () => {
      if (isPaidRef.current) return;

      try {
        const res = await paymentService.checkQrStatus(qrData.qrId);
        if (res.status === "PAID") {
          isPaidRef.current = true;
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setIsPolling(false);
          setStatusMessage("Payment Verified Successfully!");
          playSuccessChime();

          onPaymentSuccess?.({
            paymentRef: res.paymentId || `pay_rzp_qr_${Date.now()}`,
            qrId: qrData.qrId,
            order: res.order,
          });
        } else if (res.status === "EXPIRED") {
          setIsExpired(true);
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
        }
      } catch (err) {
        console.debug("QR poll check:", err);
      }
    }, 2500);

    return () => {
      clearInterval(pollRef.current);
      setIsPolling(false);
    };
  }, [loading, qrData, isExpired]);

  const handleCopyUpi = () => {
    if (qrData?.qrString) {
      navigator.clipboard.writeText(qrData.qrString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));
  const isUrgent = timeLeft < 60;
  const isWarning = timeLeft < 120 && !isUrgent;

  const qrImageSrc =
    qrData?.imageUrl ||
    (qrData?.qrString
      ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
          qrData.qrString
        )}&margin=4`
      : null);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
      {/* Header with Title & Live Timer */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <QrCode size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              Razorpay Dynamic QR
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                Auto-Settle
              </span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Customer scans on their phone, register auto-completes order
            </p>
          </div>
        </div>

        {/* Live Countdown Badge */}
        {!loading && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-colors ${
              isExpired
                ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                : isUrgent
                ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 animate-pulse"
                : isWarning
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            }`}
          >
            <Clock size={13} className={!isExpired && isPolling ? "animate-spin" : ""} />
            <span>{isExpired ? "EXPIRED" : formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {!loading && !isExpired && (
        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full transition-all duration-1000 rounded-full ${
              isUrgent ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Center QR Display */}
      <div className="my-5 flex flex-col items-center justify-center">
        {loading ? (
          <div className="w-52 h-52 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-3 bg-gray-50/50 dark:bg-gray-800/40">
            <RefreshCw size={28} className="animate-spin text-emerald-600" />
            <span className="text-xs text-gray-500">Generating dynamic QR...</span>
          </div>
        ) : isExpired ? (
          <div className="w-52 h-52 rounded-xl border-2 border-dashed border-red-300 dark:border-red-800 flex flex-col items-center justify-center gap-2 bg-red-50/40 dark:bg-red-950/20 p-4 text-center">
            <AlertCircle size={36} className="text-red-500" />
            <strong className="text-xs font-bold text-red-700 dark:text-red-300">
              QR Code Expired
            </strong>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Timer reached zero. Tap below to generate a new QR.
            </p>
            <button
              type="button"
              onClick={initQr}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
            >
              <RefreshCw size={13} />
              Reset & Regenerate
            </button>
          </div>
        ) : (
          <div className="relative group">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 dark:border-gray-600 shadow-md">
              {qrImageSrc ? (
                <img
                  src={qrImageSrc}
                  alt="Razorpay Dynamic UPI QR"
                  className="w-48 h-48 object-contain rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                  <QrCode size={64} className="text-gray-400" />
                </div>
              )}
            </div>

            {isPolling && (
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </div>
            )}
          </div>
        )}

        {/* Amount & Status */}
        <div className="mt-3 text-center">
          <div className="text-xl font-extrabold text-gray-900 dark:text-white">
            ₹{Number(amount).toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-xs">
            {statusMessage}
          </p>
        </div>

        {/* Accepted Apps */}
        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 dark:text-gray-400">
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-medium">Google Pay</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-medium">PhonePe</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-medium">Paytm</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-medium">BHIM</span>
        </div>
      </div>

      {/* Control Actions */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <button
          type="button"
          onClick={initQr}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Regenerate QR</span>
        </button>

        {qrData?.qrString && (
          <button
            type="button"
            onClick={handleCopyUpi}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition"
            title="Copy UPI Intent URI"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy UPI URI"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default RazorpayQrTimer;
