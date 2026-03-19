import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';

import { Button as PrimaryButton } from '../src/components/ui/Button';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
import { useAuth } from '../src/context/AuthContext';
import { useChildProfile } from '../src/context/ChildProfileContext';
import { saveScript } from '../src/lib/saveScript';
import type { ParentingScriptResponse } from '../src/types/parentingScript';

type ResultParams = {
  situationSummary?: string;
  regulate?: string;
  connect?: string;
  guide?: string;
};

function getValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function ResultScreen() {
  const navigation = useRouter();
  const params = useLocalSearchParams<ResultParams>();
  const { width } = useWindowDimensions();
  const { session, isLoading } = useAuth();
  const { draft } = useChildProfile();
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const isWide = width >= 700;

  const script: ParentingScriptResponse = {
    situation_summary:
      getValue(params.situationSummary) || 'We could not load the situation summary for this script.',
    regulate: getValue(params.regulate) || 'We could not load the regulation step for this script.',
    connect: getValue(params.connect) || 'We could not load the connection step for this script.',
    guide: getValue(params.guide) || 'We could not load the guidance step for this script.',
  };

  useEffect(() => {
    setIsSaved(false);
    setIsSaving(false);
    setSaveErrorMessage('');
  }, [script.connect, script.guide, script.regulate, script.situation_summary]);

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
      setSaveErrorMessage('We could not save this script right now. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen
      footer={
        <View style={styles.footerActions}>
          <Pressable
            accessibilityRole="button"
            onPress={handleSaveScript}
            disabled={isLoading || isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              isSaved ? styles.saveButtonSaved : null,
              isLoading || isSaving ? styles.saveButtonDisabled : null,
              pressed ? styles.saveButtonPressed : null,
            ]}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Script'}
            </Text>
          </Pressable>

          {isSaved ? <Text style={styles.saveHelperText}>Script saved.</Text> : null}
          {saveErrorMessage ? <Text style={styles.saveErrorText}>{saveErrorMessage}</Text> : null}

          <PrimaryButton
            label="Try Another"
            onPress={() =>
              navigation.navigate({
                pathname: '/(tabs)',
                params: {
                  reset: String(Date.now()),
                },
              })
            }
          />
        </View>
      }
    >
      <Modal
        animationType="fade"
        onRequestClose={() => setIsSaveModalVisible(false)}
        transparent
        visible={isSaveModalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Save this script</Text>
            <Text style={styles.modalBody}>
              Create a free account to save this script and come back to it later.
            </Text>

            <View style={styles.modalActions}>
              <PrimaryButton
                label="Create Free Account"
                onPress={() => {
                  setIsSaveModalVisible(false);
                  navigation.push('/auth/sign-up');
                }}
              />

              <Pressable
                accessibilityRole="button"
                onPress={() => setIsSaveModalVisible(false)}
                style={({ pressed }) => [
                  styles.maybeLaterButton,
                  pressed ? styles.maybeLaterButtonPressed : null,
                ]}
              >
                <Text style={styles.maybeLaterButtonText}>Maybe Later</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={[styles.header, isWide ? styles.headerWide : null]}>
        <Text style={styles.headerEyebrow}>Sturdy response</Text>
        <Text style={styles.headerSubtext}>A calm first draft you can say in a real voice on a hard day.</Text>
      </View>

      <View style={[styles.messageCard, isWide ? styles.messageCardWide : null]}>
        <Text style={styles.messageLabel}>Your message</Text>
        <Text style={styles.messageText}>{script.situation_summary}</Text>
      </View>

      <View style={[styles.responseCard, isWide ? styles.responseCardWide : null]}>
        <View style={styles.responseHeader}>
          <Text style={styles.responseEyebrow}>Sturdy response</Text>
          <Text style={styles.responseTitle}>One guided way to say it</Text>
          <Text style={styles.responseCaption}>Use this as a single flow, not three separate replies.</Text>
        </View>

        <View style={styles.responseSection}>
          <Text style={styles.sectionTitle}>REGULATE</Text>
          <Text style={styles.sectionHelper}>Get low. Slow voice.</Text>
          <Text style={styles.sectionText}>{script.regulate}</Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.responseSection}>
          <Text style={styles.sectionTitle}>CONNECT</Text>
          <Text style={styles.sectionHelper}>Name the feeling. Stay on their side.</Text>
          <Text style={styles.sectionText}>{script.connect}</Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.responseSection}>
          <Text style={styles.sectionTitle}>GUIDE</Text>
          <Text style={styles.sectionHelper}>Offer one next step they can do.</Text>
          <Text style={styles.sectionText}>{script.guide}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footerActions: {
    gap: spacing.sm,
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
    marginTop: spacing.xs,
  },
  headerWide: {
    maxWidth: 860,
  },
  headerEyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerSubtext: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
  },
  messageCard: {
    backgroundColor: colors.successBackground,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageCardWide: {
    alignSelf: 'center',
    maxWidth: 860,
    width: '100%',
  },
  messageLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  messageText: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    flexShrink: 1,
  },
  responseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  responseCardWide: {
    alignSelf: 'center',
    maxWidth: 860,
    width: '100%',
  },
  responseHeader: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  responseEyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  responseTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    flexShrink: 1,
  },
  responseCaption: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  responseSection: {
    gap: 6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(30, 36, 48, 0.08)',
    marginVertical: spacing.xs,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionHelper: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionText: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    flexShrink: 1,
  },
  saveButton: {
    minHeight: 56,
    borderRadius: radius.medium,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  saveButtonPressed: {
    backgroundColor: colors.chipBackground,
  },
  saveButtonSaved: {
    backgroundColor: colors.successBackground,
    borderColor: colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  saveHelperText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  saveErrorText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 36, 48, 0.28)',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  modalBody: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  modalActions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  maybeLaterButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.medium,
    backgroundColor: colors.successBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  maybeLaterButtonPressed: {
    backgroundColor: colors.chipBackground,
  },
  maybeLaterButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
});
