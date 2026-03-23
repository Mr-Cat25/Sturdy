import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/ui/Button';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function AccountTabScreen() {
  const { session, isLoading, signOut } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setErrorMessage('');
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace('/welcome');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'We could not sign you out. Please try again.',
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return <View style={styles.safeArea} />;
  }

  if (!session) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>
            Sign in or create an account to save scripts and unlock the full app.
          </Text>
          <View style={styles.card}>
            <Button label="Sign In" onPress={() => router.push('/auth/sign-in')} />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/auth/sign-up')}
              style={({ pressed }) => [styles.createLink, pressed ? styles.createLinkPressed : null]}
            >
              <Text style={styles.createLinkText}>Don&apos;t have an account? Create one free</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Manage your account, legal details, and sign-out in one place.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.emailText}>{session.user.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Plan</Text>
          <Text style={styles.sectionTitle}>Free support</Text>
          <Text style={styles.supportingText}>Your current access is active in the mobile app.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Legal</Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/legal/terms-of-service')}
            style={({ pressed }) => [styles.linkRow, pressed ? styles.linkRowPressed : null]}
          >
            <Text style={styles.linkText}>Terms of Service</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/legal/privacy-policy')}
            style={({ pressed }) => [styles.linkRow, pressed ? styles.linkRowPressed : null]}
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/legal/medical-safety')}
            style={({ pressed }) => [styles.linkRow, pressed ? styles.linkRowPressed : null]}
          >
            <Text style={styles.linkText}>Medical Safety</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/legal/ai-limitations')}
            style={({ pressed }) => [styles.linkRow, pressed ? styles.linkRowPressed : null]}
          >
            <Text style={styles.linkText}>AI Limitations</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Session</Text>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Button
            label={isSigningOut ? 'Signing Out…' : 'Sign Out'}
            onPress={handleSignOut}
            disabled={isSigningOut}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  emailText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  supportingText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  linkRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  linkRowPressed: {
    opacity: 0.72,
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  errorText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
  },
  createLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createLinkPressed: {
    opacity: 0.7,
  },
  createLinkText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

