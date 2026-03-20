import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { GuestPrompt } from '../../src/components/ui/GuestPrompt';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { deleteChildProfile, getChildProfileById, updateChildProfile } from '../../src/lib/childProfiles';

const ageOptions = Array.from({ length: 16 }, (_, index) => index + 2);

export default function ChildDetailScreen() {
  const { session } = useAuth();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const childId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!session || !childId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadChild = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const profile = await getChildProfileById(childId);

        if (!isMounted) {
          return;
        }

        if (!profile) {
          setErrorMessage('That child profile could not be found.');
          return;
        }

        setName(profile.name ?? '');
        setAge(profile.child_age);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "We couldn't load this child right now. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadChild();

    return () => {
      isMounted = false;
    };
  }, [childId, session]);

  const handleSave = async () => {
    if (!session || !childId) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      await updateChildProfile(childId, { name, childAge: age });
      router.replace('/children');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't update this child right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!session || !childId) {
      return;
    }

    Alert.alert('Delete child profile?', 'This removes the profile from your account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          setErrorMessage('');

          try {
            await deleteChildProfile(childId);
            router.replace('/children');
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "We couldn't delete this child right now. Please try again.");
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  if (!session) {
    return (
      <Screen>
        <GuestPrompt
          title="Sign in to edit child profiles"
          body="Child editing is available once you create an account and sign in."
          primaryLabel="Sign In"
          secondaryLabel="Create Account"
          onPrimaryPress={() => router.push('/auth/sign-in')}
          onSecondaryPress={() => router.push('/auth/sign-up')}
        />
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          <Button label={isSaving ? 'Saving...' : 'Save Child'} onPress={handleSave} disabled={isSaving || isLoading || !childId} />
          <Pressable onPress={handleDelete} style={({ pressed }) => [styles.deleteButton, pressed ? styles.deleteButtonPressed : null]}>
            <Text style={styles.deleteButtonText}>{isDeleting ? 'Deleting...' : 'Delete Child'}</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit child profile</Text>
          <Text style={styles.subtitle}>Keep details current so scripts stay specific to the moment.</Text>
        </View>

        {isLoading ? (
          <Card style={styles.stateCard}>
            <Text style={styles.stateTitle}>Loading child profile...</Text>
          </Card>
        ) : null}

        {!isLoading && Boolean(errorMessage) ? (
          <Card style={styles.stateCard}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Card>
        ) : null}

        {!isLoading && childId ? (
          <Card style={styles.card}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Name (optional)</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={(value) => {
                  setName(value);
                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
                placeholder="What do you call them?"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={name}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Age</Text>
              <View style={styles.ageGrid}>
                {ageOptions.map((option) => {
                  const isSelected = age === option;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={option}
                      onPress={() => setAge(option)}
                      style={({ pressed }) => [
                        styles.agePill,
                        isSelected ? styles.agePillSelected : null,
                        pressed ? styles.agePillPressed : null,
                      ]}
                    >
                      <Text style={[styles.agePillText, isSelected ? styles.agePillTextSelected : null]}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Card>
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
  errorText: {
    color: '#F2B07A',
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    gap: spacing.md,
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  input: {
    minHeight: 58,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  agePill: {
    minWidth: 56,
    minHeight: 56,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  agePillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.chipBackground,
  },
  agePillPressed: {
    opacity: 0.82,
  },
  agePillText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  agePillTextSelected: {
    color: colors.primary,
  },
  footer: {
    gap: spacing.sm,
  },
  deleteButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    opacity: 0.84,
  },
  deleteButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});
