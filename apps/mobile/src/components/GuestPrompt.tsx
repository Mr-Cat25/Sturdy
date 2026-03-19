import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from './ui/Button';
import { colors, radius, shadow, spacing } from './ui/theme';

type GuestPromptProps = {
  title?: string;
  body?: string;
};

export function GuestPrompt({
  title = 'Create a free account',
  body = 'Sign up to unlock saved scripts, history, and child profiles.',
}: GuestPromptProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.actions}>
          <Button label="Create Account" onPress={() => router.push('/auth/sign-up')} />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/auth/sign-in')}
            style={({ pressed }) => [styles.signInLink, pressed ? styles.signInLinkPressed : null]}
          >
            <Text style={styles.signInText}>Already have an account? Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  signInLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLinkPressed: {
    opacity: 0.7,
  },
  signInText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textDecorationLine: 'underline',
  },
});
