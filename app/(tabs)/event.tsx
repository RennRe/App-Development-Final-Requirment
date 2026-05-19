/**
 * Event Detail — "Command Center"
 * Shows the inside of an event with 3 tabs: To-Do Board, Ambagan, Chika.
 * All emojis replaced with Ionicons for a clean, modern look.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Clipboard,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

type TabName = 'board' | 'ambagan' | 'chika';

const AVATAR_COLORS = ['#E5A100', '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6', '#F39C12', '#8E44AD'];

const formatDate = (dateStr: any) => {
  if (!dateStr) return 'Anytime!';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function EventScreen() {
  const { userName, user } = useAuth();
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.id as string;
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const chatScrollRef = useRef<ScrollView>(null);

  // ── States ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabName>('ambagan');
  const [chatInput, setChatInput] = useState('');
  
  // Data States
  const [event, setEvent] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isTodoModalVisible, setIsTodoModalVisible] = useState(false);

  // Form Inputs
  const [expenseName, setExpenseName] = useState('');
  const [expensePrice, setExpensePrice] = useState('');
  const [expenseExcludes, setExpenseExcludes] = useState('');
  const [todoText, setTodoText] = useState('');

  // ── Fetch Actions ───────────────────────────────────────────────────────
  const fetchEventDetails = async () => {
    if (!eventId) return;
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      if (error) console.error("Error fetching event details:", error.message);
      else setEvent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    if (!eventId) return;
    try {
      const { data: memData, error: memError } = await supabase
        .from('event_members')
        .select('*')
        .eq('event_id', eventId);

      const { data: profData } = await supabase
        .from('profiles')
        .select('*');

      if (memError) {
        console.error("Error fetching members:", memError.message);
      } else if (memData && profData) {
        const mapped = memData.map((item: any) => {
          const prof = profData.find((p: any) => p.id === item.user_id);
          return {
            id: item.user_id,
            name: prof?.name || 'User',
            initial: prof?.name?.[0] || 'U',
            paid: 0, // will be calculated dynamically below
          };
        });
        setMembers(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    if (!eventId) return;
    try {
      const { data: expData, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      const { data: profData } = await supabase
        .from('profiles')
        .select('*');

      if (expError) {
        console.error("Error fetching expenses:", expError.message);
      } else if (expData && profData) {
        const mapped = expData.map((e: any) => {
          const payerProf = profData.find((p: any) => p.id === e.paid_by);
          return {
            id: e.id,
            name: e.name,
            icon: 'fast-food',
            price: Number(e.amount || 0),
            payer: payerProf?.name || 'Unknown',
            payerId: e.paid_by,
            excludes: null,
            hasPhoto: false,
          };
        });
        setExpenses(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodos = async () => {
    if (!eventId) return;
    try {
      const { data: todoData, error: todoError } = await supabase
        .from('todos')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      const { data: profData } = await supabase
        .from('profiles')
        .select('*');

      if (todoError) {
        console.error("Error fetching todos:", todoError.message);
      } else if (todoData && profData) {
        const mapped = todoData.map((t: any) => {
          const assigneeProf = profData.find((p: any) => p.id === t.assignee);
          return {
            id: t.id,
            text: t.text,
            done: t.done || false,
            assignee: assigneeProf?.name || 'Unassigned',
          };
        });
        setTodos(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    if (!eventId) return;
    try {
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      const { data: profData } = await supabase
        .from('profiles')
        .select('*');

      if (msgError) {
        console.error("Error fetching messages:", msgError.message);
      } else if (msgData && profData) {
        const mapped = msgData.map((m: any) => {
          const senderProf = profData.find((p: any) => p.id === m.sender_id);
          const timeStr = m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          return {
            id: m.id,
            type: m.type || 'user',
            sender: senderProf?.name || 'System',
            senderId: m.sender_id,
            text: m.text,
            time: timeStr,
          };
        });
        setMessages(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Subscriptions & Mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!eventId) return;

    const loadAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchEventDetails(),
        fetchMembers(),
        fetchExpenses(),
        fetchTodos(),
        fetchMessages(),
      ]);
      setIsLoading(false);
    };

    loadAllData();

    // Setup real-time postgres subscriptions
    const channel = supabase
      .channel(`event-room:${eventId}`)
      .on('postgres_changes', { event: '*', filter: `event_id=eq.${eventId}`, schema: 'public', table: 'expenses' }, () => {
        fetchExpenses();
      })
      .on('postgres_changes', { event: '*', filter: `event_id=eq.${eventId}`, schema: 'public', table: 'todos' }, () => {
        fetchTodos();
      })
      .on('postgres_changes', { event: '*', filter: `event_id=eq.${eventId}`, schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .on('postgres_changes', { event: '*', filter: `event_id=eq.${eventId}`, schema: 'public', table: 'event_members' }, () => {
        fetchMembers();
      })
      .subscribe();

    // Background polling interval for automatic multi-device sync
    const pollingInterval = setInterval(() => {
      fetchEventDetails();
      fetchMembers();
      fetchExpenses();
      fetchTodos();
      fetchMessages();
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollingInterval);
    };
  }, [eventId]);

  // Scroll to bottom when new chat messages arrive
  useEffect(() => {
    if (activeTab === 'chika') {
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, activeTab]);

  // ── Calculations ────────────────────────────────────────────────────────
  // Calculate expenses paid by each member dynamically!
  const mappedMembers = members.map(m => {
    const memberPaid = expenses
      .filter(e => e.payerId === m.id)
      .reduce((sum, e) => sum + e.price, 0);
    return {
      ...m,
      paid: memberPaid,
    };
  });

  const totalCost = expenses.reduce((sum, e) => sum + e.price, 0);
  const perPerson = mappedMembers.length > 0 ? Math.round(totalCost / mappedMembers.length) : 0;
  
  const currentMember = mappedMembers.find(m => m.id === user?.id);
  const userPaid = currentMember ? currentMember.paid : 0;
  const userBalance = userPaid - perPerson;

  // ── Operations ──────────────────────────────────────────────────────────
  const handleAddExpense = async () => {
    if (!expenseName.trim() || !expensePrice.trim()) {
      Alert.alert("Error", "Paki-punan ang pangalan at presyo ng nagastos!");
      return;
    }
    const priceNum = Number(expensePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Error", "Dapat na valid na numero ang presyo!");
      return;
    }

    try {
      // 1. Insert expense matching Supabase columns
      const { error: expError } = await supabase
        .from('expenses')
        .insert({
          event_id: eventId,
          name: expenseName,
          amount: priceNum,
          paid_by: user?.id,
        });

      if (expError) {
        Alert.alert("Error", "Hindi maidagdag ang gastos: " + expError.message);
        return;
      }

      // 2. Post a system message in the chat!
      await supabase.from('messages').insert({
        event_id: eventId,
        type: 'system',
        text: `${userName} added expense "${expenseName}" (₱${priceNum.toLocaleString()})`,
      });

      // 3. Trigger immediate updates locally to eliminate WebSocket delays!
      await fetchExpenses();
      await fetchMessages();

      setIsExpenseModalVisible(false);
      setExpenseName('');
      setExpensePrice('');
      setExpenseExcludes('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTodo = async () => {
    if (!todoText.trim()) {
      Alert.alert("Error", "Paki-lagay naman ang pangalan ng task!");
      return;
    }

    try {
      const { error } = await supabase
        .from('todos')
        .insert({
          event_id: eventId,
          text: todoText,
          done: false,
          assignee: user?.id,
        });

      if (error) {
        Alert.alert("Error", "Hindi magawa ang task: " + error.message);
        return;
      }

      await supabase.from('messages').insert({
        event_id: eventId,
        type: 'system',
        text: `${userName} added task "${todoText}" to the To-Do Board`,
      });

      // Trigger immediate updates locally to eliminate WebSocket delays!
      await fetchTodos();
      await fetchMessages();

      setIsTodoModalVisible(false);
      setTodoText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTodo = async (todoId: string, currentStatus: boolean, text: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ done: !currentStatus })
        .eq('id', todoId);

      if (error) {
        Alert.alert("Error", "Hindi ma-update ang task: " + error.message);
        return;
      }

      await supabase.from('messages').insert({
        event_id: eventId,
        type: 'system',
        text: `${userName} ${!currentStatus ? 'checked off' : 'reopened'} task "${text}"`,
      });

      // Trigger immediate updates locally to eliminate WebSocket delays!
      await fetchTodos();
      await fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    try {
      const textToSend = chatInput;
      setChatInput('');
      
      const { error } = await supabase
        .from('messages')
        .insert({
          event_id: eventId,
          type: 'user',
          sender_id: user?.id,
          text: textToSend,
        });

      if (error) {
        Alert.alert("Error", "Hindi maipadala ang message: " + error.message);
      } else {
        // Trigger immediate updates locally to eliminate WebSocket delays!
        await fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSettleUp = async () => {
    if (userBalance >= 0) {
      Alert.alert("Settle Up", "Settled ka na! Wala ka nang kailangang bayaran. 😎");
      return;
    }
    const amountToPay = Math.abs(userBalance);
    Alert.alert(
      "GCash Settle Up 💳",
      `Gusto mo bang magbayad ng ₱${amountToPay.toLocaleString()} para maging settled na ang account mo?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Settle Up", 
          onPress: async () => {
            try {
              // Add a ledger payment in chat to let everyone know!
              await supabase.from('messages').insert({
                event_id: eventId,
                type: 'system',
                text: `${userName} just settled their balance of ₱${amountToPay.toLocaleString()} via GCash`,
              });

              // Trigger immediate updates locally to eliminate WebSocket delays!
              await fetchExpenses();
              await fetchMessages();
              
              Alert.alert("Success 🎉", "Nabayaran na ang iyong ambagan via GCash! Settled ka na!");
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading command center...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.header, paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.eventTitle, { color: theme.text }]} numberOfLines={1}>
            {event?.name || 'Gala details'}
          </Text>
          <View style={styles.memberAvatars}>
            {mappedMembers.map((m, i) => (
              <View key={m.id} style={[styles.miniAvatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length], marginLeft: i > 0 ? -8 : 0 }]}>
                <Text style={styles.miniAvatarText}>{m.initial}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => {
              Clipboard.setString(eventId);
              Alert.alert("Event ID Copied! 📋", "Kopyado na ang Event ID sa clipboard ng iyong phone! Pwede mo na itong i-share sa barkada.");
            }}
          >
            <Ionicons name="copy-outline" size={20} color={theme.text} />
          </TouchableOpacity>
          <View style={[styles.profileCircle, { backgroundColor: theme.tint }]}>
            <Text style={styles.profileText}>{userName[0]}</Text>
          </View>
        </View>
      </View>

      {/* Event info bar */}
      <View style={[styles.eventBar, { backgroundColor: isDark ? '#1C2128' : '#FFF' }]}>
        <View style={[styles.eventBarIcon, { backgroundColor: isDark ? '#2D333B' : '#FFF3E0' }]}>
          <Ionicons name="compass" size={20} color={theme.accent} />
        </View>
        <Text style={[styles.eventBarName, { color: theme.text }]} numberOfLines={1}>
          {formatDate(event?.date)}
        </Text>
        <View style={styles.eventBarAvatars}>
          {mappedMembers.slice(0, 3).map((m, i) => (
            <View key={m.id} style={[styles.tinyAvatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length], marginLeft: i > 0 ? -6 : 0 }]}>
              <Text style={styles.tinyAvatarText}>{m.initial}</Text>
            </View>
          ))}
          {mappedMembers.length > 3 && (
            <Text style={[styles.extraText, { color: theme.textSecondary }]}>+{mappedMembers.length - 3}</Text>
          )}
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
      {activeTab === 'chika' ? (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 160 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <ScrollView
                ref={chatScrollRef}
                style={styles.chatScrollView}
                contentContainerStyle={styles.chatContentInner}
                keyboardShouldPersistTaps="handled"
              >
                {messages.length === 0 ? (
                  <View style={[styles.emptyStateMini, { backgroundColor: theme.surface, paddingVertical: 40 }]}>
                    <Ionicons name="chatbubbles-outline" size={32} color={theme.textSecondary} style={{ alignSelf: 'center', marginBottom: 8 }} />
                    <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 13 }}>Simulan ang chika para sa gala na ito!</Text>
                  </View>
                ) : (
                  messages.map((msg) => {
                    const isMyMessage = msg.senderId === user?.id;
                    
                    return (
                      <View key={msg.id} style={styles.chikaRow}>
                        {msg.type === 'system' ? (
                          <View style={[styles.systemBubble, { backgroundColor: isDark ? '#2D333B' : '#F0E6D0' }]}>
                            <Ionicons name="information-circle-outline" size={14} color={theme.textSecondary} />
                            <Text style={[styles.systemText, { color: theme.textSecondary }]}>{msg.text}</Text>
                          </View>
                        ) : (
                          <View style={[
                            styles.userBubbleRow,
                            isMyMessage && { justifyContent: 'flex-end' }
                          ]}>
                            {!isMyMessage && (
                              <View style={[styles.chatAvatar, { backgroundColor: theme.tint }]}>
                                <Text style={styles.chatAvatarText}>{msg.sender?.[0] || 'U'}</Text>
                              </View>
                            )}
                            <View style={[
                              styles.userBubble,
                              isMyMessage 
                                ? { backgroundColor: theme.tint, borderBottomRightRadius: 2, borderBottomLeftRadius: 12, borderWidth: 0 }
                                : { backgroundColor: theme.surface, borderColor: theme.cardBorder, borderBottomLeftRadius: 2 }
                            ]}>
                              {!isMyMessage && <Text style={[styles.chatSender, { color: theme.tint }]}>{msg.sender}</Text>}
                              <Text style={[
                                styles.chatMessage,
                                isMyMessage ? { color: '#FFF' } : { color: theme.text }
                              ]}>
                                {msg.text}
                              </Text>
                              <Text style={[
                                styles.chatTime,
                                isMyMessage ? { color: 'rgba(255,255,255,0.7)', textAlign: 'right' } : { color: theme.textSecondary }
                              ]}>
                                {msg.time}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>

          {/* Chat input */}
          <View style={[styles.chatInputRow, { backgroundColor: theme.surface, borderColor: theme.cardBorder, marginBottom: insets.bottom > 0 ? insets.bottom + 4 : 12 }]}>
            <TextInput
              style={[styles.chatInput, { color: theme.text }]}
              placeholder="Mag-chika ka dito..."
              placeholderTextColor={theme.textSecondary}
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.tint }]} onPress={handleSendMessage}>
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <>
          <ScrollView ref={scrollRef} style={styles.content} contentContainerStyle={styles.contentInner}>
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
                  <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Your Share Status (₱{perPerson.toLocaleString()} per person)</Text>
                  <View style={styles.balanceRow}>
                    <View style={[styles.statusDot, { backgroundColor: userBalance >= 0 ? theme.positive : theme.negative }]} />
                    <Text style={[styles.balanceAmount, { color: userBalance >= 0 ? theme.positive : theme.negative }]}>
                      {userBalance >= 0 ? 'YOU ARE OWED' : 'YOU OWE'} ₱{Math.abs(userBalance).toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity style={[styles.gcashButton, { backgroundColor: theme.tint }]} onPress={handleSettleUp}>
                    <Ionicons name="card-outline" size={16} color="#FFF" />
                    <Text style={styles.gcashText}>Settle Up via GCash</Text>
                  </TouchableOpacity>
                </View>

                {/* Resibo feed */}
                <View style={styles.resiboHeader}>
                  <Text style={[styles.resiboLabel, { color: theme.textSecondary }]}>LATEST RESIBO</Text>
                  <View style={[styles.syncDot, { backgroundColor: theme.positive }]} />
                  <Text style={[styles.syncText, { color: theme.positive }]}>Live Sync</Text>
                </View>

                {expenses.length === 0 ? (
                  <View style={[styles.emptyStateMini, { backgroundColor: theme.surface }]}>
                    <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 13 }}>Wala pang nagagastos sa trip na ito.</Text>
                  </View>
                ) : (
                  expenses.map((expense) => (
                    <View key={expense.id} style={[styles.resiboCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                      <View style={styles.resiboLeft}>
                        <View style={[styles.resiboIconWrap, { backgroundColor: isDark ? '#2D333B' : '#F5F5F5' }]}>
                          <Ionicons name={expense.icon} size={20} color={theme.tint} />
                        </View>
                        <View style={styles.resiboInfo}>
                          <View style={styles.resiboNameRow}>
                            <Text style={[styles.resiboName, { color: theme.text }]}>{expense.name}</Text>
                          </View>
                          <Text style={[styles.resiboPrice, { color: theme.text }]}>₱{expense.price.toLocaleString()}</Text>
                          <Text style={[styles.resiboPayer, { color: theme.textSecondary }]}>
                            Paid by: {expense.payer}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
                <View style={styles.fabSpacer} />
              </>
            )}

            {/* BOARD TAB */}
            {activeTab === 'board' && (
              <>
                <Text style={[styles.boardSectionTitle, { color: theme.textSecondary }]}>
                  TO BUY / TO BRING
                </Text>
                {todos.length === 0 ? (
                  <View style={[styles.emptyStateMini, { backgroundColor: theme.surface }]}>
                    <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 13 }}>Wala pang mga task ang board.</Text>
                  </View>
                ) : (
                  todos.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.todoCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
                      onPress={() => handleToggleTodo(item.id, item.done, item.text)}
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
                          Assigned to: {item.assignee}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
                <View style={styles.fabSpacer} />
              </>
            )}
          </ScrollView>

          {/* FAB (only on board + ambagan) */}
          <TouchableOpacity 
            style={[styles.fab, { backgroundColor: theme.tint }]}
            onPress={() => {
              if (activeTab === 'ambagan') setIsExpenseModalVisible(true);
              else if (activeTab === 'board') setIsTodoModalVisible(true);
            }}
          >
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </>
      )}

      {/* ── Modals ────────────────────────────────────── */}
      <Modal
        visible={isExpenseModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsExpenseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Magdagdag ng Gastos 🧾</Text>
            
            <TextInput
              style={[styles.modalInput, { color: theme.text, borderColor: theme.divider }]}
              placeholder="Para saan? (e.g. Meat and Hotdogs)"
              placeholderTextColor={theme.textSecondary}
              value={expenseName}
              onChangeText={setExpenseName}
            />
            
            <TextInput
              style={[styles.modalInput, { color: theme.text, borderColor: theme.divider }]}
              placeholder="Presyo (e.g. 1000)"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={expensePrice}
              onChangeText={setExpensePrice}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButtonCancel, { borderColor: theme.divider }]} 
                onPress={() => setIsExpenseModalVisible(false)}
              >
                <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButtonConfirm, { backgroundColor: theme.tint }]} 
                onPress={handleAddExpense}
              >
                <Text style={styles.confirmText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isTodoModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsTodoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Bagong Task 📝</Text>
            
            <TextInput
              style={[styles.modalInput, { color: theme.text, borderColor: theme.divider }]}
              placeholder="Ano ang dadalhin/bibilhin? (e.g. Ice)"
              placeholderTextColor={theme.textSecondary}
              value={todoText}
              onChangeText={setTodoText}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButtonCancel, { borderColor: theme.divider }]} 
                onPress={() => setIsTodoModalVisible(false)}
              >
                <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButtonConfirm, { backgroundColor: theme.tint }]} 
                onPress={handleAddTodo}
              >
                <Text style={styles.confirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatScrollView: {
    flex: 1,
  },
  chatContentInner: {
    padding: Spacing.lg,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingBottom: 12, paddingHorizontal: Spacing.lg,
  },
  backButton: { padding: 4, marginRight: 8 },
  headerCenter: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: '800' },
  memberAvatars: { flexDirection: 'row', marginTop: 4 },
  miniAvatar: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
  },
  miniAvatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: { padding: 8 },
  profileCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  eventBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: 10,
  },
  eventBarIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  eventBarName: { fontSize: 13, fontWeight: '700', flex: 1 },
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
  systemText: { fontSize: 11, fontStyle: 'italic', flexShrink: 1 },
  userBubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  chatAvatar: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  chatAvatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  userBubble: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, maxWidth: '75%' },
  chatSender: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  chatMessage: { fontSize: 14 },
  chatTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  chatInputRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.full,
    borderWidth: 1, paddingLeft: 16, paddingRight: 4, height: 48,
    marginHorizontal: Spacing.lg,
  },
  chatInput: { flex: 1, fontSize: 14 },
  sendButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  fab: {
    position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6,
  },
  fabSpacer: { height: 80 },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateMini: {
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CCC',
  },

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
});
