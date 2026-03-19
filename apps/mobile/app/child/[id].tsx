import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/ui/Card';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';

export default function ChildDetailScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Edit child profile</Text>
        <Text style={styles.subtitle}>Keep details current so scripts stay specific to the moment.</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Update details</Text>
          <Text style={styles.cardBody}>Change the name if the child goes by something different.</Text>
          <Text style={styles.cardBody}>Keep the age current.</Text>
          <Text style={styles.cardBody}>Delete the profile if you no longer need it.</Text>
        </Card>
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
    gap: spacing.sm,
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
