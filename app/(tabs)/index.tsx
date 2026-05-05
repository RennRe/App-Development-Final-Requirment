/**
 * Home Dashboard — "Kaganapan"
 * The main hub showing active + past events.
 * Matches the 3rd mockup: greeting, Create Event, Join by QR, event cards.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

// ─── Placeholder data ────────────────────────────────────
const ACTIVE_EVENTS = [
  {
    id: '1',
    name: 'Puerto Galera 2026',
    emoji: '🏖️',
    date: 'May 15 (Filipino Time: 8AM)',
    totalAmbagan: 4500,
    members: ['J', 'K', 'M'],
    extraMembers: 2,
  },
  {
    id: '2',
    name: 'Sagada Hike 2026',
    emoji: '⛰️',
    date: 'Jun 20 (Filipino Time: 5AM)',
    totalAmbagan: 8200,
    members: ['J', 'A', 'R'],
    extraMembers: 4,
  },
];

const PAST_EVENTS = [
  { id: '3', name: 'Inuman kina Mark', emoji: '🍻', status: 'Settle Up!' },
  { id: '4', name: 'Tagaytay Roadtrip', emoji: '🚌', status: 'Settled' },
];

// ─── Avatar colors for placeholder circles ───────────────
const AVATAR_COLORS = ['#E5A100', '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6'];

export default function HomeScreen() {
  const { userName, signOut } = useAuth();
  const { theme, isDark, toggleTheme } = useAppTheme();
  const router = useRouter();

  // Navigate into an event (goes to the event detail with tabs)
  const openEvent = (eventId: string) => {
    router.push(`/(tabs)/event?id=${eventId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Uy, {userName}! 🌊
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Saan ang next na lakad natin?
          </Text>
        </View>
        <View style={styles.headerRight}>
          {/* Theme toggle */}
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={theme.text} />
          </TouchableOpacity>
          {/* Notification bell */}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications" size={22} color={theme.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          {/* Profile circle */}
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: Brand.navy }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.avatarText}>{userName[0]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ── Quick Actions ── */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <Ionicons name="add-circle" size={28} color={Brand.gold} />
            <Text style={[styles.actionText, { color: theme.text }]}>Create Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <Ionicons name="qr-code" size={28} color={Brand.gold} />
            <Text style={[styles.actionText, { color: theme.text }]}>Join by QR</Text>
          </TouchableOpacity>
        </View>

        {/* ── Active Events ── */}
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
              style={[styles.eventCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
              onPress={() => openEvent(item.id)}
            >
              <Text style={styles.eventEmoji}>{item.emoji}</Text>
              <Text style={[styles.eventName, { color: theme.text }]}>
                {item.name}
              </Text>
              <View style={styles.eventRow}>
                <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.eventDetail, { color: theme.textSecondary }]}>
                  {item.date}
                </Text>
              </View>
              <View style={styles.eventRow}>
                <Text style={styles.pesoIcon}>💰</Text>
                <Text style={[styles.eventDetail, { color: theme.textSecondary }]}>
                  Total Ambagan: ₱{item.totalAmbagan.toLocaleString()}
                </Text>
              </View>
              {/* Member avatars */}
              <View style={styles.membersRow}>
                <Ionicons name="people" size={14} color={theme.textSecondary} />
                <View style={styles.avatarGroup}>
                  {item.members.map((m, i) => (
                    <View
                      key={i}
                      style={[styles.miniAvatar, { backgroundColor: AVATAR_COLORS[i], marginLeft: i > 0 ? -8 : 0 }]}
                    >
                      <Text style={styles.miniAvatarText}>{m}</Text>
                    </View>
                  ))}
                  {item.extraMembers > 0 && (
                    <Text style={[styles.extraMembers, { color: theme.textSecondary }]}>
                      +{item.extraMembers}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* ── Past Events ── */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          TAPOS NA (Past Events)
        </Text>

        {PAST_EVENTS.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[styles.pastCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
          >
            <View style={styles.pastLeft}>
              <Text style={styles.pastEmoji}>{event.emoji}</Text>
              <Text style={[styles.pastName, { color: theme.text }]}>
                {event.name} {event.status === 'Settled' ? '(Settled)' : '(Settle Up!)'} →
              </Text>
            </View>
            {event.status !== 'Settled' && (
              <TouchableOpacity style={[styles.settleButton, { backgroundColor: Brand.gold }]}>
                <Text style={styles.settleText}>Settle Up!</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
  },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: Brand.red,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },

  // Quick actions
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: Spacing.xxl },
  actionCard: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  actionText: { fontSize: 14, fontWeight: '700' },

  // Section label
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },

  // Active events
  eventList: { gap: 12, paddingBottom: Spacing.xxl },
  eventCard: {
    width: 260,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: 8,
  },
  eventEmoji: { fontSize: 28 },
  eventName: { fontSize: 18, fontWeight: '800' },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventDetail: { fontSize: 13 },
  pesoIcon: { fontSize: 14 },
  membersRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  avatarGroup: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  miniAvatarText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  extraMembers: { fontSize: 13, marginLeft: 6 },

  // Past events
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  pastLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  pastEmoji: { fontSize: 20 },
  pastName: { fontSize: 14, fontWeight: '600', flex: 1 },
  settleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.sm,
  },
  settleText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
