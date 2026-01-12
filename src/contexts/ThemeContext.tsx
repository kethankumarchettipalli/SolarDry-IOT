import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const { user } = useAuth();

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Load theme from Firebase when user logs in
  useEffect(() => {
    const loadTheme = async () => {
      if (user?.uid && database) {
        try {
          const themeRef = ref(database, `users/${user.uid}/theme`);
          const snapshot = await get(themeRef);
          if (snapshot.exists()) {
            const savedTheme = snapshot.val() as Theme;
            if (savedTheme === "light" || savedTheme === "dark") {
              setThemeState(savedTheme);
            }
          }
        } catch (error) {
          console.warn("Could not load theme preference:", error);
        }
      }
    };

    loadTheme();
  }, [user?.uid]);

  // Save theme to Firebase and update local state
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);

    if (user?.uid && database) {
      try {
        const themeRef = ref(database, `users/${user.uid}/theme`);
        await set(themeRef, newTheme);
      } catch (error) {
        console.warn("Could not save theme preference:", error);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
