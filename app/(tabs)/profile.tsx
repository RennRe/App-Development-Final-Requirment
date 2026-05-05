/**
 * Profile Screen
 * Shows user info, theme toggle, and sign-out.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { userName, signOut } = useAuth();
  const { theme, isDark, toggleTheme } = useAppTheme();

  // Placeholder stats
  const stats = [
    { label: 'Events Joined', value: '12' },
    { label: 'Total Spent', value: '₱15,400' },
    { label: 'Resibo Uploaded', value: '23' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#161B22' : Brand.cream }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + name */}
        <View style={styles.profileSection}>
          <View style={[styles.bigAvatar, { backgroundColor: Brand.gold }]}>
            <Text style={styles.bigAvatarText}>{userName[0]}</Text>
          </View>
          <Text style={[styles.profileName, { color: theme.text }]}>{userName}</Text>
          <Text style={[styles.profilePhone, { color: theme.textSecondary }]}>+63 912 345 6789</Text>
        </View>

        {/* Stats row */}
        <View style={[styles.statsRow, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          {stats.map((stat, i) => (
            <View key={i} style={[styles.statItem, i > 0 && { borderLeftWidth: 1, borderLeftColor: theme.divider }]}>
              <Text style={[styles.statValue, { color: Brand.gold }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SETTINGS</Text>

        {/* Dark mode toggle */}
        <View style={[styles.settingCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.settingLeft}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={Brand.gold} />
            <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D0D0D0', true: Brand.goldDark }}
            thumbColor={isDark ? Brand.gold : '#fff'}
          />
        </View>

        {/* Other settings */}
        {[
          { icon: 'notifications-outline' as const, label: 'Notifications' },
          { icon: 'language-outline' as const, label: 'Language / Wika' },
          { icon: 'shield-checkmark-outline' as const, label: 'Privacy' },
          { icon: 'help-circle-outline' as const, label: 'Help & Support' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.settingCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={item.icon} size={22} color={Brand.gold} />
              <Text style={[styles.settingText, { color: theme.text }]}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}

        {/* Sign out */}
        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: Brand.red }]}
          onPress={signOut}
        >
          <Ionicons name="log-out-outline" size={20} color={Brand.red} />
          <Text style={[styles.signOutText, { color: Brand.red }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.textSecondary }]}>
          Tara! v1.0.0 — Made with 💛 in 🇵🇭
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: Spacing.xl,
  },
  headerTitle: { fontSize: 24, fontWeight: '800' },

  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },

  // Profile
  profileSection: { alignItems: 'center', marginVertical: Spacing.xxl },
  bigAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bigAvatarText: { color: '#fff', fontSize: 36, fontWeight: '800' },
  profileName: { fontSize: 22, fontWeight: '800' },
  profilePhone: { fontSize: 14, marginTop: 4 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 4 },

  // Settings
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 15, fontWeight: '600' },

  // Sign out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingVertical: 14,
    marginTop: Spacing.xxl,
  },
  signOutText: { fontSize: 16, fontWeight: '700' },

  version: { textAlign: 'center', fontSize: 12, marginTop: Spacing.lg },
});
