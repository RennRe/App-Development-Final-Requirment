/**
 * Root Layout
 * Wraps the entire app with ThemeProvider and AuthProvider.
 * Shows the Sign-In screen if not logged in, otherwise the main tabs.
 * Handles splash screen with a smooth fade-out transition.
 */

import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import 'react-native-reanimated';

import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import SignInScreen from './sign-in';

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

// Inner layout that reads auth and theme state
function InnerLayout() {
  const { isDark } = useAppTheme();
  const { isSignedIn } = useAuth();
  const [appReady, setAppReady] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Simulate loading (fonts, assets, etc.), then hide splash
    async function prepare() {
      // Give the app a moment to render underneath
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAppReady(true);

      // Hide the native splash screen
      await SplashScreen.hideAsync();

      // Fade out our custom overlay
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
    prepare();
  }, []);

  // If the user hasn't signed in yet, show the sign-in screen
  if (!isSignedIn) {
    return (
      <>
        <SignInScreen />
        {/* Splash overlay that fades out */}
        {!appReady ? null : (
          <Animated.View
            style={[styles.splashOverlay, { opacity: fadeAnim }]}
            pointerEvents="none"
          />
        )}
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

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
