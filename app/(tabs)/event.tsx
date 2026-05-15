/**
 * Event Detail — "Command Center"
 * Shows the inside of an event with 3 tabs: To-Do Board, Ambagan, Chika.
 * All emojis replaced with Ionicons for a clean, modern look.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Placeholder data ────────────────────────────────────
const MEMBERS = [
  { id: '1', name: 'Jhirick', initial: 'J', color: '#E5A100', paid: 1000 },
  { id: '2', name: 'Kristel', initial: 'K', color: '#E74C3C', paid: 200 },
  { id: '3', name: 'Mark', initial: 'M', color: '#3498DB', paid: 0 },
  { id: '4', name: 'Friend 4', initial: 'F', color: '#2ECC71', paid: 0 },
];

const EXPENSES = [
  { id: '1', name: 'Meat & Hotdogs', icon: 'fast-food' as const, price: 1000, payer: 'Kristel', excludes: 'Mark', hasPhoto: true },
  { id: '2', name: 'Gasolina', icon: 'car' as const, price: 1500, payer: 'Jhirick', excludes: null, hasPhoto: true },
  { id: '3', name: 'Paper Plates', icon: 'restaurant' as const, price: 200, payer: 'Mark', excludes: null, hasPhoto: false },
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
  { id: '2', type: 'user', sender: 'Kristel', text: 'Guys bili na ko ng meat ha', time: '2:45 PM' },
  { id: '3', type: 'system', text: 'Kristel checked off "Paper Plates" from the list', time: '3:00 PM' },
  { id: '4', type: 'user', sender: 'Mark', text: 'G! Dala ko yung tent', time: '3:15 PM' },
  { id: '5', type: 'system', text: 'Mark added "Sunscreen" to the To Buy list', time: '3:20 PM' },
];

type TabName = 'board' | 'ambagan' | 'chika';

export default function EventScreen() {
  const { userName } = useAuth();
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabName>('ambagan');
  const [chatInput, setChatInput] = useState('');

  const totalCost = EXPENSES.reduce((sum, e) => sum + e.price, 0);
  const perPerson = Math.round(totalCost / MEMBERS.length);
  const userBalance = 1000 - perPerson;

  const AVATAR_COLORS = ['#E5A100', '#E74C3C', '#3498DB', '#2ECC71'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.header, paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.eventTitle, { color: theme.text }]}>
            Puerto Galera
          </Text>
          <View style={styles.memberAvatars}>
            {MEMBERS.map((m, i) => (
              <View key={m.id} style={[styles.miniAvatar, { backgroundColor: AVATAR_COLORS[i], marginLeft: i > 0 ? -8 : 0 }]}>
                <Text style={styles.miniAvatarText}>{m.initial}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
          </TouchableOpacity>
          <View style={[styles.profileCircle, { backgroundColor: theme.tint }]}>
            <Text style={styles.profileText}>J</Text>
          </View>
        </View>
      </View>

      {/* Event info bar */}
      <View style={[styles.eventBar, { backgroundColor: isDark ? '#1C2128' : '#FFF' }]}>
        <View style={[styles.eventBarIcon, { backgroundColor: isDark ? '#2D333B' : '#FFF3E0' }]}>
          <Ionicons name="sunny" size={20} color={theme.accent} />
        </View>
        <Text style={[styles.eventBarName, { color: theme.text }]}>Puerto Galera</Text>
        <View style={styles.eventBarAvatars}>
          {MEMBERS.slice(0, 3).map((m, i) => (
            <View key={m.id} style={[styles.tinyAvatar, { backgroundColor: AVATAR_COLORS[i], marginLeft: i > 0 ? -6 : 0 }]}>
              <Text style={styles.tinyAvatarText}>{m.initial}</Text>
            </View>
          ))}
          <Text style={[styles.extraText, { color: theme.textSecondary }]}>+1</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { backgroundColor: theme.surface, borderBottomColor: theme.divider }]}>
        {(['board', 'ambagan', 'chika'] as TabName[]).map((tab) => {
          const isActive = activeTab === tab;
          const labels: Record<TabName, string> = { board: 'To-Do Board', ambagan: 'Ambagan', chika: 'Chika' };
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && { borderBottomColor: theme.tint, borderBottomWidth: 3 }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, { color: isActive ? theme.tint : theme.textSecondary }, isActive && styles.tabTextActive]}>
                {labels[tab]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* AMBAGAN TAB */}
        {activeTab === 'ambagan' && (
          <>
            {/* Total cost */}
            <View style={[styles.totalCard, { backgroundColor: isDark ? '#1C2128' : '#FFF', borderColor: theme.cardBorder }]}>
              <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>TOTAL EVENT COST</Text>
              <Text style={[styles.totalAmount, { color: theme.text }]}>₱{totalCost.toLocaleString()}</Text>
            </View>

            {/* User balance */}
            <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1C2128' : '#FFF', borderColor: theme.cardBorder }]}>
              <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Your Status</Text>
              <View style={styles.balanceRow}>
                <View style={[styles.statusDot, { backgroundColor: userBalance >= 0 ? theme.positive : theme.negative }]} />
                <Text style={[styles.balanceAmount, { color: userBalance >= 0 ? theme.positive : theme.negative }]}>
                  {userBalance >= 0 ? 'YOU ARE OWED' : 'YOU OWE'} ₱{Math.abs(userBalance).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity style={[styles.gcashButton, { backgroundColor: theme.tint }]}>
                <Ionicons name="card-outline" size={16} color="#FFF" />
                <Text style={styles.gcashText}>Settle Up via GCash</Text>
              </TouchableOpacity>
            </View>

            {/* Resibo feed */}
            <View style={styles.resiboHeader}>
              <Text style={[styles.resiboLabel, { color: theme.textSecondary }]}>LATEST RESIBO</Text>
              <View style={[styles.syncDot, { backgroundColor: theme.positive }]} />
              <Text style={[styles.syncText, { color: theme.positive }]}>Synced</Text>
            </View>

            {EXPENSES.map((expense) => (
              <View key={expense.id} style={[styles.resiboCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <View style={styles.resiboLeft}>
                  <View style={[styles.resiboIconWrap, { backgroundColor: isDark ? '#2D333B' : '#F5F5F5' }]}>
                    <Ionicons name={expense.icon} size={20} color={theme.tint} />
                  </View>
                  <View style={styles.resiboInfo}>
                    <View style={styles.resiboNameRow}>
                      <Text style={[styles.resiboName, { color: theme.text }]}>{expense.name}</Text>
                      {expense.hasPhoto && (
                        <TouchableOpacity style={[styles.viewPicBtn, { borderColor: theme.cardBorder }]}>
                          <Ionicons name="image-outline" size={12} color={theme.textSecondary} />
                          <Text style={[styles.viewPicText, { color: theme.textSecondary }]}>Photo</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={[styles.resiboPrice, { color: theme.text }]}>₱{expense.price.toLocaleString()}</Text>
                    <Text style={[styles.resiboPayer, { color: theme.textSecondary }]}>
                      Paid by: {expense.payer}{expense.excludes ? ` (Excludes: ${expense.excludes})` : ''}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.fabSpacer} />
          </>
        )}

        {/* BOARD TAB */}
        {activeTab === 'board' && (
          <>
            <Text style={[styles.boardSectionTitle, { color: theme.textSecondary }]}>
              TO BUY / TO BRING
            </Text>
            {TODO_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.todoCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
              >
                <View style={[
                  styles.checkbox,
                  item.done
                    ? { backgroundColor: theme.tint, borderColor: theme.tint }
                    : { borderColor: theme.textSecondary }
                ]}>
                  {item.done && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
                <View style={styles.todoContent}>
                  <Text style={[
                    styles.todoText, { color: theme.text },
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

        {/* CHIKA TAB */}
        {activeTab === 'chika' && (
          <>
            {CHIKA_MESSAGES.map((msg) => (
              <View key={msg.id} style={styles.chikaRow}>
                {msg.type === 'system' ? (
                  <View style={[styles.systemBubble, { backgroundColor: isDark ? '#2D333B' : '#F0E6D0' }]}>
                    <Ionicons name="information-circle-outline" size={14} color={theme.textSecondary} />
                    <Text style={[styles.systemText, { color: theme.textSecondary }]}>{msg.text}</Text>
                  </View>
                ) : (
                  <View style={styles.userBubbleRow}>
                    <View style={[styles.chatAvatar, { backgroundColor: theme.tint }]}>
                      <Text style={styles.chatAvatarText}>{msg.sender?.[0]}</Text>
                    </View>
                    <View style={[styles.userBubble, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                      <Text style={[styles.chatSender, { color: theme.tint }]}>{msg.sender}</Text>
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
              <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.tint }]}>
                <Ionicons name="send" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* FAB (only on board + ambagan) */}
      {activeTab !== 'chika' && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.tint }]}>
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingBottom: 12, paddingHorizontal: Spacing.lg,
  },
  backButton: { padding: 4, marginRight: 8 },
  headerCenter: { flex: 1 },
  eventTitle: { fontSize: 20, fontWeight: '800' },
  memberAvatars: { flexDirection: 'row', marginTop: 4 },
  miniAvatar: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
  },
  miniAvatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: { padding: 4, position: 'relative' },
  profileCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  eventBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: 10,
  },
  eventBarIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  eventBarName: { fontSize: 18, fontWeight: '800', flex: 1 },
  eventBarAvatars: { flexDirection: 'row', alignItems: 'center' },
  tinyAvatar: {
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
  },
  tinyAvatarText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  extraText: { marginLeft: 4, fontSize: 12, fontWeight: '600' },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabTextActive: { fontWeight: '800' },
  content: { flex: 1 },
  contentInner: { padding: Spacing.lg, paddingBottom: 100 },
  totalCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.md },
  totalLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  totalAmount: { fontSize: 40, fontWeight: '900', marginTop: 4 },
  balanceCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.xl },
  balanceLabel: { fontSize: 12, fontWeight: '600' },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  balanceAmount: { fontSize: 20, fontWeight: '800' },
  gcashButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: Radius.md, paddingVertical: 10, paddingHorizontal: 20, marginTop: 8,
  },
  gcashText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  resiboHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md },
  resiboLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  syncDot: { width: 8, height: 8, borderRadius: 4 },
  syncText: { fontSize: 11, fontWeight: '600' },
  resiboCard: { flexDirection: 'row', borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.md },
  resiboLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  resiboIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  resiboInfo: { flex: 1 },
  resiboNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resiboName: { fontSize: 15, fontWeight: '700' },
  viewPicBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  viewPicText: { fontSize: 11 },
  resiboPrice: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  resiboPayer: { fontSize: 12, marginTop: 2 },
  boardSectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: Spacing.md },
  todoCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.lg,
    borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm, gap: 12,
  },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  todoContent: { flex: 1 },
  todoText: { fontSize: 15, fontWeight: '600' },
  todoAssignee: { fontSize: 12, marginTop: 2 },
  chikaRow: { marginBottom: Spacing.md },
  systemBubble: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.full, alignSelf: 'center',
  },
  systemText: { fontSize: 12, fontStyle: 'italic' },
  userBubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  chatAvatar: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  chatAvatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  userBubble: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, maxWidth: '75%' },
  chatSender: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  chatMessage: { fontSize: 14 },
  chatTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  chatInputRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.full,
    borderWidth: 1, paddingLeft: 16, paddingRight: 4, marginTop: Spacing.md, height: 48,
  },
  chatInput: { flex: 1, fontSize: 14 },
  sendButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  fab: {
    position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6,
  },
  fabSpacer: { height: 80 },
});
