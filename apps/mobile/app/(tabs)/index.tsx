import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { Input } from '../../src/components/ui/Input';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { getParentingScript } from '../../src/lib/api';

const QUICK_PROMPTS = [
  'Bedtime meltdown',
  'Leaving the park',
  'Hitting sibling',
  'Refusing homework',
];

type GuestChild = {
  name?: string;
  childAge?: number;
};

export default function NowTabScreen() {
  const params = useLocalSearchParams<{ reset?: string }>();
  const { session } = useAuth();
  const [situation, setSituation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [guestChild, setGuestChild] = useState<GuestChild | null>(null);
  const [isLoadingChild, setIsLoadingChild] = useState(true);

  const resetToken = Array.isArray(params.reset) ? params.reset[0] : params.reset;

  useEffect(() => {
    if (!resetToken) return;
    setSituation('');
    setErrorMessage('');
  }, [resetToken]);

  useEffect(() => {
    async function loadGuestChild() {
      if (session) {
        setIsLoadingChild(false);
        return;
      }
      try {
        const raw = await AsyncStorage.getItem('sturdy_guest_child');
        if (raw) {
          const parsed = JSON.parse(raw) as GuestChild;
          setGuestChild(parsed);
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingChild(false);
      }
    }
    loadGuestChild();
  }, [session]);

  const childAge = guestChild?.childAge ?? null;
  const childName = guestChild?.name;
  const hasText = situation.trim().length > 0;
  const canGenerate = hasText;

  const handleGetScript = async () => {
    const message = situation.trim();
    if (!message) return;

    setErrorMessage('');
    setIsLoading(true);

    try {
      const script = await getParentingScript({
        childName: childName ?? 'Child',
        childAge: childAge ?? 6,
        message,
      });

      router.push({
        pathname: '/result',
        params: {
          situationSummary: script.situation_summary,
          regulate: script.regulate,
          connect: script.connect,
          guide: script.guide,
        },
      });
    } catch (error) {
      setErrorMessage('We could not get a script right now. Please try again.');
      console.log('[STURDY_DEBUG] Get Script failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingChild) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Screen scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? spacing.md : 0}
        style={styles.keyboardContent}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="always"
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header row: title + age pill */}
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title}>What&apos;s happening?</Text>
              <Text style={styles.subtitle}>Describe the moment, get calm words.</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/children')}
              style={({ pressed }) => [styles.agePill, pressed ? styles.agePillPressed : null]}
            >
              <Text style={styles.agePillText}>
                {childAge !== null ? `Age ${childAge}` : 'Set Age'}
              </Text>
            </Pressable>
          </View>

          {/* Input card */}
          <View style={styles.formCard}>
            <Input
              label="Describe the moment"
              multiline
              onChangeText={(value) => {
                setSituation(value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="My child is screaming because we have to leave the park."
              value={situation}
              hint="A simple snapshot is enough."
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </View>

          {/* CTA */}
          <View style={styles.buttonWrap}>
            <Button
              label={isLoading ? 'Getting Script…' : 'Get Script'}
              onPress={handleGetScript}
              disabled={!canGenerate || isLoading}
            />
          </View>

          {/* Quick prompts */}
          <View style={styles.chipSection}>
            <Text style={styles.chipSectionTitle}>Quick prompts</Text>
            <View style={styles.chipRow}>
              {QUICK_PROMPTS.map((prompt) => (
                <Chip
                  key={prompt}
                  label={prompt}
                  onPress={() => {
                    setSituation(prompt);
                    if (errorMessage) setErrorMessage('');
                  }}
                  selected={situation.trim() === prompt}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    flexShrink: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    flexShrink: 1,
  },
  agePill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.chipBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  agePillPressed: {
    opacity: 0.82,
  },
  agePillText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  buttonWrap: {
    gap: spacing.xs,
  },
  chipSection: {
    gap: spacing.sm,
  },
  chipSectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  errorText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
  },
});

