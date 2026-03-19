import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function HistoryTabScreen() {
  const { session } = useAuth();

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>A calm place to revisit scripts you made before.</Text>

        <Card style={styles.card}>
          <Text style={styles.stateTitle}>{session ? 'No history yet.' : 'Sign in to see your history.'}</Text>
          <Text style={styles.stateBody}>
            {session
              ? 'Scripts you generate will show up here when you want to look back.'
              : 'Sign in to keep a record of the scripts you create.'}
          </Text>

          <Button
            label={session ? 'Get a script' : 'Sign in'}
            onPress={() => router.push(session ? '/now' : '/create-account')}
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
  stateTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  stateBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
