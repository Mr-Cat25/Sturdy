import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';

import { Card } from '../src/components/ui/Card';
import { Button as PrimaryButton } from '../src/components/ui/Button';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, spacing } from '../src/components/ui/theme';
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
  const [revealStep, setRevealStep] = useState(1);
  const regulateOpacity = useRef(new Animated.Value(0)).current;
  const connectOpacity = useRef(new Animated.Value(0)).current;
  const guideOpacity = useRef(new Animated.Value(0)).current;
  const isWide = width >= 700;

  const script: ParentingScriptResponse = {
    situation_summary:
      getValue(params.situationSummary) || "We couldn't load the situation summary for this script.",
    regulate: getValue(params.regulate) || "We couldn't load the regulation step for this script.",
    connect: getValue(params.connect) || "We couldn't load the connection step for this script.",
    guide: getValue(params.guide) || "We couldn't load the guidance step for this script.",
  };

  useEffect(() => {
    setIsSaved(false);
    setIsSaving(false);
    setSaveErrorMessage('');
  }, [script.connect, script.guide, script.regulate, script.situation_summary]);

  useEffect(() => {
    setRevealStep(1);
    regulateOpacity.setValue(0);
    connectOpacity.setValue(0);
    guideOpacity.setValue(0);

    Animated.timing(regulateOpacity, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();

    const connectTimer = setTimeout(() => {
      setRevealStep(2);
      Animated.timing(connectOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }, 520);

    const guideTimer = setTimeout(() => {
      setRevealStep(3);
      Animated.timing(guideOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }, 1040);

    return () => {
      clearTimeout(connectTimer);
      clearTimeout(guideTimer);
    };
  }, [connectOpacity, guideOpacity, regulateOpacity, script.connect, script.guide, script.regulate, script.situation_summary]);

  const sections = useMemo(
    () => [
      {
        key: 'regulate',
        framing: 'Start here',
        label: 'Regulate',
        helper: 'Set the tone first.',
        body: script.regulate,
        opacity: regulateOpacity,
      },
      {
        key: 'connect',
        framing: 'Then say',
        label: 'Connect',
        helper: 'Stay on their side.',
        body: script.connect,
        opacity: connectOpacity,
      },
      {
        key: 'guide',
        framing: 'Next',
        label: 'Guide',
        helper: 'Offer one simple next step.',
        body: script.guide,
        opacity: guideOpacity,
      },
    ],
    [connectOpacity, guideOpacity, regulateOpacity, script.connect, script.guide, script.regulate],
  );

  const handleAdvanceReveal = () => {
    if (revealStep === 1) {
      setRevealStep(2);
      Animated.timing(connectOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (revealStep === 2) {
      setRevealStep(3);
      Animated.timing(guideOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
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
                pathname: '/now',
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
              Create an account to save this script and come back to it later.
            </Text>

            <View style={styles.modalActions}>
              <PrimaryButton
                label="Create Account"
                onPress={() => {
                  setIsSaveModalVisible(false);
                  navigation.push('/create-account');
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
                <Text style={styles.maybeLaterButtonText}>Not now</Text>
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

      <Card style={[styles.messageCard, isWide ? styles.messageCardWide : null]}>
        <Text style={styles.messageLabel}>Your message</Text>
        <Text style={styles.messageText}>{script.situation_summary}</Text>
      </Card>

      <Card style={[styles.responseCard, isWide ? styles.responseCardWide : null]}>
        <Pressable onPress={handleAdvanceReveal} style={({ pressed }) => [styles.responseHeader, pressed ? styles.responseHeaderPressed : null]}>
          <Text style={styles.responseEyebrow}>Sturdy response</Text>
          <Text style={styles.responseTitle}>Follow this in order</Text>
          <Text style={styles.responseCaption}>
            It reveals one step at a time so you can read it like a real conversation.
          </Text>
          {revealStep < 3 ? <Text style={styles.responseTapHint}>Tap to bring the next step in.</Text> : null}
        </Pressable>

        <View style={styles.sequenceList}>
          {sections.map((section, index) => (
            <Animated.View
              key={section.key}
              style={[
                styles.sequenceSection,
                index === sections.length - 1 ? styles.sequenceSectionLast : null,
                { opacity: section.opacity },
              ]}
            >
              <View style={styles.sequenceFramingRow}>
                <Text style={styles.sequenceFraming}>{section.framing}</Text>
                {revealStep >= index + 1 ? <View style={styles.sequenceDot} /> : null}
              </View>

              <Text style={styles.sequenceLabel}>{section.label}</Text>
              <Text style={styles.sequenceHelper}>{section.helper}</Text>
              <Text style={styles.sequenceText}>{section.body}</Text>
            </Animated.View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footerActions: {
    gap: spacing.xs,
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
    gap: 4,
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
    fontSize: 15,
    lineHeight: 22,
    flexShrink: 1,
  },
  messageCard: {
    gap: spacing.xs,
  },
  messageCardWide: {
    alignSelf: 'center',
    maxWidth: 860,
    width: '100%',
  },
  messageLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  messageText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
    flexShrink: 1,
  },
  responseCard: {
    gap: spacing.sm,
  },
  responseCardWide: {
    alignSelf: 'center',
    maxWidth: 860,
    width: '100%',
  },
  responseHeader: {
    gap: 4,
    paddingBottom: spacing.sm,
  },
  responseHeaderPressed: {
    opacity: 0.94,
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
    fontSize: 13,
    lineHeight: 18,
  },
  responseTapHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  sequenceList: {
    gap: spacing.sm,
  },
  sequenceSection: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 36, 48, 0.08)',
  },
  sequenceSectionLast: {
    paddingBottom: spacing.xs,
  },
  sequenceFramingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sequenceFraming: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  sequenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  sequenceLabel: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
  },
  sequenceHelper: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 18,
  },
  sequenceText: {
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
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  saveHelperText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  saveErrorText: {
    color: '#B45309',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 36, 48, 0.28)',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  modalCard: {
    gap: spacing.md,
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
    gap: spacing.xs,
    marginTop: 4,
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
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
});
