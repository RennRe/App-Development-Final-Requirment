/**
 * Root Layout
 * Wraps the entire app with ThemeProvider and AuthProvider.
 * Shows a custom animated splash screen on startup.
 * Then shows Sign-In or the main tabs depending on login state.
 */

import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import 'react-native-reanimated';

import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import SignInScreen from './sign-in';

// Keep the native splash screen visible while we prepare
SplashScreen.preventAutoHideAsync();

// ─── Custom Animated Splash Screen ────────────────────────────────────────────
// This shows our branded splash with a smooth animation sequence:
//   1. Background fades in
//   2. Logo scales up and fades in
//   3. App name fades in below
//   4. Tagline fades in
//   5. Everything fades out and the app appears
function CustomSplash({ onDone }: { onDone: () => void }) {
  // Each animated value controls opacity of one element
  const bgOpacity    = useRef(new Animated.Value(0)).current;
  const logoScale    = useRef(new Animated.Value(0.7)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const tagOpacity   = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run animations in a sequence using Animated.sequence
    Animated.sequence([
      // Step 1: Fade in background quickly
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Step 2: Logo pops in with a scale + fade effect
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Step 3: App name fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      // Step 4: Tagline fades in
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Step 5: Hold for a moment, then fade out everything
      Animated.delay(900),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Tell the parent we're done showing the splash
      onDone();
    });
  }, []);

  return (
    <Animated.View style={[styles.splash, { opacity: bgOpacity }]}>
      {/* Logo */}
      <Animated.Image
        source={require('@/assets/images/Logo.png')}
        style={[
          styles.splashLogo,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
        resizeMode="contain"
      />

      {/* App Name */}
      <Animated.Text style={[styles.splashTitle, { opacity: textOpacity }]}>
        Tara!
      </Animated.Text>


      {/* White overlay that fades in at the end to transition out */}
      <Animated.View
        style={[styles.splashExitOverlay, { opacity: overlayOpacity }]}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

// ─── Inner Layout ─────────────────────────────────────────────────────────────
// Reads auth + theme state, and decides what to show
function InnerLayout() {
  const { isDark } = useAppTheme();
  const { isSignedIn } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide the native Expo splash right away — we use our own custom one
    SplashScreen.hideAsync();
  }, []);

  // While our custom splash is animating, show it on top of everything
  if (showSplash) {
    return (
      <>
        <StatusBar style="dark" />
        <CustomSplash onDone={() => setShowSplash(false)} />
      </>
    );
  }

  // If not signed in, show the sign-in screen
  if (!isSignedIn) {
    return (
      <>
        <SignInScreen />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </>
    );
  }

  // Once signed in, show the main tab navigation
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

// ─── Root Layout ──────────────────────────────────────────────────────────────
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
  // ── Splash Screen ──────────────────────────────────
  splash: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  splashLogo: {
    width: 140,
    height: 140,
    borderRadius: 32,
    marginBottom: 24,
    // Subtle drop shadow — gives a soft outline effect without a hard border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  splashTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: '#3ABFAD',
    letterSpacing: 3,
    marginBottom: 12,
  },

  // White overlay used to fade out the splash smoothly
  splashExitOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
});
