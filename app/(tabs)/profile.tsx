/**
 * Profile Screen
 * Shows user info and stats only.
 * All settings have been moved to the Settings screen.
 * Tap the gear icon (top right) to open Settings.
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
import AnimatedScreen from '@/components/AnimatedScreen';

export default function ProfileScreen() {
  const { userName } = useAuth();
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const stats = [
    { label: 'Events Joined', value: '12' },
    { label: 'Total Spent', value: '₱15,400' },
    { label: 'Resibo Uploaded', value: '23' },
  ];

  // Quick-access links shown on profile (read-only info rows)
  const quickLinks = [
    { icon: 'calendar-outline' as const, label: 'My Events', color: Brand.teal },
    { icon: 'wallet-outline' as const, label: 'Payment History', color: Brand.teal },
    { icon: 'people-outline' as const, label: 'Friends / Grupo', color: Brand.teal },
  ];

  return (
    <AnimatedScreen>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.header, paddingTop: insets.top + 12 }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          {/* Gear icon → opens Settings */}
          <TouchableOpacity
            style={styles.gearButton}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Ionicons name="settings-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Avatar + name */}
          <View style={styles.profileSection}>
            <View style={[styles.bigAvatar, { backgroundColor: Brand.teal }]}>
              <Text style={styles.bigAvatarText}>{userName[0]}</Text>
            </View>
            <Text style={[styles.profileName, { color: theme.text }]}>{userName}</Text>
            <Text style={[styles.profilePhone, { color: theme.textSecondary }]}>
              +63 912 345 6789
            </Text>
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            {stats.map((stat, i) => (
              <View
                key={i}
                style={[
                  styles.statItem,
                  i > 0 && { borderLeftWidth: 1, borderLeftColor: theme.divider },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.tint }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Quick links */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>QUICK ACCESS</Text>
          {quickLinks.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.linkCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
              activeOpacity={0.7}
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIconWrap, { backgroundColor: theme.tint + '22' }]}>
                  <Ionicons name={item.icon} size={18} color={theme.tint} />
                </View>
                <Text style={[styles.linkText, { color: theme.text }]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}

          {/* Settings shortcut */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: Spacing.xl }]}>
            APP
          </Text>
          <TouchableOpacity
            style={[styles.linkCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/(tabs)/settings')}
            activeOpacity={0.7}
          >
            <View style={styles.linkLeft}>
              <View style={[styles.linkIconWrap, { backgroundColor: theme.tint + '22' }]}>
                <Ionicons name="settings-outline" size={18} color={theme.tint} />
              </View>
              <Text style={[styles.linkText, { color: theme.text }]}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </TouchableOpacity>

          {/* Branding footer */}
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
    </AnimatedScreen>
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
  headerTitle: { fontSize: 24, fontWeight: '800' },
  gearButton: { padding: 4 },

  // Scroll
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 60 },

  // Profile hero
  profileSection: { alignItems: 'center', marginBottom: Spacing.xxl },
  bigAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
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

  // Section label
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: Spacing.md },

  // Link rows
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  linkLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkIconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  linkText: { fontSize: 15, fontWeight: '600' },

  // Version
  versionRow: { alignItems: 'center', marginTop: Spacing.xxxl },
  versionLogo: { width: 28, height: 28, borderRadius: 6, marginBottom: 6 },
  version: { fontSize: 12 },
});
