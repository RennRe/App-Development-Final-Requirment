/**
 * Root Layout
 * Wraps the entire app with ThemeProvider and AuthProvider.
 * Shows the Sign-In screen if not logged in, otherwise the main tabs.
 */

import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import SignInScreen from './sign-in';

// Inner layout that reads auth and theme state
function InnerLayout() {
  const { isDark } = useAppTheme();
  const { isSignedIn } = useAuth();

  // If the user hasn't signed in yet, show the sign-in screen
  if (!isSignedIn) {
    return (
      <>
        <SignInScreen />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </>
    );
  }

  // Once signed in, show the normal tab navigation
  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
