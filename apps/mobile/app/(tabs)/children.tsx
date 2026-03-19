import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function ChildrenTabScreen() {
  const { session } = useAuth();

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Children</Text>
        <Text style={styles.subtitle}>Keep each child profile simple, personal, and easy to update.</Text>

        <View style={styles.card}>
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
