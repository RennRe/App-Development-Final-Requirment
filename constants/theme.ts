/**
 * Tara! App Theme
 * Supports System/Light/Dark modes + 3 selectable color themes:
 *   - Default   (teal + orange — the original logo palette)
 *   - Dynamic   (purple + pink)
 *   - Green Apple (green + red)
 */

import { Platform } from 'react-native';

// ─── Shared brand colors ──────────────────────────────────────────────────────
export const Brand = {
  gold: '#E5A100',
  goldLight: '#F5C842',
  goldDark: '#C48900',
  navy: '#1B2838',
  cream: '#FFF8E7',
  creamDark: '#F5ECD7',
  white: '#FFFFFF',
  black: '#000000',
  green: '#2ECC71',
  red: '#E74C3C',
  gray: '#687076',
  grayLight: '#A0A7AD',
  grayDark: '#3A3F44',
  teal: '#3ABFAD',
  tealDark: '#2A9E8F',
  orange: '#E8845A',
  orangeLight: '#F4A57C',
};

// ─── Theme palette definitions ────────────────────────────────────────────────
// Each theme has a primary color (tabs, accents) and a secondary color (CTAs).
export const THEME_PALETTES = {
  Default: {
    label: 'Default',
    primary: '#3ABFAD',   // teal
    secondary: '#E8845A', // orange
    previewDark: { bar: '#3ABFAD', accent: '#E8845A' },
  },
  Dynamic: {
    label: 'Dynamic',
    primary: '#8B5CF6',   // purple
    secondary: '#EC4899', // pink
    previewDark: { bar: '#8B5CF6', accent: '#EC4899' },
  },
  GreenApple: {
    label: 'Green Apple',
    primary: '#22C55E',   // green
    secondary: '#EF4444', // red
    previewDark: { bar: '#22C55E', accent: '#EF4444' },
  },
} as const;

export type ThemeName = keyof typeof THEME_PALETTES;

// ─── Build a full color scheme from a palette + light/dark mode ───────────────
function buildColors(palette: typeof THEME_PALETTES[ThemeName], dark: boolean) {
  const { primary, secondary } = palette;
  if (dark) {
    return {
      text: '#ECEDEE',
      textSecondary: '#9BA1A6',
      background: '#0D1117',
      surface: '#161B22',
      card: '#1C2128',
      cardBorder: '#2D333B',
      tint: primary,
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
      tabIconSelected: primary,
      tabBar: '#161B22',
      header: '#161B22',
      accent: secondary,
      positive: '#3DDC84',
      negative: '#FF6B6B',
      divider: '#2D333B',
      inputBg: '#1C2128',
      inputBorder: '#2D333B',
      statusBar: 'light' as const,
    };
  }
  return {
    text: '#1B2838',
    textSecondary: '#687076',
    background: '#FFF8E7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: '#F0E6D0',
    tint: primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primary,
    tabBar: '#FFFFFF',
    header: Brand.cream,
    accent: secondary,
    positive: Brand.green,
    negative: Brand.red,
    divider: '#F0E6D0',
    inputBg: '#F8F3E8',
    inputBorder: '#E0D5C0',
    statusBar: 'dark' as const,
  };
}

// Pre-built light + dark variants for the default palette
// (kept for backward compatibility in places that import Colors directly)
export const Colors = {
  light: buildColors(THEME_PALETTES.Default, false),
  dark: buildColors(THEME_PALETTES.Default, true),
};

export { buildColors };

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
