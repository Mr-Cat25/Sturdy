import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { GuestPrompt } from '../../src/components/GuestPrompt';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
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
  const { width } = useWindowDimensions();
  const { session, isLoading: isAuthLoading } = useAuth();
  const [savedScripts, setSavedScripts] = useState<SavedScriptRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedScript, setSelectedScript] = useState<SavedScriptRow | null>(null);
  const isWide = width >= 700;

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
          setErrorMessage('We could not load your saved scripts right now. Please try again.');
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
      setErrorMessage('We could not load your saved scripts right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Modal
        animationType="slide"
        onRequestClose={() => setSelectedScript(null)}
        transparent
        visible={Boolean(selectedScript)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Saved script</Text>

            {selectedScript ? (
              <ScrollView
                contentContainerStyle={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Situation</Text>
                  <Text style={styles.detailText}>{selectedScript.situation_summary}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Regulate</Text>
                  <Text style={styles.detailText}>{selectedScript.regulate}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Connect</Text>
                  <Text style={styles.detailText}>{selectedScript.connect}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Guide</Text>
                  <Text style={styles.detailText}>{selectedScript.guide}</Text>
                </View>
              </ScrollView>
            ) : null}

            <Button label="Close" onPress={() => setSelectedScript(null)} />
          </View>
        </View>
      </Modal>

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={[styles.header, isWide ? styles.headerWide : null]}>
        <Text style={styles.title}>Saved Scripts</Text>
        <Text style={styles.subtitle}>A calm place to revisit scripts you wanted to keep.</Text>
      </View>

      {isAuthLoading || isLoading ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Loading saved scripts...</Text>
        </View>
      ) : null}

      {!isAuthLoading && !session ? (
        <GuestPrompt
          title="Saved scripts"
          body="Create an account to save scripts and revisit them whenever you need."
        />
      ) : null}

      {!isLoading && Boolean(errorMessage) ? (
        <View style={styles.stateCard}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <View style={styles.retryWrap}>
            <Button label="Try Again" onPress={handleRetry} />
          </View>
        </View>
      ) : null}

      {!isLoading && !errorMessage && session && savedScripts.length === 0 ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>No saved scripts yet.</Text>
        </View>
      ) : null}

      {!isLoading && !errorMessage && session ? (
        <View style={styles.list}>
          {savedScripts.map((script) => (
            <Pressable
              accessibilityRole="button"
              key={script.id}
              onPress={() => setSelectedScript(script)}
              style={({ pressed }) => [styles.scriptCard, pressed ? styles.scriptCardPressed : null]}
            >
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
            </Pressable>
          ))}
        </View>
      ) : null}
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
    maxWidth: 820,
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
  stateCard: {
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
  errorText: {
    color: '#B45309',
    fontSize: 15,
    lineHeight: 22,
  },
  retryWrap: {
    paddingTop: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
  scriptCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow,
  },
  scriptCardPressed: {
    opacity: 0.92,
  },
  scriptMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  scriptDate: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  ageChip: {
    borderRadius: radius.pill,
    backgroundColor: colors.successBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  ageChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  scriptTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  scriptPreview: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    maxHeight: '86%',
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },
  modalContent: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  detailSection: {
    gap: spacing.xs,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  detailText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
