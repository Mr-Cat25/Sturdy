import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';

export default function CreateAccountScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  return (
    <Screen footer={<Button label="Continue" onPress={() => router.back()} />}>
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
        <Text style={styles.cardTitle}>Account setup is coming next.</Text>
        <Text style={styles.cardBody}>
          This is a placeholder step for the future save-and-history flow. For now, you can head
          back to your script and keep using the app as usual.
        </Text>
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
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
});