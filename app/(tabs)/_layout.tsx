/**
 * Tab Layout
 * Bottom navigation with Home, Notifications, and Profile tabs.
 * The Event screen is also in (tabs) but hidden from the tab bar.
 */

import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand } from '@/constants/theme';

export default function TabLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.divider,
        },
      }}
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* Notifications tab */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* Profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* Event screen — hidden from tabs (accessed via push navigation) */}
      <Tabs.Screen
        name="event"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />

      {/* Hide the old explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />

      {/* Settings screen — hidden from tab bar, pushed from Profile */}
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // hides it from the bottom tab bar
        }}
      />
    </Tabs>
  );
}
