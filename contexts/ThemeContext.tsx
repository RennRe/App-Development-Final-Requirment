/**
 * ThemeContext
 * Lets the user manually toggle between light and dark mode.
 * Wraps the whole app so every screen can read / change the theme.
 */

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

// What the context provides
type ThemeContextType = {
  isDark: boolean;                          // true = dark mode
  theme: typeof Colors.light;              // current color palette
  toggleTheme: () => void;                 // flip between light/dark
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component — wrap your app with this
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start with whatever the system preference is
  const systemScheme = useSystemColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  // Pick the right color palette based on isDark
  const theme = isDark ? Colors.dark : Colors.light;

  // Toggle function
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — use this in any component to access theme
export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }
  return context;
}
