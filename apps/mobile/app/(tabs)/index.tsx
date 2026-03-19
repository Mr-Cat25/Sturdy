import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';

import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { Input } from '../../src/components/ui/Input';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';
import { getParentingScript } from '../../src/lib/api';

const quickSituationPrompts = [
  'Bedtime meltdown',
  'Leaving the park',
  'Hitting sibling',
  'Refusing homework',
];

export default function HomeTabScreen() {
  const navigation = useRouter();
  const params = useLocalSearchParams<{ reset?: string }>();
  const { width } = useWindowDimensions();
  const { session } = useAuth();
  const { draft } = useChildProfile();
  const [situation, setSituation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isWide = width >= 700;

  const childName = draft.name;
  const childAge = draft.childAge;
  const resetToken = Array.isArray(params.reset) ? params.reset[0] : params.reset;
  const scriptHelperText = !childName?.trim()
    ? 'Finish child setup to unlock scripts.'
    : childAge === null
      ? 'Add an age to keep the script specific.'
      : !situation.trim()
        ? 'A few words about the moment is enough.'
        : '';

  useEffect(() => {
    if (!resetToken) {
      return;
    }

    setSituation('');
    setErrorMessage('');
  }, [resetToken]);

  const handleGetScript = async () => {
    const message = situation.trim();

    console.log('[STURDY_DEBUG] Get Script pressed', {
      hasMessage: Boolean(message),
      childAge,
    });

    if (!childName?.trim()) {
      setErrorMessage('Finish child setup to unlock scripts.');
      return;
    }

    if (childAge === null) {
      setErrorMessage('Add an age to keep the script specific.');
      return;
    }

    if (!message) {
      setErrorMessage('Add a few words about the moment to continue.');
      return;
    }

    const payload = {
      childName,
      childAge,
      message,
    };

    console.log('[STURDY_DEBUG] Sending payload', payload);

    setErrorMessage('');
    setIsLoading(true);

    try {
      const script = await getParentingScript(payload);

      navigation.push({
        pathname: '/result',
        params: {
          situationSummary: script.situation_summary,
          regulate: script.regulate,
          connect: script.connect,
          guide: script.guide,
        },
      });
    } catch (error) {
      console.log('[STURDY_DEBUG] Get Script failed', {
        error:
          error instanceof Error ? error.message : typeof error === 'string' ? error : 'unknown-error',
      });
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't get a script right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          <View style={[styles.header, isWide ? styles.headerWide : null]}>
            <Text style={styles.title}>What&apos;s happening right now?</Text>
            <Text style={styles.subtitle}>
              Describe the moment and get calm words you can say right away.
            </Text>
          </View>

          <Card style={[styles.formCard, isWide ? styles.formCardWide : null]}>
            <Input
              label="Describe the moment"
              multiline
              onChangeText={(value) => {
                setSituation(value);

                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
              placeholder="My child is screaming because we have to leave the park."
              value={situation}
              hint="A few words is enough. What happened, where are you, and what do you need to say?"
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </Card>

          <View style={styles.buttonWrap}>
            <Button
              label={isLoading ? 'Getting Script...' : 'Get Script'}
              onPress={handleGetScript}
              disabled={!childName?.trim() || childAge === null || !situation.trim() || isLoading}
            />
            {scriptHelperText ? <Text style={styles.buttonHint}>{scriptHelperText}</Text> : null}
          </View>

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

          <View style={styles.secondaryLinksRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(session ? '/account' : '/create-account')}
              style={({ pressed }) => [styles.secondaryLink, pressed ? styles.secondaryLinkPressed : null]}
            >
              <Text style={styles.secondaryLinkText}>{session ? 'Account' : 'Sign In'}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/saved')}
              style={({ pressed }) => [styles.secondaryLink, pressed ? styles.secondaryLinkPressed : null]}
            >
              <Text style={styles.secondaryLinkText}>Saved</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  header: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  headerWide: {
    maxWidth: 760,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 35,
    flexShrink: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    flexShrink: 1,
  },
  formCard: {
    gap: spacing.sm,
  },
  formCardWide: {
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  buttonWrap: {
    paddingTop: 4,
    gap: spacing.xs,
  },
  chipSection: {
    gap: spacing.xs,
  },
  chipSectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  secondaryLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: 4,
  },
  secondaryLink: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.successBackground,
    justifyContent: 'center',
  },
  secondaryLinkPressed: {
    opacity: 0.82,
  },
  secondaryLinkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  errorText: {
    color: '#B45309',
    fontSize: 13,
    lineHeight: 18,
  },
  buttonHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
});
