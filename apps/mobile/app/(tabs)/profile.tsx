import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';

export default function ProfileTabScreen() {
  const { session } = useAuth();
  const { draft } = useChildProfile();

  const childName = draft.name?.trim();
  const childAge = draft.childAge;
  const hasActiveChild = childAge !== null;
  const activeChildTitle = hasActiveChild
    ? childName
      ? `${childName} · Age ${childAge}`
      : `Your child · Age ${childAge}`
    : 'No active child selected';

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your family context, saved support, and history live here.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Active child</Text>
        <Text style={styles.sectionTitle}>{activeChildTitle}</Text>
        <Text style={styles.bodyText}>
          {hasActiveChild
            ? 'This is the child context currently shaping support inside the app.'
            : 'Add a child so Sturdy can tailor support to the right age.'}
        </Text>
        <Button
          label={hasActiveChild ? 'Add another child' : 'Add child'}
          onPress={() => router.push(session ? '/child/new' : '/create-account')}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Child switching</Text>
        <Text style={styles.sectionTitle}>Child list and switching</Text>
        <Text style={styles.bodyText}>
          Additional child profiles and child switching will live here as this area grows.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/children')}
          style={({ pressed }) => [styles.linkRow, pressed ? styles.linkRowPressed : null]}
        >
          <Text style={styles.linkText}>Open child profiles</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Library</Text>
        <Text style={styles.sectionTitle}>Saved scripts by child</Text>
        <Text style={styles.bodyText}>
          Review saved support in one place, with child context becoming more visible here over time.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/saved')}
          style={({ pressed }) => [styles.linkRow, pressed ? styles.linkRowPressed : null]}
        >
          <Text style={styles.linkText}>Open saved scripts</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>History</Text>
        <Text style={styles.sectionTitle}>History by child</Text>
        <Text style={styles.bodyText}>
          Your past support moments will continue to live here as the profile area fills out.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/history')}
          style={({ pressed }) => [styles.linkRow, pressed ? styles.linkRowPressed : null]}
        >
          <Text style={styles.linkText}>Open history</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginTop: spacing.xs,
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
    gap: spacing.sm,
    ...shadow,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  bodyText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  linkRow: {
    minHeight: 36,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  linkRowPressed: {
    opacity: 0.72,
  },
  linkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
});