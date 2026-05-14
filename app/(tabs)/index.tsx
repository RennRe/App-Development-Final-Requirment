/**
 * Home Dashboard — "Kaganapan"
 * Modernized UI: gradient hero header, floating event cards with shadows,
 * and a cleaner layout inspired by modern fintech/travel apps.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import AnimatedScreen from '@/components/AnimatedScreen';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Placeholder data ─────────────────────────────────────────────────────────
const ACTIVE_EVENTS = [
  {
    id: '1',
    name: 'Puerto Galera 2026',
    icon: 'sunny' as const,
    iconColor: Brand.orange,
    date: 'May 15 — 8:00 AM',
    totalAmbagan: 4500,
    members: ['J', 'K', 'M'],
    extraMembers: 2,
    // Gradient colors per event card for variety
    gradientTop: '#3ABFAD',
    gradientBot: '#2A9E8F',
  },
  {
    id: '2',
    name: 'Sagada Hike 2026',
    icon: 'trail-sign' as const,
    iconColor: '#FFF',
    date: 'Jun 20 — 5:00 AM',
    totalAmbagan: 8200,
    members: ['J', 'A', 'R'],
    extraMembers: 4,
    gradientTop: '#E8845A',
    gradientBot: '#C86840',
  },
];

const PAST_EVENTS = [
  { id: '3', name: 'Inuman kina Mark', icon: 'beer' as const, status: 'Settle Up!' },
  { id: '4', name: 'Tagaytay Roadtrip', icon: 'car' as const, status: 'Settled' },
];

const AVATAR_COLORS = ['#E5A100', '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6'];

export default function HomeScreen() {
  const { userName } = useAuth();
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openEvent = (eventId: string) => {
    router.push(`/(tabs)/event?id=${eventId}`);
  };

  return (
    <AnimatedScreen>
      <View style={[styles.container, { backgroundColor: theme.background }]}>

        {/* ── Header ──────────────────────────────────────── */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDark ? theme.header : '#FFFFFF',
              paddingTop: insets.top + 12,
              borderBottomColor: theme.divider,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <View style={styles.greetingRow}>
              <Image
                source={require('@/assets/images/Logo.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <View>
                <Text style={[styles.greeting, { color: theme.text }]}>
                  Hey, {userName}! 👋
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Saan ang next na lakad?
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Notification bell with badge */}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: isDark ? '#1C2128' : '#F0F0F0' }]}
              onPress={() => router.push('/(tabs)/notifications')}
            >
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>

            {/* Avatar button */}
            <TouchableOpacity
              style={[styles.avatar, { backgroundColor: Brand.teal }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.avatarText}>{userName[0]}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Quick Actions ─────────────────────────────── */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: isDark ? '#1C2A28' : '#E8F8F5', borderColor: isDark ? '#2D3E3B' : '#C8EEE8' },
              ]}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: Brand.teal }]}>
                <Ionicons name="add" size={22} color="#FFF" />
              </View>
              <Text style={[styles.actionText, { color: isDark ? Brand.teal : Brand.tealDark }]}>
                Create Event
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: isDark ? '#2A2518' : '#FFF3E0', borderColor: isDark ? '#3E3020' : '#FFE0B8' },
              ]}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: Brand.orange }]}>
                <Ionicons name="qr-code" size={22} color="#FFF" />
              </View>
              <Text style={[styles.actionText, { color: isDark ? Brand.orange : '#C86840' }]}>
                Join by QR
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Active Events ─────────────────────────────── */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            ACTIVE NA LAKAD
          </Text>

          <FlatList
            data={ACTIVE_EVENTS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.eventCard, { backgroundColor: item.gradientTop }]}
                onPress={() => openEvent(item.id)}
                activeOpacity={0.85}
              >
                {/* Icon in a semi-transparent circle */}
                <View style={styles.eventIconWrap}>
                  <Ionicons name={item.icon} size={22} color="#FFF" />
                </View>

                <Text style={styles.eventName}>{item.name}</Text>

                <View style={styles.eventRow}>
                  <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.eventDetail}>{item.date}</Text>
                </View>

                <View style={styles.eventRow}>
                  <Ionicons name="wallet-outline" size={13} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.eventDetail}>
                    ₱{item.totalAmbagan.toLocaleString()} total
                  </Text>
                </View>

                {/* Member avatars */}
                <View style={styles.membersRow}>
                  <View style={styles.avatarGroup}>
                    {item.members.map((m, i) => (
                      <View
                        key={i}
                        style={[
                          styles.miniAvatar,
                          { backgroundColor: AVATAR_COLORS[i], marginLeft: i > 0 ? -8 : 0 },
                        ]}
                      >
                        <Text style={styles.miniAvatarText}>{m}</Text>
                      </View>
                    ))}
                    {item.extraMembers > 0 && (
                      <Text style={styles.extraMembers}>+{item.extraMembers}</Text>
                    )}
                  </View>
                </View>

                {/* Bottom-right arrow */}
                <View style={styles.eventArrow}>
                  <Ionicons name="arrow-forward-circle" size={24} color="rgba(255,255,255,0.7)" />
                </View>
              </TouchableOpacity>
            )}
          />

          {/* ── Past Events ───────────────────────────────── */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            TAPOS NA (Past Events)
          </Text>

          {PAST_EVENTS.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.pastCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
              activeOpacity={0.75}
            >
              <View style={styles.pastLeft}>
                <View
                  style={[
                    styles.pastIconWrap,
                    { backgroundColor: isDark ? '#1C2128' : '#F5F5F5' },
                  ]}
                >
                  <Ionicons name={event.icon} size={18} color={Brand.teal} />
                </View>
                <View style={styles.pastInfo}>
                  <Text style={[styles.pastName, { color: theme.text }]}>{event.name}</Text>
                  <Text
                    style={[
                      styles.pastStatus,
                      { color: event.status === 'Settled' ? Brand.green : Brand.orange },
                    ]}
                  >
                    {event.status}
                  </Text>
                </View>
              </View>

              {event.status !== 'Settled' ? (
                <TouchableOpacity
                  style={[styles.settleButton, { backgroundColor: Brand.orange }]}
                >
                  <Text style={styles.settleText}>Settle Up</Text>
                </TouchableOpacity>
              ) : (
                <Ionicons name="checkmark-circle" size={24} color={Brand.green} />
              )}
            </TouchableOpacity>
          ))}

        </ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Header ──────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerLeft: { flex: 1 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLogo: { width: 42, height: 42, borderRadius: 12 },
  greeting: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Brand.red,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  // ── Scroll ───────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },

  // ── Quick Actions ────────────────────────────────────
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: Spacing.xxl },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    gap: 10,
  },
  actionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { fontSize: 14, fontWeight: '700' },

  // ── Section Label ────────────────────────────────────
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: Spacing.md,
  },

  // ── Active Event Cards ───────────────────────────────
  eventList: { gap: 14, paddingBottom: Spacing.xxl },
  eventCard: {
    width: 230,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: 8,
    // Card shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  eventIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventName: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventDetail: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  membersRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  avatarGroup: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  miniAvatarText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  extraMembers: { fontSize: 12, marginLeft: 6, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  eventArrow: { position: 'absolute', bottom: 12, right: 12 },

  // ── Past Events ──────────────────────────────────────
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pastLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  pastIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastInfo: { flex: 1 },
  pastName: { fontSize: 14, fontWeight: '600' },
  pastStatus: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  settleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
  },
  settleText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
