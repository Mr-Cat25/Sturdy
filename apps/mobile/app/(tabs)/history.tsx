import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function HistoryTabScreen() {
  const { session } = useAuth();

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>A calm place to revisit scripts you made before.</Text>

        <View style={styles.card}>
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
    gap: spacing.md,
    ...shadow,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
  stateBody: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});
