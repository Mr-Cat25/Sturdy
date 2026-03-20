import { useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
import { useAuth } from '../src/context/AuthContext';
import { useChildProfile } from '../src/context/ChildProfileContext';
import { saveScript } from '../src/lib/saveScript';
import type { ParentingScriptResponse } from '../src/types/parentingScript';

type ResultParams = {
  message?: string;
  situationSummary?: string;
  regulate?: string;
  connect?: string;
  guide?: string;
};

function getValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function ResultScreen() {
  const params = useLocalSearchParams<ResultParams>();
  const { session, isLoading } = useAuth();
  const { draft } = useChildProfile();
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');

  const script: ParentingScriptResponse = {
    situation_summary:
      getValue(params.situationSummary) || 'We could not load the situation summary for this script.',
    regulate: getValue(params.regulate) || 'We could not load the regulate step for this script.',
    connect: getValue(params.connect) || 'We could not load the connect step for this script.',
    guide: getValue(params.guide) || 'We could not load the guide step for this script.',
  };

  const message = getValue(params.message) || script.situation_summary;
  const childLabel = draft.name?.trim() ? `${draft.name.trim()}, age ${draft.childAge ?? 'unknown'}` : draft.childAge ? `Age ${draft.childAge}` : 'Child context not set';

  const shareText = useMemo(
    () =>
      [
        `Situation: ${script.situation_summary}`,
        `Regulate: ${script.regulate}`,
        `Connect: ${script.connect}`,
        `Guide: ${script.guide}`,
      ].join('\n\n'),
    [script.connect, script.guide, script.regulate, script.situation_summary],
  );

  useEffect(() => {
    setIsSaved(false);
    setIsSaving(false);
    setSaveErrorMessage('');
    setIsSaveModalVisible(false);
  }, [script.connect, script.guide, script.regulate, script.situation_summary]);

  const handleShare = async () => {
    try {
      await Share.share({ message: shareText });
    } catch (error) {
      console.warn('Unable to share script.', error);
    }
  };

  const handleSaveScript = async () => {
    if (isLoading || isSaving) {
      return;
    }

    if (!session) {
      setSaveErrorMessage('');
      setIsSaveModalVisible(true);
      return;
    }

    setIsSaveModalVisible(false);
    setSaveErrorMessage('');
    setIsSaving(true);

    try {
      await saveScript({
        situation_summary: script.situation_summary,
        regulate: script.regulate,
        connect: script.connect,
        guide: script.guide,
        childAge: draft.childAge,
      });
      setIsSaved(true);
    } catch {
      setSaveErrorMessage("We couldn't save this script right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen
      footer={
        <View style={styles.footerActions}>
          <Button
            label="Try Another"
            onPress={() =>
              router.replace({
                pathname: '/(tabs)',
                params: { reset: String(Date.now()) },
              })
            }
          />

          <View style={styles.inlineActions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleSaveScript}
              disabled={isLoading || isSaving || isSaved}
              style={({ pressed }) => [styles.secondaryAction, pressed ? styles.secondaryActionPressed : null]}
            >
              <Text style={styles.secondaryActionText}>{isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleShare}
              style={({ pressed }) => [styles.secondaryAction, pressed ? styles.secondaryActionPressed : null]}
            >
              <Text style={styles.secondaryActionText}>Share</Text>
            </Pressable>
          </View>

          {isSaved ? <Text style={styles.helperText}>Script saved.</Text> : null}
          {saveErrorMessage ? <Text style={styles.errorText}>{saveErrorMessage}</Text> : null}
        </View>
      }
    >
      <Modal animationType="fade" onRequestClose={() => setIsSaveModalVisible(false)} transparent visible={isSaveModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Save this script</Text>
            <Text style={styles.modalBody}>Create an account to save this script and come back to it later.</Text>

            <View style={styles.modalActions}>
              <Button
                label="Create Account"
                onPress={() => {
                  setIsSaveModalVisible(false);
                  router.push('/auth/sign-up');
                }}
              />

              <Pressable
                accessibilityRole="button"
                onPress={() => setIsSaveModalVisible(false)}
                style={({ pressed }) => [styles.closeButton, pressed ? styles.closeButtonPressed : null]}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your script</Text>
          <Text style={styles.headerSubtitle}>Structured, calm language for the moment in front of you.</Text>
          <View style={styles.contextPill}>
            <Text style={styles.contextPillText}>{childLabel}</Text>
          </View>
        </View>

        <Card style={styles.messageCard}>
          <Text style={styles.cardLabel}>Your message</Text>
          <Text style={styles.messageText}>{message}</Text>
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Situation summary</Text>
          <Text style={styles.summaryText}>{script.situation_summary}</Text>
        </Card>

        <Card style={styles.toneBanner}>
          <Text style={styles.bannerLabel}>Tone</Text>
          <Text style={styles.bannerText}>Calm, direct, and steady.</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>REGULATE</Text>
          <Text style={styles.sectionText}>{script.regulate}</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>CONNECT</Text>
          <Text style={styles.sectionText}>{script.connect}</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>GUIDE</Text>
          <Text style={styles.sectionText}>{script.guide}</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>AVOID SAYING</Text>
          <Text style={styles.sectionText}>Do not lecture, over-explain, or pile on too many directions at once.</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>NOTES / FINAL GUIDANCE</Text>
          <Text style={styles.sectionText}>Keep it short, then pause. Repeat the first line if the moment gets bigger.</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  footerActions: {
    gap: spacing.sm,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionPressed: {
    opacity: 0.82,
  },
  secondaryActionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  errorText: {
    color: '#F2B07A',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 11, 20, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  modalBody: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  modalActions: {
    gap: spacing.sm,
  },
  closeButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    opacity: 0.84,
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textDecorationLine: 'underline',
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
  backButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  header: {
    gap: spacing.xs,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  contextPill: {
    alignSelf: 'flex-start',
    minHeight: 34,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.softSectionBackground,
    justifyContent: 'center',
  },
  contextPillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  messageCard: {
    gap: spacing.sm,
  },
  summaryCard: {
    gap: spacing.sm,
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  messageText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  summaryText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  toneBanner: {
    gap: spacing.xs,
    backgroundColor: colors.softSectionBackground,
    borderColor: colors.borderSoft,
  },
  bannerLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  bannerText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  sectionCard: {
    gap: spacing.xs,
  },
  sectionLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  sectionText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
});
