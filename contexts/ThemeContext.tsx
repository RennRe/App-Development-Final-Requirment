/**
 * ThemeContext
 * Manages two separate settings:
 *   1. colorMode — "system" | "light" | "dark"
 *   2. themeName — which color palette to use ("Default" | "Dynamic" | "GreenApple")
 *
 * Every screen can read `theme` (the full color object) and the setters.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  THEME_PALETTES,
  buildColors,
  type ThemeName,
} from '@/constants/theme';

// The three brightness modes (matches the image's toggle)
export type ColorMode = 'system' | 'light' | 'dark';

// Everything the context exposes
type ThemeContextType = {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  isDark: boolean;
  theme: ReturnType<typeof buildColors>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@appearance_settings';

// Provider — wrap your entire app with this
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme(); // 'light' | 'dark' | null

  // Which brightness mode the user has selected
  const [colorMode, setColorModeState] = useState<ColorMode>('system');

  // Which color palette the user has selected
  const [themeName, setThemeNameState] = useState<ThemeName>('Default');

  useEffect(() => {
    // Load from storage on mount
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.colorMode) setColorModeState(parsed.colorMode);
          if (parsed.themeName) setThemeNameState(parsed.themeName);
        }
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      }
    };
    loadSettings();
  }, []);

  const setColorMode = async (mode: ColorMode) => {
    setColorModeState(mode);
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      parsed.colorMode = mode;
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to save color mode:', e);
    }
  };

  const setThemeName = async (name: ThemeName) => {
    setThemeNameState(name);
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      parsed.themeName = name;
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to save theme name:', e);
    }
  };

  // Calculate whether we're actually in dark mode right now
  const isDark =
    colorMode === 'dark' ||
    (colorMode === 'system' && systemScheme === 'dark');

  // Build the full color object from the selected palette + dark flag
  const theme = buildColors(THEME_PALETTES[themeName], isDark);

  return (
    <ThemeContext.Provider
      value={{ colorMode, setColorMode, themeName, setThemeName, isDark, theme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — call this in any component to access the theme
export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }
  return context;
}
