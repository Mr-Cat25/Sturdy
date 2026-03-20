import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { GuestPrompt } from '../../src/components/ui/GuestPrompt';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { loadChildProfiles, type ChildProfileRow } from '../../src/lib/childProfiles';

export default function ChildrenTabScreen() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const [children, setChildren] = useState<ChildProfileRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!session) {
      setChildren([]);
      setIsLoading(false);
      setErrorMessage('');
      return;
    }

    let isMounted = true;

    const fetchChildren = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const profiles = await loadChildProfiles();

        if (isMounted) {
          setChildren(profiles);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("We couldn't load your child profiles right now. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchChildren();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, session]);

  if (isAuthLoading) {
    return (
      <Screen>
        <Card style={styles.stateCard}>
          <Text style={styles.stateTitle}>Loading children...</Text>
        </Card>
      </Screen>
    );
  }

  if (!session) {
    return (
      <Screen>
        <GuestPrompt
          title="Add a child profile after you sign in"
          body="Guests can get scripts, and child profiles unlock when you create an account."
          primaryLabel="Create Account"
          secondaryLabel="Sign In"
          onPrimaryPress={() => router.push('/auth/sign-up')}
          onSecondaryPress={() => router.push('/auth/sign-in')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Children</Text>
          <Text style={styles.subtitle}>Keep each child profile simple, personal, and easy to update.</Text>
        </View>

        <Button label="Add Child" onPress={() => router.push('/child/new')} />

        {isLoading ? (
          <Card style={styles.stateCard}>
            <Text style={styles.stateTitle}>Loading children...</Text>
          </Card>
        ) : null}

        {!isLoading && Boolean(errorMessage) ? (
          <Card style={styles.stateCard}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Card>
        ) : null}

        {!isLoading && !errorMessage && children.length === 0 ? (
          <Card style={styles.stateCard}>
            <Text style={styles.stateTitle}>No children added yet.</Text>
            <Text style={styles.stateBody}>Add a child profile so scripts can stay specific to this moment.</Text>
          </Card>
        ) : null}

        {!isLoading && !errorMessage ? (
          <View style={styles.list}>
            {children.map((child) => (
              <Pressable
                accessibilityRole="button"
                key={child.id}
                onPress={() => router.push({ pathname: '/child/[id]', params: { id: child.id } })}
                style={({ pressed }) => [styles.childCardPressed, pressed ? styles.childCardPressedActive : null]}
              >
                <Card style={styles.childCard}>
                  <View style={styles.childMetaRow}>
                    <Text style={styles.childName}>{child.name || 'Unnamed child'}</Text>
                    <View style={styles.ageChip}>
                      <Text style={styles.ageChipText}>{child.child_age}</Text>
                    </View>
                  </View>

                  <Text style={styles.childBody}>Tap to edit this child profile.</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  stateCard: {
    gap: spacing.sm,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  stateBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  errorText: {
    color: '#F2B07A',
    fontSize: 13,
    lineHeight: 18,
  },
  list: {
    gap: spacing.sm,
  },
  childCardPressed: {
    borderRadius: radius.large,
  },
  childCardPressedActive: {
    opacity: 0.9,
  },
  childCard: {
    gap: spacing.sm,
  },
  childMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  childName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    flexShrink: 1,
  },
  ageChip: {
    minHeight: 30,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.chipBackground,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  childBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
