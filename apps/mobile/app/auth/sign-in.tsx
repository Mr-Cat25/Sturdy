import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function SignInScreen() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await signInWithEmail(normalizedEmail, password);
      router.replace('/');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Sign in failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label={isSubmitting ? 'Signing In…' : 'Sign In'}
          onPress={handleSignIn}
          disabled={isSubmitting}
        />
      }
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.brand}>Sturdy</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your Sturdy account</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(v) => { setEmail(v); if (errorMessage) setErrorMessage(''); }}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={email}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              onChangeText={(v) => { setPassword(v); if (errorMessage) setErrorMessage(''); }}
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
              value={password}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowPassword((s) => !s)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
            </Pressable>
          </View>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/auth/sign-up')}
        style={({ pressed }) => [styles.footerLink, pressed ? styles.footerLinkPressed : null]}
      >
        <Text style={styles.footerLinkText}>Don&apos;t have an account? Sign Up</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  header: {
    gap: spacing.xs,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  brand: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  input: {
    minHeight: 52,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 17,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    lineHeight: 24,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 52,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  eyeText: {
    fontSize: 18,
  },
  errorText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
  },
  footerLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLinkPressed: {
    opacity: 0.7,
  },
  footerLinkText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

