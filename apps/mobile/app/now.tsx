import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
import { useChildProfile } from '../src/context/ChildProfileContext';
import { getParentingScript } from '../src/lib/api';

export default function NowScreen() {
  const navigation = useRouter();
  const params = useLocalSearchParams<{ reset?: string }>();
  const { width } = useWindowDimensions();
  const { draft } = useChildProfile();
  const [situation, setSituation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isWide = width >= 700;

  const childName = draft.name;
  const childAge = draft.childAge;
  const neurotypes = draft.neurotype;
  const resetToken = Array.isArray(params.reset) ? params.reset[0] : params.reset;

  useEffect(() => {
    if (!resetToken) {
      return;
    }

    setSituation('');
    setErrorMessage('');
  }, [resetToken]);

  const handleGetScript = async () => {
    const message = situation.trim();

    if (!message || childAge === null) {
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const script = await getParentingScript({
        message,
        childAge,
        neurotype: neurotypes,
      });

      navigation.push({
        pathname: '/result',
        params: {
          situationSummary: script.situation_summary,
          regulate: script.regulate,
          connect: script.connect,
          guide: script.guide,
        },
      });
    } catch {
      setErrorMessage('We could not get a script right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label={isLoading ? 'Getting Script...' : 'Get Script'}
          onPress={handleGetScript}
          disabled={!situation.trim() || isLoading || childAge === null}
        />
      }
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={[styles.header, isWide ? styles.headerWide : null]}>
        <Text style={styles.title}>What&apos;s happening right now?</Text>
        <Text style={styles.subtitle}>
          Describe the moment in one or two sentences. Keep it plain and real.
        </Text>
      </View>

      <View style={[styles.contentLayout, isWide ? styles.contentLayoutWide : null]}>
        {(childName || childAge !== null || neurotypes.length) ? (
          <View style={[styles.summaryCard, isWide ? styles.summaryCardWide : null]}>
            <Text style={styles.summaryTitle}>Child summary</Text>
            {childName ? <Text style={styles.summaryText}>Name: {childName}</Text> : null}
            {childAge !== null ? <Text style={styles.summaryText}>Age: {childAge}</Text> : null}
            {neurotypes.length ? (
              <Text style={styles.summaryText}>Neurotype: {neurotypes.join(', ')}</Text>
            ) : null}
          </View>
        ) : null}

        <View style={[styles.formCard, isWide ? styles.formCardWide : null]}>
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
            hint="You&apos;re not writing a report. A simple snapshot is enough."
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  headerWide: {
    maxWidth: 860,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    flexShrink: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
  },
  contentLayout: {
    gap: spacing.lg,
  },
  contentLayoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.successBackground,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryCardWide: {
    flex: 0.9,
    maxWidth: 340,
    minWidth: 260,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    flexShrink: 1,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  formCardWide: {
    flex: 1.4,
    maxWidth: 760,
    minWidth: 0,
  },
  errorText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
  },
});