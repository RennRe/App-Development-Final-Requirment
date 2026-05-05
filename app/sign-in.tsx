/**
 * Sign-In Screen
 * Matches the Tara! mockup: Google sign-in + OTP via mobile number.
 * Has light/dark mode support.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const { theme, isDark, toggleTheme } = useAppTheme();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Handle the "Send OTP" button
  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      setShowOTP(true);
    }
  };

  // Handle OTP verification (placeholder — just signs in)
  const handleVerifyOTP = () => {
    signIn('Jhirick');
  };

  // Handle Google sign-in (placeholder — just signs in)
  const handleGoogleSignIn = () => {
    signIn('Jhirick');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Theme toggle in corner */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>

        {/* Logo area */}
        <View style={styles.logoArea}>
          <Text style={[styles.logoIcon, { color: Brand.gold }]}>🚐</Text>
          <Text style={[styles.logoText, { color: theme.text }]}>
            TARA!
          </Text>
          <View style={styles.sunBurst}>
            <Text style={{ fontSize: 24 }}>☀️</Text>
          </View>
        </View>

        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          Plan together, pay together,{'\n'}no hiya involved.
        </Text>

        {/* Illustration placeholder */}
        <View style={[styles.illustrationBox, { backgroundColor: isDark ? '#2D333B' : '#F5ECD7' }]}>
          <Text style={styles.illustrationEmoji}>🏖️👨‍👩‍👧‍👦🍖🎉</Text>
          <Text style={[styles.illustrationLabel, { color: theme.textSecondary }]}>
            Puerto Galera
          </Text>
        </View>

        {/* Sign-in card */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          {/* Google button */}
          <TouchableOpacity
            style={[styles.googleButton, { borderColor: theme.cardBorder }]}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={[styles.googleText, { color: theme.text }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <Text style={[styles.helperText, { color: theme.textSecondary }]}>
            It's the fastest, no-fuss way to join!
          </Text>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
              o kaya
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
          </View>

          {/* Mobile number section */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Mobile Number Login
          </Text>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
            Mobile Number
          </Text>

          <View style={[styles.phoneRow, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
            <Text style={styles.flag}>🇵🇭</Text>
            <Text style={[styles.countryCode, { color: theme.text }]}>+63</Text>
            <View style={[styles.phoneDivider, { backgroundColor: theme.divider }]} />
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

          {/* Send OTP button */}
          {!showOTP && (
            <TouchableOpacity
              style={[styles.otpButton, { backgroundColor: Brand.gold }]}
              onPress={handleSendOTP}
            >
              <Text style={styles.otpButtonText}>Send OTP Code</Text>
            </TouchableOpacity>
          )}

          {/* OTP input — shows after tapping Send OTP */}
          {showOTP && (
            <View style={styles.otpSection}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Enter 6-digit OTP
              </Text>
              <TextInput
                style={[styles.otpInput, { 
                  color: theme.text, 
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                }]}
                placeholder="• • • • • •"
                placeholderTextColor={theme.textSecondary}
                keyboardType="number-pad"
                value={otpCode}
                onChangeText={setOtpCode}
                maxLength={6}
                textAlign="center"
              />
              <TouchableOpacity
                style={[styles.otpButton, { backgroundColor: Brand.gold }]}
                onPress={handleVerifyOTP}
              >
                <Text style={styles.otpButtonText}>Verify & Sign In</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
            *Tita/Tito friendly! Use your active mobile number*
          </Text>

          {/* Sign up / Help links */}
          <View style={styles.linksRow}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>
              New to Tara?{' '}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.linkAction, { color: Brand.gold }]}>
                [Sign Up]
              </Text>
            </TouchableOpacity>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>
              {' '}|{' '}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.linkAction, { color: Brand.gold }]}>
                Help [?]
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
    zIndex: 10,
  },

  // Logo
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  logoIcon: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 2,
  },
  sunBurst: {
    marginLeft: 4,
    marginTop: -16,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },

  // Illustration
  illustrationBox: {
    width: '100%',
    borderRadius: Radius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  illustrationEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  illustrationLabel: {
    fontSize: 13,
    fontStyle: 'italic',
  },

  // Card
  card: {
    width: '100%',
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    borderWidth: 1,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Google button
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: Spacing.sm,
    color: '#4285F4',
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: 13,
    fontStyle: 'italic',
  },

  // Mobile Number
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 50,
    marginBottom: Spacing.lg,
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '600',
  },
  phoneDivider: {
    width: 1,
    height: 24,
    marginHorizontal: Spacing.md,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
  },

  // OTP
  otpButton: {
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  otpButtonText: {
    color: Brand.white,
    fontSize: 16,
    fontWeight: '700',
  },
  otpSection: {
    marginBottom: Spacing.sm,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    height: 50,
    fontSize: 24,
    letterSpacing: 8,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },

  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },

  // Links
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  linkText: {
    fontSize: 13,
  },
  linkAction: {
    fontSize: 13,
    fontWeight: '700',
  },
});
