import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("pos_theme");
      if (saved === "dark" || saved === "light" || saved === "system") {
        return saved;
      }
      return "light";
    } catch {
      return "light";
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (targetTheme) => {
      const active =
        targetTheme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : targetTheme;

      setResolvedTheme(active);

      if (active === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);

    try {
      localStorage.setItem("pos_theme", theme);
    } catch {
      // ignore localstorage errors
    }

    // Listener for system preference changes if in system mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e) => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (resolvedTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isDark: resolvedTheme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
