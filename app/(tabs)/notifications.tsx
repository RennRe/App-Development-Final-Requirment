/**
 * Notifications Screen
 * Shows event invites, payment reminders, and system updates.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'invite',
    icon: '🏖️',
    title: 'Event Invite: Puerto Galera 2026',
    body: 'Mark invited you to join!',
    time: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    type: 'nudge',
    icon: '💸',
    title: 'Walang Hiya Nudge!',
    body: 'Kristel gently reminds you: "bayad na po!" (₱250)',
    time: '30 min ago',
    unread: true,
  },
  {
    id: '3',
    type: 'system',
    icon: '✅',
    title: 'Item Checked Off',
    body: 'Mark checked off "Charcoal (10kg)" from Puerto Galera list',
    time: '1 hr ago',
    unread: false,
  },
  {
    id: '4',
    type: 'payment',
    icon: '💚',
    title: 'Payment Received',
    body: 'Jhirick paid ₱500 ambag via GCash',
    time: '3 hrs ago',
    unread: false,
  },
  {
    id: '5',
    type: 'system',
    icon: '📋',
    title: 'New item added',
    body: 'Kristel added "Sunscreen SPF50" to the To Buy list',
    time: 'Yesterday',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const { theme, isDark } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#161B22' : Brand.cream }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        <TouchableOpacity>
          <Text style={[styles.markAll, { color: Brand.gold }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {NOTIFICATIONS.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[
              styles.notifCard,
              {
                backgroundColor: notif.unread
                  ? (isDark ? '#1A2030' : '#FFF8E7')
                  : theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={styles.notifIcon}>{notif.icon}</Text>
            <View style={styles.notifContent}>
              <Text style={[styles.notifTitle, { color: theme.text }]}>{notif.title}</Text>
              <Text style={[styles.notifBody, { color: theme.textSecondary }]}>{notif.body}</Text>
              <Text style={[styles.notifTime, { color: theme.textSecondary }]}>{notif.time}</Text>
            </View>
            {notif.unread && <View style={styles.unreadDot} />}
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
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: Spacing.xl,
  },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  markAll: { fontSize: 13, fontWeight: '600' },

  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },

  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: 12,
  },
  notifIcon: { fontSize: 24 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '700' },
  notifBody: { fontSize: 13, marginTop: 2 },
  notifTime: { fontSize: 11, marginTop: 4 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Brand.gold,
    marginTop: 4,
  },
});
