import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { GuestPrompt } from '../../src/components/ui/GuestPrompt';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, spacing } from '../../src/components/ui/theme';
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
      setErrorMessage(error instanceof Error ? error.message : "We couldn't sign you out right now. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!session) {
    return (
      <Screen>
        <GuestPrompt
          title="Sign in to unlock your account"
          body="Create an account to save scripts, view history, and manage child profiles."
          primaryLabel="Sign In"
          secondaryLabel="Create Account"
          onPrimaryPress={() => router.push('/auth/sign-in')}
          onSecondaryPress={() => router.push('/auth/sign-up')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>Manage your account and get back to the work you saved.</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.label}>Signed in as</Text>
          <Text style={styles.emailText}>{session.user.email ?? 'Signed in account'}</Text>

          <View style={styles.linkGroup}>
            <Button label="Saved Scripts" onPress={() => router.push('/saved')} />
            <Button label="History" onPress={() => router.push('/history')} />
            <Button label="Children" onPress={() => router.push('/children')} />
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Button
            label={isSigningOut ? 'Signing Out...' : 'Sign Out'}
            onPress={handleSignOut}
            disabled={isSigningOut || isLoading}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  emailText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  linkGroup: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  errorText: {
    color: '#F2B07A',
    fontSize: 13,
    lineHeight: 18,
  },
});
