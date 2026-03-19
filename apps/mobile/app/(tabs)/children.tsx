import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function ChildrenTabScreen() {
  const { session } = useAuth();

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Children</Text>
        <Text style={styles.subtitle}>Keep each child profile simple, personal, and easy to update.</Text>

        <Card style={styles.card}>
          <Text style={styles.stateTitle}>
            {session ? 'No children added yet.' : 'Sign in to manage child profiles.'}
          </Text>
          <Text style={styles.stateBody}>
            {session
              ? 'Add a child profile so scripts can stay specific to this moment.'
              : 'Sign in to add, edit, and save child profiles.'}
          </Text>

          <Button
            label={session ? 'Add child' : 'Sign in'}
            onPress={() => router.push(session ? '/child-setup' : '/create-account')}
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
