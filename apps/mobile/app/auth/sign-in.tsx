import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function SignInScreen() {
  const { session, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace('/(tabs)');
    }
  }, [session]);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await signInWithEmail(normalizedEmail, password);
      router.replace('/(tabs)');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Check your email and password and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen
      footer={
        <View style={styles.footerBlock}>
          <Button label={isSubmitting ? 'Signing In...' : 'Sign In'} onPress={handleSubmit} disabled={isSubmitting} />
          <Pressable onPress={() => router.push('/auth/sign-up')} style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Don't have an account? Sign Up</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.page}>
        <View style={styles.brandWrap}>
          <View style={styles.logoBadge}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your Sturdy account.</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(value) => {
                setEmail(value);
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={email}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                onChangeText={(value) => {
                  setPassword(value);
                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={password}
              />

              <Pressable onPress={() => setShowPassword((current) => !current)} style={styles.eyeButton}>
                <Text style={styles.eyeButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </Pressable>
            </View>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: spacing.lg,
    paddingTop: spacing.md,
  },
  brandWrap: {
    alignItems: 'center',
  },
  logoBadge: {
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softSectionBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logo: {
    width: 148,
    height: 44,
    resizeMode: 'contain',
  },
  header: {
    gap: spacing.xs,
    alignItems: 'center',
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
    gap: spacing.md,
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  input: {
    minHeight: 58,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    minHeight: 58,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  eyeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  eyeButtonText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  errorText: {
    color: '#F2B07A',
    fontSize: 13,
    lineHeight: 18,
  },
  footerBlock: {
    gap: spacing.sm,
  },
  footerLink: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  footerLinkText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});