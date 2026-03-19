import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';

export default function SignUpScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Save scripts, keep history, and come back when you need them.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>A few details to get started</Text>
          <Text style={styles.cardBody}>Use an email you can check right now.</Text>
          <Text style={styles.cardBody}>Use a password with at least 6 characters.</Text>
          <Text style={styles.cardBody}>We&apos;ll keep the rest calm and simple.</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
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
    gap: spacing.sm,
    ...shadow,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});
