/**
 * Event Detail — "Command Center"
 * Shows the inside of an event with 3 tabs: To-Do Board, Ambagan, Chika.
 * Matches the 2nd mockup with expense tracking and resibo system.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

// ─── Placeholder data ────────────────────────────────────
const MEMBERS = [
  { id: '1', name: 'Jhirick', initial: 'J', color: '#E5A100', paid: 1000, avatar: '😎' },
  { id: '2', name: 'Kristel', initial: 'K', color: '#E74C3C', paid: 200, avatar: '👩' },
  { id: '3', name: 'Mark', initial: 'M', color: '#3498DB', paid: 0, avatar: '🧑' },
  { id: '4', name: 'Friend 4', initial: 'M2', color: '#2ECC71', paid: 0, avatar: '🙋' },
];

const EXPENSES = [
  { id: '1', name: 'Meat & Hotdogs', emoji: '🥩', price: 1000, payer: 'Kristel', excludes: 'Mark', hasPhoto: true },
  { id: '2', name: 'Gasolina', emoji: '⛽', price: 1500, payer: 'Jhirick', excludes: null, hasPhoto: true },
  { id: '3', name: 'Paper Plates', emoji: '🍽️', price: 200, payer: 'Mark', excludes: null, hasPhoto: false },
];

const TODO_ITEMS = [
  { id: '1', text: 'Charcoal (10kg)', done: true, assignee: 'Jhirick' },
  { id: '2', text: 'Ice (2 bags)', done: false, assignee: 'Kristel' },
  { id: '3', text: 'Tent', done: false, assignee: 'Mark' },
  { id: '4', text: 'Speakers', done: true, assignee: 'Friend 4' },
  { id: '5', text: 'Sunscreen', done: false, assignee: 'Jhirick' },
];

const CHIKA_MESSAGES = [
  { id: '1', type: 'system', text: 'Jhirick just paid his ₱500 ambag via GCash', time: '2:30 PM' },
  { id: '2', type: 'user', sender: 'Kristel', text: 'Guys bili na ko ng meat ha 🍖', time: '2:45 PM' },
  { id: '3', type: 'system', text: 'Kristel checked off "Paper Plates" from the list', time: '3:00 PM' },
  { id: '4', type: 'user', sender: 'Mark', text: 'G! Dala ko yung tent 🏕️', time: '3:15 PM' },
  { id: '5', type: 'system', text: 'Mark added "Sunscreen" to the To Buy list', time: '3:20 PM' },
];

type TabName = 'board' | 'ambagan' | 'chika';

export default function EventScreen() {
  const { userName } = useAuth();
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState<TabName>('ambagan');
  const [chatInput, setChatInput] = useState('');

  // Total cost & per-person calculation
  const totalCost = EXPENSES.reduce((sum, e) => sum + e.price, 0);
  const perPerson = Math.round(totalCost / MEMBERS.length);
  const userBalance = 1000 - perPerson; // Jhirick paid 1000

  // Member avatars
  const AVATAR_COLORS = ['#E5A100', '#E74C3C', '#3498DB', '#2ECC71'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: isDark ? '#161B22' : Brand.cream }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.eventTitle, { color: theme.text }]}>
            Uy, {userName}! 🌊
          </Text>
          {/* Member avatars row */}
          <View style={styles.memberAvatars}>
            {MEMBERS.map((m, i) => (
              <View
                key={m.id}
                style={[styles.miniAvatar, { backgroundColor: AVATAR_COLORS[i], marginLeft: i > 0 ? -8 : 0 }]}
              >
                <Text style={styles.miniAvatarText}>{m.initial}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications" size={20} color={theme.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.profileCircle, { backgroundColor: Brand.navy }]}>
            <Text style={styles.profileText}>J</Text>
          </View>
        </View>
      </View>

      {/* ── Event info bar ── */}
      <View style={[styles.eventBar, { backgroundColor: isDark ? '#1C2128' : '#FFF' }]}>
        <Text style={styles.eventBarEmoji}>🏖️</Text>
        <Text style={[styles.eventBarName, { color: theme.text }]}>Puerto Galera</Text>
        <View style={styles.eventBarAvatars}>
          {MEMBERS.slice(0, 3).map((m, i) => (
            <View
              key={m.id}
              style={[styles.tinyAvatar, { backgroundColor: AVATAR_COLORS[i], marginLeft: i > 0 ? -6 : 0 }]}
            >
              <Text style={styles.tinyAvatarText}>{m.initial}</Text>
            </View>
          ))}
          <Text style={[styles.extraText, { color: theme.textSecondary }]}>M2</Text>
        </View>
      </View>

      {/* ── Tabs ── */}
      <View style={[styles.tabRow, { backgroundColor: theme.surface, borderBottomColor: theme.divider }]}>
        {(['board', 'ambagan', 'chika'] as TabName[]).map((tab) => {
          const isActive = activeTab === tab;
          const labels: Record<TabName, string> = { board: 'To-Do Board', ambagan: 'AMBAGAN', chika: 'Chika 💬' };
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && { borderBottomColor: Brand.gold, borderBottomWidth: 3 }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: isActive ? Brand.gold : theme.textSecondary },
                isActive && styles.tabTextActive,
              ]}>
                {labels[tab]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Tab Content ── */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* ════════════════ AMBAGAN TAB ════════════════ */}
        {activeTab === 'ambagan' && (
          <>
            {/* Total cost */}
            <View style={[styles.totalCard, { backgroundColor: isDark ? '#1C2128' : '#FFF', borderColor: theme.cardBorder }]}>
              <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>TOTAL EVENT COST:</Text>
              <Text style={[styles.totalAmount, { color: theme.text }]}>
                ₱{totalCost.toLocaleString()}
              </Text>
            </View>

            {/* User balance */}
            <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1C2128' : '#FFF', borderColor: theme.cardBorder }]}>
              <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
                Your Status:
              </Text>
              <View style={styles.balanceRow}>
                <View style={[styles.statusDot, { backgroundColor: userBalance >= 0 ? Brand.green : Brand.red }]} />
                <Text style={[styles.balanceAmount, { color: userBalance >= 0 ? theme.positive : theme.negative }]}>
                  {userBalance >= 0 ? 'YOU ARE OWED' : 'YOU OWE'} ₱{Math.abs(userBalance).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity style={[styles.gcashButton, { borderColor: theme.cardBorder }]}>
                <Text style={[styles.gcashText, { color: theme.text }]}>
                  [ G! Settle Up via GCash ]
                </Text>
              </TouchableOpacity>
            </View>

            {/* Resibo feed */}
            <Text style={[styles.resiboLabel, { color: theme.textSecondary }]}>
              LATEST RESIBO (Auto-syncing...) 🟢
            </Text>

            {EXPENSES.map((expense) => (
              <View
                key={expense.id}
                style={[styles.resiboCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
              >
                <View style={styles.resiboLeft}>
                  <Text style={styles.resiboEmoji}>{expense.emoji}</Text>
                  <View>
                    <View style={styles.resiboNameRow}>
                      <Text style={[styles.resiboName, { color: theme.text }]}>{expense.name}</Text>
                      {expense.hasPhoto && (
                        <TouchableOpacity style={[styles.viewPicBtn, { borderColor: theme.cardBorder }]}>
                          <Text style={[styles.viewPicText, { color: theme.textSecondary }]}>View Pic</Text>
                        </TouchableOpacity>
                      )}
                      {expense.hasPhoto && <Text style={{ color: Brand.green }}>✓</Text>}
                    </View>
                    <Text style={[styles.resiboPrice, { color: theme.text }]}>
                      Price: ₱{expense.price.toLocaleString()}
                    </Text>
                    <Text style={[styles.resiboPayer, { color: theme.textSecondary }]}>
                      Paid by: {expense.payer}
                      {expense.excludes ? ` (Excludes: ${expense.excludes})` : ''}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* FAB */}
            <View style={styles.fabSpacer} />
          </>
        )}

        {/* ════════════════ BOARD TAB ════════════════ */}
        {activeTab === 'board' && (
          <>
            <Text style={[styles.boardSectionTitle, { color: theme.textSecondary }]}>
              📋 TO BUY / TO BRING
            </Text>
            {TODO_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.todoCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
              >
                <View style={[
                  styles.checkbox,
                  item.done
                    ? { backgroundColor: Brand.gold, borderColor: Brand.gold }
                    : { borderColor: theme.textSecondary }
                ]}>
                  {item.done && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
                <View style={styles.todoContent}>
                  <Text style={[
                    styles.todoText,
                    { color: theme.text },
                    item.done && { textDecorationLine: 'line-through', opacity: 0.5 },
                  ]}>
                    {item.text}
                  </Text>
                  <Text style={[styles.todoAssignee, { color: theme.textSecondary }]}>
                    Assigned: {item.assignee}
                  </Text>
                </View>
                <Ionicons name="ellipsis-vertical" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
            <View style={styles.fabSpacer} />
          </>
        )}

        {/* ════════════════ CHIKA TAB ════════════════ */}
        {activeTab === 'chika' && (
          <>
            {CHIKA_MESSAGES.map((msg) => (
              <View key={msg.id} style={styles.chikaRow}>
                {msg.type === 'system' ? (
                  <View style={[styles.systemBubble, { backgroundColor: isDark ? '#2D333B' : '#F0E6D0' }]}>
                    <Ionicons name="information-circle" size={14} color={theme.textSecondary} />
                    <Text style={[styles.systemText, { color: theme.textSecondary }]}>
                      System: {msg.text}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.userBubbleRow}>
                    <View style={[styles.chatAvatar, { backgroundColor: Brand.gold }]}>
                      <Text style={styles.chatAvatarText}>{msg.sender?.[0]}</Text>
                    </View>
                    <View style={[styles.userBubble, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                      <Text style={[styles.chatSender, { color: Brand.gold }]}>{msg.sender}</Text>
                      <Text style={[styles.chatMessage, { color: theme.text }]}>{msg.text}</Text>
                      <Text style={[styles.chatTime, { color: theme.textSecondary }]}>{msg.time}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* Chat input */}
            <View style={[styles.chatInputRow, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <TextInput
                style={[styles.chatInput, { color: theme.text }]}
                placeholder="Mag-chika ka dito..."
                placeholderTextColor={theme.textSecondary}
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={[styles.sendButton, { backgroundColor: Brand.gold }]}>
                <Ionicons name="send" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* ── FAB (only on board + ambagan) ── */}
      {activeTab !== 'chika' && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: Brand.gold }]}>
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: Spacing.lg,
  },
  backButton: { padding: 4, marginRight: 8 },
  headerCenter: { flex: 1 },
  eventTitle: { fontSize: 20, fontWeight: '800' },
  memberAvatars: { flexDirection: 'row', marginTop: 4 },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  miniAvatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: { padding: 4, position: 'relative' },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: Brand.red,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Event bar
  eventBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: 10,
  },
  eventBarEmoji: { fontSize: 24 },
  eventBarName: { fontSize: 18, fontWeight: '800', flex: 1 },
  eventBarAvatars: { flexDirection: 'row', alignItems: 'center' },
  tinyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  tinyAvatarText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  extraText: { marginLeft: 4, fontSize: 12, fontWeight: '600' },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabTextActive: { fontWeight: '800' },

  // Content
  content: { flex: 1 },
  contentInner: { padding: Spacing.lg, paddingBottom: 100 },

  // Ambagan
  totalCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  totalLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  totalAmount: { fontSize: 40, fontWeight: '900', marginTop: 4 },

  balanceCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  balanceLabel: { fontSize: 12, fontWeight: '600' },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  balanceAmount: { fontSize: 20, fontWeight: '800' },
  gcashButton: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  gcashText: { fontSize: 14, fontWeight: '700' },

  resiboLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: Spacing.md },

  resiboCard: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  resiboLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  resiboEmoji: { fontSize: 28 },
  resiboNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resiboName: { fontSize: 15, fontWeight: '700' },
  viewPicBtn: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  viewPicText: { fontSize: 11 },
  resiboPrice: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  resiboPayer: { fontSize: 12, marginTop: 2 },

  // Board
  boardSectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: Spacing.md },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoContent: { flex: 1 },
  todoText: { fontSize: 15, fontWeight: '600' },
  todoAssignee: { fontSize: 12, marginTop: 2 },

  // Chika
  chikaRow: { marginBottom: Spacing.md },
  systemBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    alignSelf: 'center',
  },
  systemText: { fontSize: 12, fontStyle: 'italic' },
  userBubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  chatAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  userBubble: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    maxWidth: '75%',
  },
  chatSender: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  chatMessage: { fontSize: 14 },
  chatTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },

  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 4,
    marginTop: Spacing.md,
    height: 48,
  },
  chatInput: { flex: 1, fontSize: 14 },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabSpacer: { height: 80 },
});
