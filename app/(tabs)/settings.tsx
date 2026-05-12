/**
 * Settings Screen
 * Accessible from the Profile tab via the gear icon.
 * Contains all app settings:
 *   - Appearance (theme picker)
 *   - Preferences (notifications, language)
 *   - Legal (privacy, help)
 *   - Account (sign out)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemePicker from '@/components/ThemePicker';

// A reusable row item for settings
function SettingRow({
  icon,
  label,
  iconBg,
  iconColor,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  iconBg: string;
  iconColor: string;
  onPress?: () => void;
}) {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.settingCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={[styles.settingText, { color: theme.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: theme.header, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        {/* Spacer to center the title */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ── APPEARANCE ─────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>APPEARANCE</Text>
        <ThemePicker />

        {/* ── PREFERENCES ────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>PREFERENCES</Text>

        <SettingRow
          icon="notifications-outline"
          label="Notifications"
          iconBg={isDark ? '#1C2A28' : '#E8F8F5'}
          iconColor={Brand.teal}
        />
        <SettingRow
          icon="language-outline"
          label="Language / Wika"
          iconBg={isDark ? '#1C2A28' : '#E8F8F5'}
          iconColor={Brand.teal}
        />

        {/* ── LEGAL ──────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>LEGAL</Text>

        <SettingRow
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          iconBg={isDark ? '#1C2A28' : '#E8F8F5'}
          iconColor={Brand.teal}
        />
        <SettingRow
          icon="help-circle-outline"
          label="Help & Support"
          iconBg={isDark ? '#1C2A28' : '#E8F8F5'}
          iconColor={Brand.teal}
        />

        {/* ── ACCOUNT ────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ACCOUNT</Text>

        {/* Sign out — red destructive action */}
        <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
          onPress={signOut}
          activeOpacity={0.7}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconWrap, { backgroundColor: isDark ? '#2A1818' : '#FEE8E8' }]}>
              <Ionicons name="log-out-outline" size={18} color={Brand.red} />
            </View>
            <Text style={[styles.settingText, { color: Brand.red }]}>Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* App version + branding at the bottom */}
        <View style={styles.versionRow}>
          <Image
            source={require('@/assets/images/Logo.png')}
            style={styles.versionLogo}
            resizeMode="contain"
          />
          <Text style={[styles.version, { color: theme.textSecondary }]}>Tara! v1.0.0</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  backButton: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 20, fontWeight: '800' },

  // Scroll area
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 60 },

  // Section label
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.xxl,
  },

  // Setting row card
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: { fontSize: 15, fontWeight: '600' },

  // Version
  versionRow: { alignItems: 'center', marginTop: Spacing.xxxl },
  versionLogo: { width: 28, height: 28, borderRadius: 6, marginBottom: 6 },
  version: { fontSize: 12, textAlign: 'center' },
});
