import { useEffect, useRef, useState } from "react";

// Animates the numeric part of a value like "₹12,340.50" or "42" from 0.
export function CountUp({ value, duration = 900 }) {
  const str = value == null ? "" : String(value);
  const match = str.match(/-?[\d,]+(\.\d+)?/);
  const [display, setDisplay] = useState(match ? str.replace(match[0], "0") : str);
  const frame = useRef(0);

  useEffect(() => {
    if (!match) {
      setDisplay(str);
      return;
    }
    const raw = match[0];
    const target = Number(raw.replace(/,/g, ""));
    const decimals = match[1] ? match[1].length - 1 : 0;
    const useCommas = raw.includes(",");
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const n = target * eased;
      const formatted = useCommas
        ? n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : n.toFixed(decimals);
      setDisplay(str.replace(raw, formatted));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [str]);

  return <span className="tabular-nums">{display}</span>;
}

export default CountUp;
