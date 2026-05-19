/**
 * Home Dashboard — "Kaganapan"
 * Modernized UI: gradient hero header, floating event cards with shadows,
 * and a cleaner layout inspired by modern fintech/travel apps.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AnimatedScreen from '@/components/AnimatedScreen';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

const AVATAR_COLORS = ['#E5A100', '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6'];

const formatDate = (dateStr: any) => {
  if (!dateStr) return 'Anytime!';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function HomeScreen() {
  const { userName, user } = useAuth();
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ── States ─────────────────────────────────────────────────────────────
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isJoinVisible, setIsJoinVisible] = useState(false);
  
  // Form inputs
  const [newEventName, setNewEventName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Date picker states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // ── Fetch Logic ────────────────────────────────────────────────────────
  const fetchEvents = async (showLoading = true) => {
    if (!user) return;
    if (showLoading) setIsLoading(true);

    try {
      // 1. Get event_members user is in
      const { data: memberOf, error: memberOfError } = await supabase
        .from('event_members')
        .select('event_id')
        .eq('user_id', user.id);

      if (memberOfError) {
        console.error("Error fetching memberOf events:", memberOfError.message);
        return;
      }

      if (!memberOf || memberOf.length === 0) {
        setEvents([]);
        return;
      }

      const eventIds = memberOf.map(m => m.event_id);

      // 2. Fetch those events
      const { data: eventsList, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds);

      if (eventsError) {
        console.error("Error fetching events:", eventsError.message);
        return;
      }

      // 3. Fetch all members and profiles for those events to calculate dynamic ledgers!
      const { data: allMembers } = await supabase
        .from('event_members')
        .select('*')
        .in('event_id', eventIds);

      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*');

      const { data: allExpenses } = await supabase
        .from('expenses')
        .select('*')
        .in('event_id', eventIds);

      if (eventsList) {
        const mapped = eventsList.map((ev: any) => {
          const membersList = allMembers ? allMembers.filter((m: any) => m.event_id === ev.id) : [];
          
          // Show initials of first 3 members
          const memberInitials = membersList.map((m: any) => {
            const prof = allProfiles ? allProfiles.find((p: any) => p.id === m.user_id) : null;
            return prof?.name?.[0] || 'U';
          }).slice(0, 3);
          
          const extraMembersCount = Math.max(0, membersList.length - 3);

          // Calculate total expense cost dynamically!
          const eventExpenses = allExpenses ? allExpenses.filter((e: any) => e.event_id === ev.id) : [];
          const totalCost = eventExpenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);

          return {
            id: ev.id,
            name: ev.name,
            icon: 'sunny',
            iconColor: '#E5A100',
            date: formatDate(ev.date),
            totalAmbagan: totalCost,
            members: memberInitials,
            extraMembers: extraMembersCount,
          };
        });
        setEvents(mapped);
      }
    } catch (err) {
      console.error("Exception in fetchEvents:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents(true);
  }, [user]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchEvents(false);
  };

  // ── Actions ─────────────────────────────────────────────────────────────
  const handleCreateEvent = async () => {
    if (!newEventName.trim()) {
      Alert.alert("Error", "Paki-lagay naman ang pangalan ng lakad!");
      return;
    }
    
    setIsLoading(true);
    try {
      const dateIso = selectedDate.toISOString();

      // 1. Create the event row
      const { data: newEv, error: evError } = await supabase
        .from('events')
        .insert({
          name: newEventName,
          date: dateIso,
        })
        .select()
        .single();

      if (evError || !newEv) {
        Alert.alert("Error", "Hindi nagawa ang event: " + evError?.message);
        setIsLoading(false);
        return;
      }

      // 2. Add creator as first member
      const { error: memError } = await supabase
        .from('event_members')
        .insert({
          event_id: newEv.id,
          user_id: user?.id,
        });

      if (memError) {
        Alert.alert("Error", "Hindi ka maidagdag sa event: " + memError.message);
        setIsLoading(false);
        return;
      }

      // Reset form states
      setIsCreateVisible(false);
      setNewEventName('');
      setSelectedDate(new Date());
      
      // Refresh list and navigate
      await fetchEvents(false);
      router.push(`/(tabs)/event?id=${newEv.id}`);
    } catch (err) {
      console.error("Exception in handleCreateEvent:", err);
      setIsLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!joinCode.trim()) {
      Alert.alert("Error", "Paki-lagay ang Event ID!");
      return;
    }

    setIsLoading(true);
    try {
      const cleanId = joinCode.trim();
      
      // 1. Check if the event exists
      const { data: ev, error: evError } = await supabase
        .from('events')
        .select('id')
        .eq('id', cleanId)
        .single();

      if (evError || !ev) {
        Alert.alert("Error", "Hindi mahanap ang event. Siguraduhing tama ang Event ID!");
        setIsLoading(false);
        return;
      }

      // 2. Join the member
      const { error: memError } = await supabase
        .from('event_members')
        .insert({
          event_id: ev.id,
          user_id: user?.id,
        });

      if (memError) {
        if (memError.code === '23505') {
          setIsJoinVisible(false);
          setJoinCode('');
          setIsLoading(false);
          router.push(`/(tabs)/event?id=${ev.id}`);
          return;
        }
        Alert.alert("Error", "Hindi ka makasali: " + memError.message);
        setIsLoading(false);
        return;
      }

      setIsJoinVisible(false);
      setJoinCode('');
      
      // Refresh list and navigate
      await fetchEvents(false);
      router.push(`/(tabs)/event?id=${ev.id}`);
    } catch (err) {
      console.error("Exception in handleJoinEvent:", err);
      setIsLoading(false);
    }
  };

  const openEvent = (eventId: string) => {
    router.push(`/(tabs)/event?id=${eventId}`);
  };

  // Classify events based on dates (past vs active)
  const activeEvents = events.filter(
    (e) =>
      !e.date.toLowerCase().includes('tapos') &&
      !e.date.toLowerCase().includes('2024') &&
      !e.date.toLowerCase().includes('2025')
  );
  
  const pastEvents = events.filter(
    (e) =>
      e.date.toLowerCase().includes('tapos') ||
      e.date.toLowerCase().includes('2024') ||
      e.date.toLowerCase().includes('2025')
  );

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
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: isDark ? '#1C2128' : '#F0F0F0' }]}
              onPress={() => router.push('/(tabs)/notifications')}
            >
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.avatar, { backgroundColor: theme.tint }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.avatarText}>{userName[0]}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.tint} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading barkada trips...
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={theme.tint} />
            }
          >
            {/* ── Quick Actions ─────────────────────────────── */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[
                  styles.actionCard,
                  { backgroundColor: isDark ? '#1C2A28' : '#E8F8F5', borderColor: isDark ? '#2D3E3B' : '#C8EEE8' },
                ]}
                onPress={() => setIsCreateVisible(true)}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: theme.tint }]}>
                  <Ionicons name="add" size={22} color="#FFF" />
                </View>
                <Text style={[styles.actionText, { color: theme.tint }]}>
                  Create Event
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionCard,
                  { backgroundColor: isDark ? '#2A2518' : '#FFF3E0', borderColor: isDark ? '#3E3020' : '#FFE0B8' },
                ]}
                onPress={() => setIsJoinVisible(true)}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: theme.accent }]}>
                  <Ionicons name="enter" size={22} color="#FFF" />
                </View>
                <Text style={[styles.actionText, { color: theme.accent }]}>
                  Join Event
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Active Events ─────────────────────────────── */}
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              ACTIVE NA LAKAD
            </Text>

            {activeEvents.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <Ionicons name="compass-outline" size={32} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.text }]}>Wala pang active na lakad.</Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Gawa na ng bago o sumali sa barkada!</Text>
              </View>
            ) : (
              <FlatList
                data={activeEvents}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.eventList}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[styles.eventCard, { backgroundColor: index % 2 === 0 ? theme.tint : theme.accent }]}
                    onPress={() => openEvent(item.id)}
                    activeOpacity={0.85}
                  >
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
                        {item.members.map((m: string, i: number) => (
                          <View
                            key={i}
                            style={[
                              styles.miniAvatar,
                              { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length], marginLeft: i > 0 ? -8 : 0 },
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

                    <View style={styles.eventArrow}>
                      <Ionicons name="arrow-forward-circle" size={24} color="rgba(255,255,255,0.7)" />
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* ── Past Events ───────────────────────────────── */}
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              TAPOS NA (Past Events)
            </Text>

            {pastEvents.length === 0 ? (
              <View style={[styles.emptyCardMini, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <Text style={[styles.emptyTextMini, { color: theme.textSecondary }]}>Wala pang nakaraang gala.</Text>
              </View>
            ) : (
              pastEvents.map((event) => (
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
                  onPress={() => openEvent(event.id)}
                >
                  <View style={styles.pastLeft}>
                    <View
                      style={[
                        styles.pastIconWrap,
                        { backgroundColor: isDark ? '#1C2128' : '#F5F5F5' },
                      ]}
                    >
                      <Ionicons name={event.icon} size={18} color={theme.tint} />
                    </View>
                    <View style={styles.pastInfo}>
                      <Text style={[styles.pastName, { color: theme.text }]}>{event.name}</Text>
                      <Text style={[styles.pastStatus, { color: theme.positive }]}>
                        Settled
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color={theme.positive} />
                </TouchableOpacity>
              ))
            )}

          </ScrollView>
        )}

        {/* ── Modals ────────────────────────────────────── */}
        <Modal
          visible={isCreateVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsCreateVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Bagong Lakad 🏖️</Text>
              <Text style={[styles.modalSub, { color: theme.textSecondary }]}>Saan at kailan ang gala ng barkada?</Text>
              
              <TextInput
                style={[styles.modalInput, { color: theme.text, borderColor: theme.divider }]}
                placeholder="Pangalan ng Event (e.g. Boracay 2026)"
                placeholderTextColor={theme.textSecondary}
                value={newEventName}
                onChangeText={setNewEventName}
              />
              
              <TouchableOpacity
                style={[styles.modalInput, styles.datePickerButton, { borderColor: theme.divider, flexDirection: 'row', alignItems: 'center', gap: 10 }]}
                onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}
              >
                <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
                <Text style={{ color: theme.text, flex: 1 }}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>
                <Ionicons name="chevron-down" size={16} color={isDatePickerVisible ? theme.tint : theme.textSecondary} />
              </TouchableOpacity>

              {isDatePickerVisible && (
                <View style={[styles.inlineCalendarContainer, { borderColor: theme.divider, borderWidth: 1, borderRadius: Radius.md, padding: 10, marginTop: 4, width: '100%' }]}>
                  {/* Calendar month selector header */}
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={() => {
                      if (calendarMonth === 0) {
                        setCalendarMonth(11);
                        setCalendarYear(y => y - 1);
                      } else {
                        setCalendarMonth(m => m - 1);
                      }
                    }} style={styles.calArrow}>
                      <Ionicons name="chevron-back" size={16} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.calendarMonthText, { color: theme.text }]}>
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </Text>
                    <TouchableOpacity onPress={() => {
                      if (calendarMonth === 11) {
                        setCalendarMonth(0);
                        setCalendarYear(y => y + 1);
                      } else {
                        setCalendarMonth(m => m + 1);
                      }
                    }} style={styles.calArrow}>
                      <Ionicons name="chevron-forward" size={16} color={theme.text} />
                    </TouchableOpacity>
                  </View>

                  {/* Weekday headers */}
                  <View style={styles.weekdaysRow}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <Text key={i} style={[styles.weekdayLabel, { color: theme.textSecondary }]}>{day}</Text>
                    ))}
                  </View>

                  {/* Days grid */}
                  <View style={styles.daysGrid}>
                    {(() => {
                      const totalDays = getDaysInMonth(calendarYear, calendarMonth);
                      const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
                      const gridCells = [];
                      
                      // Empty space offsets
                      for (let i = 0; i < firstDay; i++) {
                        gridCells.push(<View key={`empty-${i}`} style={styles.calendarCellEmpty} />);
                      }
                      
                      // Days numbers
                      for (let d = 1; d <= totalDays; d++) {
                        const isSelected = selectedDate.getDate() === d &&
                                           selectedDate.getMonth() === calendarMonth &&
                                           selectedDate.getFullYear() === calendarYear;
                        gridCells.push(
                          <TouchableOpacity
                            key={`day-${d}`}
                            style={[
                              styles.calendarCell,
                              isSelected && { backgroundColor: theme.tint, borderRadius: 14 }
                            ]}
                            onPress={() => {
                              setSelectedDate(new Date(calendarYear, calendarMonth, d));
                            }}
                          >
                            <Text style={[
                              styles.calendarCellText,
                              { color: theme.text },
                              isSelected && { color: '#FFF', fontWeight: 'bold' }
                            ]}>
                              {d}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                      return gridCells;
                    })()}
                  </View>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButtonCancel, { borderColor: theme.divider }]} 
                  onPress={() => {
                    setIsCreateVisible(false);
                    setIsDatePickerVisible(false);
                  }}
                >
                  <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButtonConfirm, { backgroundColor: theme.tint }]} 
                  onPress={handleCreateEvent}
                >
                  <Text style={styles.confirmText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isJoinVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsJoinVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Sumali sa Lakad 🚀</Text>
              <Text style={[styles.modalSub, { color: theme.textSecondary }]}>I-paste ang Event ID ng barkada para makasali.</Text>
              
              <TextInput
                style={[styles.modalInput, { color: theme.text, borderColor: theme.divider }]}
                placeholder="Event ID (UUID)"
                placeholderTextColor={theme.textSecondary}
                value={joinCode}
                onChangeText={setJoinCode}
                autoCapitalize="none"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButtonCancel, { borderColor: theme.divider }]} 
                  onPress={() => setIsJoinVisible(false)}
                >
                  <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButtonConfirm, { backgroundColor: theme.accent }]} 
                  onPress={handleJoinEvent}
                >
                  <Text style={styles.confirmText}>Sumali</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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

  // ── Loading ──────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
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

  // ── Empty States ─────────────────────────────────────
  emptyCard: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyCardMini: {
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTextMini: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Past Events ──────────────────────────────────────
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
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

  // ── Modals ───────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButtonCancel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonConfirm: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '700',
    fontSize: 14,
  },
  confirmText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  // Calendar Custom Picker Styles
  datePickerButton: {
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  inlineCalendarContainer: {
    marginVertical: 4,
  },
  datePickerContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 4,
  },
  calArrow: {
    padding: 6,
  },
  calendarMonthText: {
    fontSize: 15,
    fontWeight: '800',
  },
  weekdaysRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  weekdayLabel: {
    width: 32,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calendarCell: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 3,
  },
  calendarCellEmpty: {
    width: 32,
    height: 32,
    marginVertical: 2,
    marginHorizontal: 3,
  },
  calendarCellText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
