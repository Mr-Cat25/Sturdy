import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';

export default function NewChildScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Add a child profile</Text>
        <Text style={styles.subtitle}>This helps tailor scripts to your child.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What to add</Text>
          <Text style={styles.cardBody}>Child name is required.</Text>
          <Text style={styles.cardBody}>Age is required.</Text>
          <Text style={styles.cardBody}>No neurotype field here.</Text>
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
