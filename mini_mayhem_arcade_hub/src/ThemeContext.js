import React, { createContext, useContext, useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * A React context for dark/light theme state and toggling.
 * Provides `darkMode`, `toggleTheme`, and `setDarkMode` app-wide.
 */
const ThemeContext = createContext({
  darkMode: true,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

/**
 * ThemeProvider synchronizes the dark/light theme with localStorage and <body> class.
 * Encapsulates all children so the context is available app-wide.
 */
// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const local = window.localStorage.getItem("mm-arcade-theme");
    return local ? JSON.parse(local) : true;
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
    window.localStorage.setItem("mm-arcade-theme", JSON.stringify(darkMode));
  }, [darkMode]);

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setDarkMode((dm) => !dm);
  }

  const ctx = {
    darkMode,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={ctx}>
      {children}
    </ThemeContext.Provider>
  );
}

// PUBLIC_INTERFACE
/**
 * Hook for accessing theme context (darkMode, toggleTheme, etc).
 */
export function useTheme() {
  return useContext(ThemeContext);
}
