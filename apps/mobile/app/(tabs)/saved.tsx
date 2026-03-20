import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { GuestPrompt } from '../../src/components/ui/GuestPrompt';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { loadSavedScripts, type SavedScriptRow } from '../../src/lib/loadSavedScripts';

function formatSavedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Saved recently';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function buildPreview(script: SavedScriptRow) {
  const preview = `${script.regulate} ${script.connect} ${script.guide}`.replace(/\s+/g, ' ').trim();

  if (preview.length <= 140) {
    return preview;
  }

  return `${preview.slice(0, 137).trimEnd()}...`;
}

export default function SavedTabScreen() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const [savedScripts, setSavedScripts] = useState<SavedScriptRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!session) {
      setSavedScripts([]);
      setIsLoading(false);
      setErrorMessage('');
      return;
    }

    let isMounted = true;

    const fetchSavedScripts = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const scripts = await loadSavedScripts();

        if (isMounted) {
          setSavedScripts(scripts);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("We couldn't load your saved scripts right now. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSavedScripts();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, session]);

  const handleRetry = async () => {
    if (!session) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const scripts = await loadSavedScripts();
      setSavedScripts(scripts);
    } catch {
      setErrorMessage("We couldn't load your saved scripts right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <Screen>
        <Card style={styles.stateCard}>
          <Text style={styles.stateTitle}>Loading your saved scripts...</Text>
        </Card>
      </Screen>
    );
  }

  if (!session) {
    return (
      <Screen>
        <GuestPrompt
          title="Save scripts for later"
          body="Create an account to keep scripts, revisit them, and unlock your saved tab."
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
          <Text style={styles.title}>Saved</Text>
          <Text style={styles.subtitle}>A calm place to revisit scripts you wanted to keep.</Text>
        </View>

        {isLoading ? (
          <Card style={styles.stateCard}>
            <Text style={styles.stateTitle}>Loading your saved scripts...</Text>
          </Card>
        ) : null}

        {!isLoading && Boolean(errorMessage) ? (
          <Card style={styles.stateCard}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <View style={styles.retryWrap}>
              <Button label="Try Again" onPress={handleRetry} />
            </View>
          </Card>
        ) : null}

        {!isLoading && !errorMessage && savedScripts.length === 0 ? (
          <Card style={styles.stateCard}>
            <Text style={styles.stateTitle}>No saved scripts yet.</Text>
            <Text style={styles.stateBody}>Save a script here when you want to come back to it.</Text>
          </Card>
        ) : null}

        {!isLoading && !errorMessage ? (
          <View style={styles.list}>
            {savedScripts.map((script) => (
              <Card key={script.id} style={styles.scriptCard}>
                <View style={styles.scriptMetaRow}>
                  <Text style={styles.scriptDate}>{formatSavedAt(script.created_at)}</Text>
                  {script.child_age !== null ? (
                    <View style={styles.ageChip}>
                      <Text style={styles.ageChipText}>Age {script.child_age}</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.scriptTitle}>{script.situation_summary}</Text>
                <Text style={styles.scriptPreview}>{buildPreview(script)}</Text>
              </Card>
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
  retryWrap: {
    paddingTop: spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
  scriptCard: {
    gap: spacing.sm,
  },
  scriptMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scriptDate: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
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
  scriptTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  scriptPreview: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
