/**
 * Home Dashboard — "Kaganapan"
 * The main hub showing active + past events.
 * Clean UI with Ionicons instead of emojis.
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

// ─── Placeholder data ────────────────────────────────────
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
  },
  {
    id: '2',
    name: 'Sagada Hike 2026',
    icon: 'trail-sign' as const,
    iconColor: Brand.teal,
    date: 'Jun 20 — 5:00 AM',
    totalAmbagan: 8200,
    members: ['J', 'A', 'R'],
    extraMembers: 4,
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
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.header, paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.greetingRow}>
            <Image
              source={require('@/assets/images/Logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={[styles.greeting, { color: theme.text }]}>
                Hey, {userName}!
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Saan ang next na lakad?
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={theme.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: Brand.teal }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.avatarText}>{userName[0]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <View style={[styles.actionIconWrap, { backgroundColor: isDark ? '#1C2A28' : '#E8F8F5' }]}>
              <Ionicons name="add-circle" size={24} color={Brand.teal} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Create Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <View style={[styles.actionIconWrap, { backgroundColor: isDark ? '#2A2518' : '#FFF3E0' }]}>
              <Ionicons name="qr-code" size={24} color={Brand.orange} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Join by QR</Text>
          </TouchableOpacity>
        </View>

        {/* Active Events */}
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
              <View style={[styles.eventIconWrap, { backgroundColor: isDark ? '#1C2128' : '#F5F5F5' }]}>
                <Ionicons name={item.icon} size={24} color={item.iconColor} />
              </View>
              <Text style={[styles.eventName, { color: theme.text }]}>{item.name}</Text>
              <View style={styles.eventRow}>
                <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.eventDetail, { color: theme.textSecondary }]}>{item.date}</Text>
              </View>
              <View style={styles.eventRow}>
                <Ionicons name="wallet-outline" size={14} color={Brand.gold} />
                <Text style={[styles.eventDetail, { color: theme.textSecondary }]}>
                  Total: ₱{item.totalAmbagan.toLocaleString()}
                </Text>
              </View>
              <View style={styles.membersRow}>
                <Ionicons name="people-outline" size={14} color={theme.textSecondary} />
                <View style={styles.avatarGroup}>
                  {item.members.map((m, i) => (
                    <View key={i} style={[styles.miniAvatar, { backgroundColor: AVATAR_COLORS[i], marginLeft: i > 0 ? -8 : 0 }]}>
                      <Text style={styles.miniAvatarText}>{m}</Text>
                    </View>
                  ))}
                  {item.extraMembers > 0 && (
                    <Text style={[styles.extraMembers, { color: theme.textSecondary }]}>+{item.extraMembers}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Past Events */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          TAPOS NA (Past Events)
        </Text>
        {PAST_EVENTS.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[styles.pastCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
          >
            <View style={styles.pastLeft}>
              <View style={[styles.pastIconWrap, { backgroundColor: isDark ? '#1C2128' : '#F5F5F5' }]}>
                <Ionicons name={event.icon} size={18} color={Brand.teal} />
              </View>
              <View style={styles.pastInfo}>
                <Text style={[styles.pastName, { color: theme.text }]}>{event.name}</Text>
                <Text style={[styles.pastStatus, { color: event.status === 'Settled' ? Brand.green : Brand.orange }]}>
                  {event.status}
                </Text>
              </View>
            </View>
            {event.status !== 'Settled' ? (
              <TouchableOpacity style={[styles.settleButton, { backgroundColor: Brand.orange }]}>
                <Text style={styles.settleText}>Settle Up</Text>
              </TouchableOpacity>
            ) : (
              <Ionicons name="checkmark-circle" size={22} color={Brand.green} />
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
  },
  headerLeft: { flex: 1 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLogo: { width: 40, height: 40, borderRadius: 10 },
  greeting: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconButton: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute', top: -2, right: -4, backgroundColor: Brand.red,
    borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 100 },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: Spacing.xxl },
  actionCard: { flex: 1, paddingVertical: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, alignItems: 'center', gap: 8 },
  actionIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '700' },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: Spacing.md },
  eventList: { gap: 12, paddingBottom: Spacing.xxl },
  eventCard: { width: 260, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, gap: 8 },
  eventIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  eventName: { fontSize: 17, fontWeight: '800' },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventDetail: { fontSize: 13 },
  membersRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  avatarGroup: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  miniAvatarText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  extraMembers: { fontSize: 13, marginLeft: 6 },
  pastCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.md },
  pastLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  pastIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  pastInfo: { flex: 1 },
  pastName: { fontSize: 14, fontWeight: '600' },
  pastStatus: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  settleButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Radius.sm },
  settleText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
