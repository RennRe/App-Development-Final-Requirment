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

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Subtle press animation on the main button
  const buttonScale = useRef(new Animated.Value(1)).current;

  const animatePress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(callback);
  };

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) animatePress(() => setShowOTP(true));
  };

  const handleVerifyOTP = () => {
    animatePress(() => signIn('Jhirick'));
  };

  const handleGoogleSignIn = () => {
    animatePress(() => signIn('Jhirick'));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Top: artwork hero with logo in corner ───────── */}
      <ImageBackground
        source={require('@/assets/images/SplashScreen.png')}
        style={styles.hero}
        resizeMode="cover"
      >
        {/* Logo icon in upper-left with black outline */}
        <View style={[styles.logoCorner, { paddingTop: insets.top + 14 }]}>
          <View style={styles.logoRing}>
            <Image
              source={require('@/assets/images/Logo.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ImageBackground>

      {/* ── Bottom: card with title + form ──────────────── */}
      <View style={[styles.card, { backgroundColor: isDark ? '#161B22' : '#FFFFFF' }]}>

        {/* "Tara!" title above all buttons */}
        <Text style={[styles.cardTitle, { color: theme.text }]}>Tara!</Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          Sign in to continue
        </Text>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          style={[styles.googleButton, { borderColor: isDark ? '#2D333B' : '#E0E0E0' }]}
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.googleG}>G</Text>
          <Text style={[styles.googleText, { color: theme.text }]}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: isDark ? '#2D333B' : '#EBEBEB' }]} />
          <Text style={[styles.dividerText, { color: theme.textSecondary }]}>o kaya</Text>
          <View style={[styles.dividerLine, { backgroundColor: isDark ? '#2D333B' : '#EBEBEB' }]} />
        </View>

        {/* Phone number input */}
        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Mobile Number</Text>
        <View
          style={[
            styles.phoneRow,
            {
              backgroundColor: isDark ? '#1C2128' : '#F6F6F6',
              borderColor: isDark ? '#2D333B' : '#E0E0E0',
            },
          ]}
        >
          <Ionicons name="flag-outline" size={16} color={Brand.teal} />
          <Text style={[styles.countryCode, { color: theme.text }]}>+63</Text>
          <View style={[styles.phoneSep, { backgroundColor: isDark ? '#2D333B' : '#DDDDDD' }]} />
          <TextInput
            style={[styles.phoneInput, { color: theme.text }]}
            placeholder="912 345 6789"
            placeholderTextColor={theme.textSecondary}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={12}
          />
        </View>

        {/* OTP input — appears after Send OTP */}
        {showOTP && (
          <View>
            <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: Spacing.md }]}>
              Enter 6-digit OTP
            </Text>
            <TextInput
              style={[
                styles.otpInput,
                {
                  color: theme.text,
                  backgroundColor: isDark ? '#1C2128' : '#F6F6F6',
                  borderColor: Brand.teal,
                },
              ]}
              placeholder="• • • • • •"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
              value={otpCode}
              onChangeText={setOtpCode}
              maxLength={6}
              textAlign="center"
            />
          </View>
        )}

        {/* Main action button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: Brand.teal }]}
            onPress={showOTP ? handleVerifyOTP : handleSendOTP}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>
              {showOTP ? 'Verify & Sign In' : 'Send OTP Code'}
            </Text>
            <Ionicons
              name={showOTP ? 'checkmark-circle' : 'arrow-forward'}
              size={18}
              color="#FFF"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Links */}
        <View style={styles.linksRow}>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>New to Tara? </Text>
          <TouchableOpacity>
            <Text style={[styles.linkAction, { color: Brand.teal }]}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}> · </Text>
          <TouchableOpacity>
            <Text style={[styles.linkAction, { color: Brand.teal }]}>Help</Text>
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

  // Logo in the upper-left corner
  logoCorner: {
    paddingHorizontal: Spacing.xl,
  },
  logoRing: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    // Subtle shadow — looks like a soft outline, not a hard border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
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

  // ── Google Button ─────────────────────────────────────
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.lg,
    gap: 10,
  },
  googleG: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Divider ───────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontStyle: 'italic' },

  // ── Phone Input ───────────────────────────────────────
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    height: 50,
    marginBottom: Spacing.md,
    gap: 6,
  },
  countryCode: { fontSize: 15, fontWeight: '700' },
  phoneSep: { width: 1, height: 20, marginHorizontal: Spacing.sm },
  phoneInput: { flex: 1, fontSize: 15 },

  // ── OTP Input ─────────────────────────────────────────
  otpInput: {
    borderWidth: 2,
    borderRadius: Radius.md,
    height: 54,
    fontSize: 24,
    letterSpacing: 10,
    marginBottom: Spacing.md,
  },

  // ── Primary Button ────────────────────────────────────
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    gap: 8,
    shadowColor: Brand.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
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
