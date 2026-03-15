import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
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
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const isWide = width >= 700;

  const script: ParentingScriptResponse = {
    situation_summary:
      getValue(params.situationSummary) || 'We could not load the situation summary for this script.',
    regulate: getValue(params.regulate) || 'We could not load the regulation step for this script.',
    connect: getValue(params.connect) || 'We could not load the connection step for this script.',
    guide: getValue(params.guide) || 'We could not load the guidance step for this script.',
  };

  return (
    <Screen
      footer={
        <View style={styles.footerActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsSaveModalVisible(true)}
            style={({ pressed }) => [
              styles.saveButton,
              pressed ? styles.saveButtonPressed : null,
            ]}
          >
            <Text style={styles.saveButtonText}>Save Script</Text>
          </Pressable>

          <Button
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
              Create a free account to save this script and come back to it later.
            </Text>

            <View style={styles.modalActions}>
              <Button
                label="Create Free Account"
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
        <Text style={styles.title}>Your script</Text>
        <Text style={styles.subtitle}>A calm first draft you can say in a real voice on a hard day.</Text>
      </View>

      <View style={[styles.sectionsLayout, isWide ? styles.sectionsLayoutWide : null]}>
        <View style={[styles.sectionCard, isWide ? styles.sectionCardWide : null]}>
          <Text style={styles.sectionTitle}>Situation</Text>
          <Text style={styles.sectionText}>{script.situation_summary}</Text>
        </View>

        <View style={[styles.sectionCard, isWide ? styles.sectionCardWide : null]}>
          <Text style={styles.sectionTitle}>Regulate</Text>
          <Text style={styles.sectionText}>{script.regulate}</Text>
        </View>

        <View style={[styles.sectionCard, isWide ? styles.sectionCardWide : null]}>
          <Text style={styles.sectionTitle}>Connect</Text>
          <Text style={styles.sectionText}>{script.connect}</Text>
        </View>

        <View style={[styles.sectionCard, isWide ? styles.sectionCardWide : null]}>
          <Text style={styles.sectionTitle}>Guide</Text>
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
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  headerWide: {
    maxWidth: 860,
  },
  sectionsLayout: {
    gap: spacing.lg,
  },
  sectionsLayoutWide: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    maxWidth: 1080,
    width: '100%',
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
  saveButtonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow,
  },
  sectionCardWide: {
    maxWidth: 520,
    minWidth: 280,
    width: '48%',
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  sectionText: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    flexShrink: 1,
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