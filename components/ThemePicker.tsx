/**
 * ThemePicker
 * A visual settings widget for the Profile screen.
 * - Top row: System / Light / Dark toggle (like tabs)
 * - Bottom row: Three theme preview cards (Default, Dynamic, Green Apple)
 *
 * Looks similar to the image reference the user shared.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, type ColorMode } from '@/contexts/ThemeContext';
import { THEME_PALETTES, type ThemeName, Spacing, Radius } from '@/constants/theme';

// ─── The three brightness mode options ───────────────────────────────────────
const COLOR_MODES: { label: string; value: ColorMode; icon: string }[] = [
  { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
  { label: 'Light',  value: 'light',  icon: 'sunny-outline' },
  { label: 'Dark',   value: 'dark',   icon: 'moon-outline' },
];

// ─── The three theme options ──────────────────────────────────────────────────
const THEME_OPTIONS: { name: ThemeName; label: string }[] = [
  { name: 'Default',    label: 'Default' },
  { name: 'Dynamic',    label: 'Dynamic' },
  { name: 'GreenApple', label: 'Green Apple' },
];

// A mini phone mockup that previews a theme's colors
function ThemePreviewCard({
  name,
  isSelected,
  onPress,
}: {
  name: ThemeName;
  isSelected: boolean;
  onPress: () => void;
}) {
  const palette = THEME_PALETTES[name];

  return (
    <TouchableOpacity
      style={[
        styles.previewCard,
        isSelected && { borderColor: palette.primary, borderWidth: 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Checkmark badge on the selected card */}
      {isSelected && (
        <View style={[styles.checkBadge, { backgroundColor: palette.primary }]}>
          <Ionicons name="checkmark" size={10} color="#fff" />
        </View>
      )}

      {/* Mini phone body */}
      <View style={styles.mockPhone}>
        {/* Status bar strip */}
        <View style={[styles.mockBar, { backgroundColor: palette.primary }]} />

        {/* Body area with accent dot */}
        <View style={styles.mockBody}>
          <View style={[styles.mockDot, { backgroundColor: palette.secondary }]} />
          <View style={[styles.mockLine, { backgroundColor: '#444' }]} />
          <View style={[styles.mockLine, { backgroundColor: '#333', width: '60%' }]} />
        </View>

        {/* Bottom accent bar */}
        <View style={[styles.mockFooter, { backgroundColor: palette.primary + '44' }]} />
      </View>

      {/* Theme name below the card */}
      <Text style={[styles.previewLabel, isSelected && { color: palette.primary }]}>
        {THEME_PALETTES[name].label}
      </Text>
    </TouchableOpacity>
  );
}

// The main exported component
export default function ThemePicker() {
  const { theme, isDark, colorMode, setColorMode, themeName, setThemeName } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
      {/* ── Brightness toggle ── */}
      <View style={[styles.modeToggle, { backgroundColor: isDark ? '#1C2128' : '#F0E6D0' }]}>
        {COLOR_MODES.map((mode) => {
          const active = colorMode === mode.value;
          return (
            <TouchableOpacity
              key={mode.value}
              style={[
                styles.modeButton,
                active && { backgroundColor: isDark ? '#2D333B' : '#FFFFFF' },
              ]}
              onPress={() => setColorMode(mode.value)}
              activeOpacity={0.7}
            >
              {active && (
                <Ionicons
                  name="checkmark"
                  size={12}
                  color={theme.tabIconSelected}
                  style={{ marginRight: 3 }}
                />
              )}
              <Text
                style={[
                  styles.modeLabel,
                  {
                    color: active ? theme.text : theme.textSecondary,
                    fontWeight: active ? '700' : '500',
                  },
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Theme preview cards ── */}
      <View style={styles.previewRow}>
        {THEME_OPTIONS.map(({ name }) => (
          <ThemePreviewCard
            key={name}
            name={name}
            isSelected={themeName === name}
            onPress={() => setThemeName(name)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  // ── Brightness toggle ──
  modeToggle: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 3,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: Radius.full,
    gap: 2,
  },
  modeLabel: {
    fontSize: 13,
  },

  // ── Theme preview cards ──
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  previewCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 6,
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  // Mini phone mockup
  mockPhone: {
    width: 60,
    height: 90,
    backgroundColor: '#1A1F27',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
  },
  mockBar: {
    height: 12,
    width: '100%',
  },
  mockBody: {
    flex: 1,
    padding: 6,
    gap: 4,
    justifyContent: 'center',
  },
  mockDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: 4,
  },
  mockLine: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  mockFooter: {
    height: 10,
  },

  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9BA1A6',
    marginTop: 2,
  },
});
