import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import { Card } from '../src/components/ui/Card';
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
  const screenTitle = mode === 'sign-up' ? 'Create your account' : 'Welcome back';
  const screenSubtitle =
    mode === 'sign-up'
      ? 'Keep your scripts, child profiles, and history in one place.'
      : 'Get back to your scripts and child profiles.';
  const emailHint =
    mode === 'sign-up'
      ? 'Use an email you can check right now.'
      : 'Use the email for your Sturdy account.';
  const passwordHint =
    mode === 'sign-up' ? 'Use at least 6 characters.' : 'Enter the password for this account.';

  useEffect(() => {
    if (!session) {
      return;
    }

    router.back();
  }, [session]);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setInfoMessage('');
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setInfoMessage('');
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (!password) {
      setInfoMessage('');
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    if (password.length < 6) {
      setInfoMessage('');
      setErrorMessage('Use at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      if (mode === 'sign-up') {
        const { session: createdSession } = await signUpWithEmail(normalizedEmail, password);

        if (!createdSession) {
          setInfoMessage('Account created. Check your inbox if Sturdy asked you to confirm, then sign in.');
        }
      } else {
        await signInWithEmail(normalizedEmail, password);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : mode === 'sign-up'
            ? "We couldn't create your account right now. Check your email and try again."
            : "Check your email and password and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label={isSubmitting ? 'Working...' : submitLabel}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      }
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={[styles.header, isWide ? styles.headerWide : null]}>
        <Text style={styles.title}>{screenTitle}</Text>
        <Text style={styles.subtitle}>
          {screenSubtitle}
        </Text>
      </View>

      <Card style={[styles.card, isWide ? styles.cardWide : null]}>
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
          hint={emailHint}
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
            ? 'Create an account to save scripts and keep your child profiles close at hand.'
            : 'Sign in to keep working from where you left off.'}
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
      </Card>
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
    marginTop: spacing.xs,
  },
  headerWide: {
    maxWidth: 760,
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
    backgroundColor: colors.cardBackground,
  },
  modeChipPressed: {
    opacity: 0.88,
  },
  modeChipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  modeChipTextActive: {
    color: colors.text,
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: '#B45309',
    fontSize: 13,
    lineHeight: 18,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
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
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
});