import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Button }          from '../src/components/ui/Button';
import { ScriptCard }      from '../src/components/ui/ScriptCard';
import { Screen }          from '../src/components/ui/Screen';
import { useAuth }         from '../src/context/AuthContext';
import { useChildProfile } from '../src/context/ChildProfileContext';
import { saveScript }      from '../src/lib/saveScript';
import type { ParentingScriptResponse } from '../src/types/parentingScript';
import { colors, radius, shadow, spacing, type } from '../src/theme';

type Params = {
  situationSummary?: string;
  regulate?:         string;
  connect?:          string;
  guide?:            string;
};

const val = (v?: string | string[]) => Array.isArray(v) ? v[0] : v;

export default function ResultScreen() {
  const navigation = useRouter();
  const params     = useLocalSearchParams<Params>();
  const { session, isLoading } = useAuth();
  const { activeChild }        = useChildProfile();

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [feedback, setFeedback]       = useState<'helped' | 'not' | null>(null);
  const [nudgeVisible, setNudgeVisible] = useState(false);

  const script: ParentingScriptResponse = {
    situation_summary: val(params.situationSummary) || 'Situation unavailable.',
    regulate:          val(params.regulate)         || 'Script unavailable.',
    connect:           val(params.connect)          || 'Script unavailable.',
    guide:             val(params.guide)            || 'Script unavailable.',
  };

  useEffect(() => {
    setSaved(false);
    setSaving(false);
    setSaveErr('');
    setFeedback(null);
    setNudgeVisible(false);
  }, [script.regulate]);

  const handleSave = async () => {
    if (isLoading || saving) return;
    if (!session) { setSaveModalVisible(true); return; }
    setSaveModalVisible(false);
    setSaveErr('');
    setSaving(true);
    try {
      await saveScript({
        situation_summary: script.situation_summary,
        regulate:          script.regulate,
        connect:           script.connect,
        guide:             script.guide,
        childAge:          activeChild?.childAge ?? null,
      });
      setSaved(true);
    } catch {
      setSaveErr('Could not save right now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const text = [
      `Regulate: ${script.regulate}`,
      `Connect: ${script.connect}`,
      `Guide: ${script.guide}`,
    ].join('\n\n');
    try { await Share.share({ message: text }); } catch { }
  };

  const handleFeedback = (v: 'helped' | 'not') => {
    setFeedback(v);
    if (v === 'helped') {
      setTimeout(() => setNudgeVisible(true), 400);
    }
  };

  return (
    <Screen
      footer={
        <View style={styles.footerRow}>
          <Button
            label={saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save script'}
            variant="ghost"
            size="md"
            disabled={saved || saving}
            onPress={handleSave}
            style={styles.footerBtn}
          />
          <Button
            label="Try another"
            size="md"
            onPress={() =>
              navigation.push({
                pathname: '/now',
                params:   { reset: Date.now().toString() },
              })
            }
            style={styles.footerBtn}
          />
        </View>
      }
    >
      {/* Situation */}
      <View style={[styles.situation, shadow.sm]}>
        <Text style={styles.situationLabel}>Situation</Text>
        <Text style={styles.situationText}>{script.situation_summary}</Text>
      </View>

      {/* Script cards — staggered */}
      <ScriptCard
        step="Regulate"
        action="Take one slow breath. Move closer."
        script={script.regulate}
        delay={0}
      />
      <ScriptCard
        step="Connect"
        action="Name the feeling. Hold the limit."
        script={script.connect}
        delay={220}
      />
      <ScriptCard
        step="Guide"
        action="One clear next step."
        script={script.guide}
        delay={440}
      />

      {/* Share */}
      <Pressable
        onPress={handleShare}
        style={({ pressed }) => [styles.shareBtn, pressed && { opacity: 0.65 }]}
      >
        <Text style={styles.shareText}>Share script</Text>
      </Pressable>

      {saveErr ? <Text style={styles.saveErr}>{saveErr}</Text> : null}

      {/* Feedback */}
      <View style={[styles.feedbackCard, shadow.sm]}>
        <Text style={styles.feedbackQ}>Did this help?</Text>
        <View style={styles.feedbackBtns}>
          <Pressable
            onPress={() => handleFeedback('helped')}
            style={[
              styles.feedbackBtn,
              feedback === 'helped' && styles.feedbackBtnActive,
            ]}
          >
            <Text style={styles.feedbackBtnText}>👍 That helped</Text>
          </Pressable>
          <Pressable
            onPress={() => handleFeedback('not')}
            style={[
              styles.feedbackBtn,
              feedback === 'not' && styles.feedbackBtnActive,
            ]}
          >
            <Text style={styles.feedbackBtnText}>👎 Not really</Text>
          </Pressable>
        </View>
        {feedback === 'not' ? (
          <Text style={styles.feedbackThanks}>Got it. We'll keep improving.</Text>
        ) : null}
      </View>

      {/* Paywall nudge — after positive feedback */}
      {nudgeVisible ? (
        <View style={[styles.nudge, shadow.sm]}>
          <View style={styles.nudgeHeader}>
            <Text style={styles.nudgeIcon}>✦</Text>
            <Text style={styles.nudgeTitle}>
              Scripts that work{'\n'}deserve to be saved.
            </Text>
          </View>
          <Text style={styles.nudgeBody}>
            This one helped. Upgrade to save every script that works — and
            build a library that knows your child.
          </Text>
          <View style={styles.nudgeStats}>
            {[
              ['5', 'Scripts used'],
              ['0', 'Remaining free'],
              ['$7', '/ month'],
            ].map(([n, l]) => (
              <View key={l} style={styles.nudgeStat}>
                <Text style={styles.nudgeStatNum}>{n}</Text>
                <Text style={styles.nudgeStatLbl}>{l}</Text>
              </View>
            ))}
          </View>
          <Button
            label="Save this · Unlock unlimited"
            variant="amber"
            size="md"
            onPress={() => setNudgeVisible(false)}
          />
          <Pressable
            onPress={() => setNudgeVisible(false)}
            style={styles.nudgeSkip}
          >
            <Text style={styles.nudgeSkipText}>
              I'll use my last free script instead
            </Text>
          </Pressable>
        </View>
      ) : null}

      {/* Guest save modal */}
      <Modal
        visible={saveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, shadow.lg]}>
            <Text style={styles.modalTitle}>Sign in to save</Text>
            <Text style={styles.modalBody}>
              Create a free account to save scripts and build your support library.
            </Text>
            <Button
              label="Create account"
              onPress={() => {
                setSaveModalVisible(false);
                router.push('/auth/sign-up');
              }}
            />
            <Button
              label="Not now"
              variant="ghost"
              size="md"
              onPress={() => setSaveModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

    </Screen>
  );
}

const styles = StyleSheet.create({
  situation: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    gap:             spacing.xxs,
  },
  situationLabel: { ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  situationText:  { ...type.body, color: colors.textSecondary, lineHeight: 24 },

  shareBtn:  { alignSelf: 'center', paddingVertical: spacing.xs },
  shareText: {
    ...type.bodySmall,
    color:              colors.primary,
    fontWeight:         '600',
    textDecorationLine: 'underline',
  },
  saveErr: { ...type.bodySmall, color: colors.dangerDark, textAlign: 'center' },

  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.md,
    gap:             spacing.sm,
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
  feedbackQ:    {
    ...type.label,
    color:         colors.textSecondary,
    textTransform: 'uppercase',
    textAlign:     'center',
  },
  feedbackBtns: { flexDirection: 'row', gap: spacing.sm },
  feedbackBtn: {
    flex:            1,
    height:          44,
    borderRadius:    radius.medium,
    backgroundColor: colors.background,
    borderWidth:     1.5,
    borderColor:     colors.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  feedbackBtnActive: {
    backgroundColor: colors.sageLight,
    borderColor:     'rgba(124,154,135,0.4)',
  },
  feedbackBtnText: { ...type.bodySmall, fontWeight: '700', color: colors.text },
  feedbackThanks:  { ...type.caption, color: colors.textMuted, textAlign: 'center' },

  nudge: {
    backgroundColor: colors.amberLight,
    borderRadius:    radius.large,
    padding:         spacing.lg,
    gap:             spacing.md,
    borderWidth:     1,
    borderColor:     'rgba(200,136,58,0.2)',
  },
  nudgeHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  nudgeIcon:   { fontSize: 18, color: colors.amber, marginTop: 2 },
  nudgeTitle:  {
    fontSize:   17,
    fontWeight: '800',
    color:      colors.text,
    lineHeight: 24,
    flex:       1,
  },
  nudgeBody:    { ...type.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  nudgeStats:   { flexDirection: 'row', gap: spacing.sm },
  nudgeStat: {
    flex:            1,
    backgroundColor: colors.surface,
    borderRadius:    radius.medium,
    padding:         spacing.sm,
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
  nudgeStatNum: { fontSize: 20, fontWeight: '800', color: colors.text },
  nudgeStatLbl: {
    ...type.label,
    color:         colors.textMuted,
    textTransform: 'uppercase',
    textAlign:     'center',
  },
  nudgeSkip:     { alignSelf: 'center', paddingVertical: spacing.xxs },
  nudgeSkipText: { ...type.caption, color: colors.textMuted },

  footerRow: { flexDirection: 'row', gap: spacing.sm },
  footerBtn: { flex: 1 },

  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(26,24,20,0.5)',
    justifyContent:  'center',
    padding:         spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.xl,
    padding:         spacing.xl,
    gap:             spacing.md,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  modalBody:  { ...type.body, color: colors.textSecondary, lineHeight: 24 },
});
