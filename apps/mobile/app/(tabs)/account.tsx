import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function AccountTabScreen() {
  const { session, isLoading, signOut } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSavedScriptsPress = () => {
    router.push('/saved');
  };

  const handleSignOut = async () => {
    setErrorMessage('');
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace('/welcome');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "We couldn't sign you out right now. Please try again.",
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>Manage your account and get back to the work you saved.</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.label}>Signed in as</Text>
          <Text style={styles.emailText}>
            {session?.user.email ?? (isLoading ? 'Loading account...' : 'Sign in to manage your account.')}
          </Text>

          {session ? <Button label="Saved scripts" onPress={handleSavedScriptsPress} /> : null}

          {session ? <Button label="Add child" onPress={() => router.push('/child-setup')} /> : null}

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Button
            label={isSigningOut ? 'Signing Out...' : 'Sign Out'}
            onPress={handleSignOut}
            disabled={isSigningOut || !session || isLoading}
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
    marginTop: spacing.xs,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 35,
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
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  emailText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
  errorText: {
    color: '#B45309',
    fontSize: 13,
    lineHeight: 18,
  },
});
