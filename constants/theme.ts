/**
 * Tara! App Theme
 * Filipino-inspired warm colors with gold/amber palette
 * Supports light and dark modes
 */

import { Platform } from 'react-native';

// Brand Colors
export const Brand = {
  gold: '#E5A100',        // Primary CTA / buttons
  goldLight: '#F5C842',   // Lighter accent
  goldDark: '#C48900',    // Pressed state
  navy: '#1B2838',        // Dark header / text
  cream: '#FFF8E7',       // Light background
  creamDark: '#F5ECD7',   // Light card bg
  white: '#FFFFFF',
  black: '#000000',
  green: '#2ECC71',       // Positive balance
  red: '#E74C3C',         // Negative balance / owe
  gray: '#687076',
  grayLight: '#A0A7AD',
  grayDark: '#3A3F44',
};

export const Colors = {
  light: {
    text: '#1B2838',
    textSecondary: '#687076',
    background: '#FFF8E7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: '#F0E6D0',
    tint: Brand.gold,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: Brand.gold,
    tabBar: '#FFFFFF',
    header: Brand.cream,
    accent: Brand.gold,
    positive: Brand.green,
    negative: Brand.red,
    divider: '#F0E6D0',
    inputBg: '#F8F3E8',
    inputBorder: '#E0D5C0',
    statusBar: 'dark' as const,
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0D1117',
    surface: '#161B22',
    card: '#1C2128',
    cardBorder: '#2D333B',
    tint: Brand.goldLight,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: Brand.goldLight,
    tabBar: '#161B22',
    header: '#161B22',
    accent: Brand.goldLight,
    positive: '#3DDC84',
    negative: '#FF6B6B',
    divider: '#2D333B',
    inputBg: '#1C2128',
    inputBorder: '#2D333B',
    statusBar: 'light' as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radius scale
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};
