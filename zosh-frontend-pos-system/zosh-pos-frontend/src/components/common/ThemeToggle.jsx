import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "@/components/ui/button";

/**
 * Reusable Theme Toggle Component
 *
 * Variants:
 * - "button": Compact button for headers/toolbars (default)
 * - "segmented": 3-way toggle (Light / Dark / System) for Settings pages
 * - "floating": Fixed floating button in bottom corner
 */
export function ThemeToggle({ variant = "button", className = "" }) {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            theme === "light"
              ? "bg-white text-emerald-800 shadow-sm"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Sun className="size-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            theme === "dark"
              ? "bg-gray-900 text-emerald-400 shadow-sm"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Moon className="size-3.5 text-blue-400" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            theme === "system"
              ? "bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Laptop className="size-3.5 text-gray-500" />
          <span>System</span>
        </button>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`fixed bottom-5 right-5 z-50 p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl hover:scale-105 active:scale-95 transition-all text-gray-700 dark:text-gray-200 ${className}`}
        title={`Current: ${isDark ? "Dark" : "Light"} mode. Click to toggle.`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="size-5 text-amber-400 fill-amber-400/20" />
        ) : (
          <Moon className="size-5 text-slate-700 fill-slate-700/20" />
        )}
      </button>
    );
  }

  // Default header button variant
  return (
    <Button variant="ghost" size="icon"
      type="button"
      onClick={toggleTheme}
      className={`text-muted-foreground ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="size-4" />
        </>
      ) : (
        <>
          <Moon className="size-4" />
        </>
      )}
    </Button>
  );
}

export default ThemeToggle;
