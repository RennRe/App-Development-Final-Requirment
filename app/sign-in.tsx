/**
 * Sign-In Screen
 * Layout:
 *  - Top: artwork hero with logo icon in upper-left (black outline)
 *  - Bottom: card with "Tara!" title at the top, then sign-in buttons below
 */

import { Brand, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Subtle press animation on the main button
  const buttonScale = useRef(new Animated.Value(1)).current;

  const animatePress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(callback);
  };

  const handleGoogleSignIn = () => {
    animatePress(() => signIn('Jhirick'));
  };

  const handleFacebookSignIn = () => {
    animatePress(() => signIn('Jhirick'));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Top: artwork hero ───────────────────────────── */}
      <ImageBackground
        source={require('@/assets/images/SplashScreen.png')}
        style={styles.hero}
        resizeMode="cover"
      />

      {/* ── Bottom: card with title + form ──────────────── */}
      <View style={[styles.card, { backgroundColor: isDark ? '#161B22' : '#FFFFFF' }]}>

        {/* "Tara!" title above all buttons */}
        <Text style={[styles.cardTitle, { color: theme.text }]}>Tara!</Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          Sign in to continue
        </Text>

        {/* Google Sign-In Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: isDark ? '#2D333B' : '#E0E0E0' }]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={[styles.socialText, { color: theme.text }]}>Continue with Google</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Facebook Sign-In Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#1877F2', borderColor: '#1877F2', marginBottom: Spacing.xl }]}
            onPress={handleFacebookSignIn}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
            <Text style={[styles.socialText, { color: '#FFFFFF' }]}>Continue with Facebook</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Links */}
        <View style={styles.linksRow}>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>New to Tara? </Text>
          <TouchableOpacity>
            <Text style={[styles.linkAction, { color: theme.tint }]}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}> · </Text>
          <TouchableOpacity>
            <Text style={[styles.linkAction, { color: theme.tint }]}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Hero artwork (top portion) ────────────────────────
  hero: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  // ── Login Card (bottom portion) ───────────────────────
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 10,
  },

  // "Tara!" title at the top of the card
  cardTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 2,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },

  // ── Social Buttons ────────────────────────────────────
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.md,
    gap: 10,
  },
  googleG: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4285F4',
  },
  socialText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Links ─────────────────────────────────────────────
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  linkText: { fontSize: 13 },
  linkAction: { fontSize: 13, fontWeight: '700' },
});
