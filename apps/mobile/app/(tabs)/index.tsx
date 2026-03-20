import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Chip } from '../../src/components/ui/Chip';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';
import { api } from '../../src/lib/api';
import { getGuestChild, type GuestChildProfile } from '../../src/lib/mobileStorage';
import { loadChildProfiles } from '../../src/lib/childProfiles';

const quickSituationPrompts = ['Bedtime meltdown', 'Leaving the park', 'Hitting sibling', 'Refusing homework'];

type ResolvedChild = GuestChildProfile;

export default function HomeTabScreen() {
  const params = useLocalSearchParams<{ reset?: string }>();
  const { session } = useAuth();
  const { draft, setDraft } = useChildProfile();
  const [situation, setSituation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [guestChild, setGuestChildState] = useState<ResolvedChild | null>(null);
  const [selectedChild, setSelectedChild] = useState<ResolvedChild | null>(null);

  const resetToken = Array.isArray(params.reset) ? params.reset[0] : params.reset;

  const activeChild = useMemo(() => {
    if (session) {
      if (selectedChild) {
        return selectedChild;
      }

      if (draft.childAge !== null) {
        return { name: draft.name ?? '', childAge: draft.childAge };
      }

      return null;
    }

    return guestChild;
  }, [draft.childAge, draft.name, guestChild, selectedChild, session]);

  const childName = activeChild?.name?.trim() || 'Child';
  const childAge = activeChild?.childAge ?? draft.childAge ?? 6;
  const canGenerate = situation.trim().length > 0 && !isLoading;

  useEffect(() => {
    if (resetToken) {
      setSituation('');
      setErrorMessage('');
    }
  }, [resetToken]);

  useEffect(() => {
    let isMounted = true;

    const hydrateChild = async () => {
      try {
        if (session) {
          const profiles = await loadChildProfiles();
          const firstProfile = profiles[0];

          if (!isMounted) {
            return;
          }

          if (firstProfile) {
            const resolved = {
              name: firstProfile.name ?? '',
              childAge: firstProfile.child_age,
            } satisfies ResolvedChild;

            setSelectedChild(resolved);
            setDraft({ name: firstProfile.name ?? undefined, childAge: firstProfile.child_age });
            return;
          }

          if (draft.childAge !== null) {
            setSelectedChild({ name: draft.name ?? '', childAge: draft.childAge });
          }

          return;
        }

        const storedGuestChild = await getGuestChild();

        if (!isMounted) {
          return;
        }

        if (storedGuestChild) {
          setGuestChildState(storedGuestChild);
        }
      } catch (error) {
        console.warn('Unable to hydrate child context.', error);
      }
    };

    hydrateChild();

    return () => {
      isMounted = false;
    };
  }, [draft.childAge, draft.name, session, setDraft]);

  const handleGetScript = async () => {
    const message = situation.trim();

    if (!message) {
      setErrorMessage('Add a situation to continue.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const script = await api.parenting.generateGuest({
        childName,
        childAge,
        message,
      });

      router.push({
        pathname: '/result',
        params: {
          message,
          situationSummary: script.situation_summary,
          regulate: script.regulate,
          connect: script.connect,
          guide: script.guide,
        },
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't get a script right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/children')}
            style={({ pressed }) => [styles.agePill, pressed ? styles.agePillPressed : null]}
          >
            <Text style={styles.agePillText}>Age {childAge}</Text>
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>What should I say right now?</Text>
          <Text style={styles.subtitle}>Describe the moment and get calm words you can say right away.</Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.fieldLabel}>Situation</Text>
          <TextInput
            multiline
            onChangeText={(value) => {
              setSituation(value);

              if (errorMessage) {
                setErrorMessage('');
              }
            }}
            placeholder="My child is screaming because we have to leave the park."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={situation}
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </Card>

        <View style={styles.chipSection}>
          <Text style={styles.chipSectionTitle}>Quick prompts</Text>
          <View style={styles.chipRow}>
            {quickSituationPrompts.map((prompt) => (
              <Chip
                key={prompt}
                label={prompt}
                onPress={() => {
                  setSituation(prompt);

                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
                selected={situation.trim() === prompt}
              />
            ))}
          </View>
        </View>

        <Button label={isLoading ? 'Getting Script...' : 'Get Script'} onPress={handleGetScript} disabled={!canGenerate} />

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(session ? '/account' : '/auth/sign-in')}
          style={({ pressed }) => [styles.authLink, pressed ? styles.authLinkPressed : null]}
        >
          <Text style={styles.authLinkText}>{session ? 'Account' : 'Sign In'}</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  logoBadge: {
    minHeight: 52,
    minWidth: 134,
    borderRadius: radius.large,
    backgroundColor: colors.softSectionBackground,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadow.soft,
  },
  logo: {
    width: 120,
    height: 36,
    resizeMode: 'contain',
  },
  agePill: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  agePillPressed: {
    opacity: 0.84,
  },
  agePillText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    flexShrink: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  formCard: {
    gap: spacing.sm,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  input: {
    minHeight: 180,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#F2B07A',
    fontSize: 13,
    lineHeight: 18,
  },
  chipSection: {
    gap: spacing.sm,
  },
  chipSectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  authLink: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  authLinkPressed: {
    opacity: 0.84,
  },
  authLinkText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});
