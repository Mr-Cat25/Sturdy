import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
import { useAuth } from '../src/context/AuthContext';

export default function CreateAccountScreen() {
  const { width } = useWindowDimensions();
  const { session, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<'sign-up' | 'sign-in'>('sign-up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isWide = width >= 700;

  const submitLabel = mode === 'sign-up' ? 'Create Account' : 'Sign In';
  const switchLabel = mode === 'sign-up' ? 'Already have an account? Sign in' : 'Need an account? Create one';
  const passwordHint = useMemo(() => {
    if (!password.length) {
      return 'Use at least 6 characters.';
    }

    return password.length >= 6 ? 'Looks good.' : 'Password must be at least 6 characters.';
  }, [password]);

  useEffect(() => {
    if (!session) {
      return;
    }

    router.back();
  }, [session]);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setInfoMessage('');
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    if (password.length < 6) {
      setInfoMessage('');
      setErrorMessage('Use a password with at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      if (mode === 'sign-up') {
        const { session: createdSession } = await signUpWithEmail(normalizedEmail, password);

        if (!createdSession) {
          setInfoMessage('Account created. Check your email if confirmation is required, then sign in.');
        }
      } else {
        await signInWithEmail(normalizedEmail, password);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'We could not complete auth right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen footer={<Button label={isSubmitting ? 'Working...' : submitLabel} onPress={handleSubmit} disabled={isSubmitting} />}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={[styles.header, isWide ? styles.headerWide : null]}>
        <Text style={styles.title}>Create your free account</Text>
        <Text style={styles.subtitle}>
          Save scripts, keep history, and pick up where you left off.
        </Text>
      </View>

      <View style={[styles.card, isWide ? styles.cardWide : null]}>
        <View style={styles.modeRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setMode('sign-up');
              setErrorMessage('');
              setInfoMessage('');
            }}
            style={({ pressed }) => [
              styles.modeChip,
              styles.modeChipLeft,
              mode === 'sign-up' ? styles.modeChipActive : null,
              pressed ? styles.modeChipPressed : null,
            ]}
          >
            <Text style={[styles.modeChipText, mode === 'sign-up' ? styles.modeChipTextActive : null]}>
              Create account
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setMode('sign-in');
              setErrorMessage('');
              setInfoMessage('');
            }}
            style={({ pressed }) => [
              styles.modeChip,
              styles.modeChipRight,
              mode === 'sign-in' ? styles.modeChipActive : null,
              pressed ? styles.modeChipPressed : null,
            ]}
          >
            <Text style={[styles.modeChipText, mode === 'sign-in' ? styles.modeChipTextActive : null]}>
              Sign in
            </Text>
          </Pressable>
        </View>

        <Input
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          label="Email"
          onChangeText={(value) => {
            setEmail(value);
            if (errorMessage) {
              setErrorMessage('');
            }
          }}
          placeholder="you@example.com"
          value={email}
        />

        <Input
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={mode === 'sign-up' ? 'new-password' : 'password'}
          label="Password"
          onChangeText={(value) => {
            setPassword(value);
            if (errorMessage) {
              setErrorMessage('');
            }
          }}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          hint={passwordHint}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

        <Text style={styles.cardBody}>
          {mode === 'sign-up'
            ? 'Create a simple account now so saved scripts can be available later.'
            : 'Sign in to continue with the same account you already started using.'}
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setMode((current) => (current === 'sign-up' ? 'sign-in' : 'sign-up'));
            setErrorMessage('');
            setInfoMessage('');
          }}
          style={({ pressed }) => [styles.switchButton, pressed ? styles.switchButtonPressed : null]}
        >
          <Text style={styles.switchButtonText}>{switchLabel}</Text>
        </Pressable>
      </View>
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
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  headerWide: {
    maxWidth: 760,
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
  cardWide: {
    alignSelf: 'center',
    maxWidth: 760,
    width: '100%',
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: colors.successBackground,
    borderRadius: radius.medium,
    padding: 4,
  },
  modeChip: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  modeChipLeft: {
    borderTopLeftRadius: radius.medium - 4,
    borderBottomLeftRadius: radius.medium - 4,
  },
  modeChipRight: {
    borderTopRightRadius: radius.medium - 4,
    borderBottomRightRadius: radius.medium - 4,
  },
  modeChipActive: {
    backgroundColor: colors.surface,
  },
  modeChipPressed: {
    opacity: 0.88,
  },
  modeChipText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  modeChipTextActive: {
    color: colors.text,
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  switchButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.medium,
    backgroundColor: colors.successBackground,
    paddingHorizontal: spacing.md,
  },
  switchButtonPressed: {
    backgroundColor: colors.chipBackground,
  },
  switchButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
});