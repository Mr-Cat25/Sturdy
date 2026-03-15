import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../src/components/ui/Button';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
import { useAuth } from '../src/context/AuthContext';

export default function AccountScreen() {
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
        error instanceof Error ? error.message : 'We could not sign you out right now. Please try again.',
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.emailText}>
          {session?.user.email ?? (isLoading ? 'Loading account...' : 'No signed-in account')}
        </Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Button
          label={isSigningOut ? 'Signing Out...' : 'Sign Out'}
          onPress={handleSignOut}
          disabled={isSigningOut || !session || isLoading}
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
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
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
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  emailText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  errorText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
  },
});