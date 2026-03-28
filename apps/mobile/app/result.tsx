// app/result.tsx — Updated for expanded schema
// Renders parent_action + script per step
// Renders avoid phrases card at the bottom

import { useMemo, useEffect, useState } from 'react';
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
import { colors, radius, shadow, spacing, type } from '../src/theme';

// ─────────────────────────────────────────────
// Fallback scripts — local, no network needed
// ─────────────────────────────────────────────

const FALLBACKS = [
  {
    situation_summary: 'A hard moment is happening right now.',
    regulate:  { parent_action: 'Take one breath. Move closer.', script: 'You\'re really upset right now.' },
    connect:   { parent_action: 'Stay calm. Hold the limit.',    script: 'I can see this is hard. I\'m here.' },
    guide:     { parent_action: 'Give one clear option.',        script: 'Let\'s take one step at a time.' },
    avoid:     ['Stop this right now', 'Calm down', 'You\'re fine'],
  },
  {
    situation_summary: 'Your child is struggling right now.',
    regulate:  { parent_action: 'Lower your voice. Get low.', script: 'That was really hard.' },
    connect:   { parent_action: 'Stay close. Don\'t rush.',   script: 'I hear you. I\'m not going anywhere.' },
    guide:     { parent_action: 'One step. Keep it simple.',  script: 'We\'ll figure this out together.' },
    avoid:     ['Why would you do that?', 'You always do this', 'Just stop'],
  },
];

function isValid(v: unknown): boolean {
  return typeof v === 'string' && (v as string).trim().length > 4;
}

function isValidStep(v: unknown): v is { parent_action: string; script: string } {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return isValid(s.parent_action) && isValid(s.script);
}

// Params come as flat strings from router
type Params = {
  situationSummary?:        string;
  regulateAction?:          string;
  regulateScript?:          string;
  connectAction?:           string;
  connectScript?:           string;
  guideAction?:             string;
  guideScript?:             string;
  avoid?:                   string; // JSON stringified array
};

const val = (v?: string | string[]) => Array.isArray(v) ? v[0] : v;

export default function ResultScreen() {
  const navigation = useRouter();
  const params     = useLocalSearchParams<Params>();
  const { session, isLoading } = useAuth();
  const { activeChild }        = useChildProfile();

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saveErr,  setSaveErr]  = useState('');
  const [feedback, setFeedback] = useState<'helped' | 'not' | null>(null);
  const [nudgeVisible, setNudgeVisible] = useState(false);

  // Build script from params or fallback
  const isFallback = !isValid(val(params.regulateScript));

  const fallbackIndex = useMemo(
    () => Math.floor(Math.random() * FALLBACKS.length),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.regulateScript],
  );
  const fallback = FALLBACKS[fallbackIndex];

  const script = {
    situation_summary: isValid(val(params.situationSummary))
      ? val(params.situationSummary)!
      : fallback.situation_summary,
    regulate: isValid(val(params.regulateAction)) && isValid(val(params.regulateScript))
      ? { parent_action: val(params.regulateAction)!, script: val(params.regulateScript)! }
      : fallback.regulate,
    connect: isValid(val(params.connectAction)) && isValid(val(params.connectScript))
      ? { parent_action: val(params.connectAction)!, script: val(params.connectScript)! }
      : fallback.connect,
    guide: isValid(val(params.guideAction)) && isValid(val(params.guideScript))
      ? { parent_action: val(params.guideAction)!, script: val(params.guideScript)! }
      : fallback.guide,
    avoid: (() => {
      try {
        const raw = val(params.avoid);
        if (!raw) return fallback.avoid;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback.avoid;
      } catch { return fallback.avoid; }
    })(),
  };

  const scriptId = useMemo(
    () => `${script.regulate.script.slice(0, 15)}-${Date.now()}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.regulateScript],
  );

  useEffect(() => {
    setSaved(false); setSaving(false); setSaveErr('');
    setFeedback(null); setNudgeVisible(false);
  }, [params.regulateScript]);

  const handleSave = async () => {
    if (isLoading || saving) return;
    if (!session) { setSaveModalVisible(true); return; }
    setSaveModalVisible(false);
    setSaveErr(''); setSaving(true);
    try {
      await saveScript({
        situation_summary: script.situation_summary,
        regulate:          script.regulate,
        connect:           script.connect,
        guide:             script.guide,
        avoid:             script.avoid,
        childAge:          activeChild?.childAge ?? null,
      });
      setSaved(true);
    } catch {
      setSaveErr('Could not save right now. Please try again.');
    } finally { setSaving(false); }
  };

  const handleShare = async () => {
    const text = [
      `Regulate: ${script.regulate.script}`,
      `Connect: ${script.connect.script}`,
      `Guide: ${script.guide.script}`,
    ].join('\n\n');
    try { await Share.share({ message: text }); } catch { }
  };

  const handleFeedback = (v: 'helped' | 'not') => {
    setFeedback(v);
    if (v === 'helped') setTimeout(() => setNudgeVisible(true), 400);
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
            onPress={() => navigation.push({ pathname: '/now', params: { reset: Date.now().toString() } })}
            style={styles.footerBtn}
          />
        </View>
      }
    >
      {/* Back */}
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      {/* Fallback notice */}
      {isFallback ? (
        <View style={[styles.fallbackNotice, shadow.sm]}>
          <Text style={styles.fallbackIcon}>🌿</Text>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.fallbackTitle}>Couldn't connect right now</Text>
            <Text style={styles.fallbackBody}>
              Here's a general script to start with. Try again for one matched to your child.
            </Text>
          </View>
        </View>
      ) : null}

      {/* Situation */}
      <View style={[styles.situation, shadow.sm]}>
        <Text style={styles.situationLabel}>
          {isFallback ? 'General support' : 'Situation'}
        </Text>
        <Text style={styles.situationText}>{script.situation_summary}</Text>
      </View>

      {/* Script cards */}
      <ScriptCard
        key={`regulate-${scriptId}`}
        step="Regulate"
        parent_action={script.regulate.parent_action}
        script={script.regulate.script}
        delay={0}
      />
      <ScriptCard
        key={`connect-${scriptId}`}
        step="Connect"
        parent_action={script.connect.parent_action}
        script={script.connect.script}
        delay={200}
      />
      <ScriptCard
        key={`guide-${scriptId}`}
        step="Guide"
        parent_action={script.guide.parent_action}
        script={script.guide.script}
        delay={400}
      />

      {/* Avoid card */}
      {script.avoid.length > 0 ? (
        <View style={[styles.avoidCard, shadow.sm]}>
          <Text style={styles.avoidLabel}>In this moment, avoid saying</Text>
          <View style={styles.avoidPhrases}>
            {script.avoid.map((phrase, i) => (
              <View key={i} style={styles.avoidPill}>
                <Text style={styles.avoidPillText}>✕  {phrase}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Share */}
      <Pressable
        onPress={handleShare}
        style={({ pressed }) => [styles.shareBtn, pressed && { opacity: 0.65 }]}
      >
        <Text style={styles.shareText}>Share script</Text>
      </Pressable>

      {saveErr ? <Text style={styles.saveErr}>{saveErr}</Text> : null}

      {/* Feedback */}
      {!isFallback ? (
        <View style={[styles.feedbackCard, shadow.sm]}>
          <Text style={styles.feedbackQ}>Did this help?</Text>
          <View style={styles.feedbackBtns}>
            <Pressable
              onPress={() => handleFeedback('helped')}
              style={[styles.feedbackBtn, feedback === 'helped' && styles.feedbackBtnActive]}
            >
              <Text style={styles.feedbackBtnText}>👍 That helped</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFeedback('not')}
              style={[styles.feedbackBtn, feedback === 'not' && styles.feedbackBtnActive]}
            >
              <Text style={styles.feedbackBtnText}>👎 Not really</Text>
            </Pressable>
          </View>
          {feedback === 'not' ? (
            <Text style={styles.feedbackThanks}>Got it. We'll keep improving.</Text>
          ) : null}
        </View>
      ) : (
        <View style={[styles.feedbackCard, shadow.sm]}>
          <Text style={styles.feedbackQ}>Ready to try again?</Text>
          <Button
            label="Get a personalised script"
            size="md"
            onPress={() => navigation.push({ pathname: '/now', params: { reset: Date.now().toString() } })}
          />
        </View>
      )}

      {/* Paywall nudge */}
      {nudgeVisible ? (
        <View style={[styles.nudge, shadow.sm]}>
          <View style={styles.nudgeHeader}>
            <Text style={styles.nudgeIcon}>✦</Text>
            <Text style={styles.nudgeTitle}>Scripts that work deserve to be saved.</Text>
          </View>
          <Text style={styles.nudgeBody}>
            Upgrade to save every script — and build a library that knows your child.
          </Text>
          <Button label="Save this · Unlock unlimited" variant="amber" size="md" onPress={() => setNudgeVisible(false)} />
          <Pressable onPress={() => setNudgeVisible(false)} style={styles.nudgeSkip}>
            <Text style={styles.nudgeSkipText}>Maybe later</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Guest save modal */}
      <Modal visible={saveModalVisible} transparent animationType="fade" onRequestClose={() => setSaveModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, shadow.lg]}>
            <Text style={styles.modalTitle}>Sign in to save</Text>
            <Text style={styles.modalBody}>
              Create a free account to save scripts and build your support library.
            </Text>
            <Button label="Create account" onPress={() => { setSaveModalVisible(false); router.push('/auth/sign-up'); }} />
            <Button label="Not now" variant="ghost" size="md" onPress={() => setSaveModalVisible(false)} />
          </View>
        </View>
      </Modal>

    </Screen>
  );
}

const styles = StyleSheet.create({
  back:     { alignSelf: 'flex-start', paddingVertical: spacing.xs },
  backText: { ...type.body, fontWeight: '600', color: colors.textSecondary },

  fallbackNotice: {
    backgroundColor: colors.sageLight, borderRadius: radius.large,
    padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start',
    gap: spacing.sm, borderWidth: 1, borderColor: 'rgba(124,154,135,0.3)',
  },
  fallbackIcon:  { fontSize: 20, marginTop: 1 },
  fallbackTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  fallbackBody:  { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  situation: {
    backgroundColor:   colors.surface,
    borderRadius:      radius.large,
    padding:           spacing.md,
    borderLeftWidth:   3,
    borderLeftColor:   colors.primary,
    gap:               spacing.xxs,
    borderTopWidth:    1,
    borderRightWidth:  1,
    borderBottomWidth: 1,
    borderTopColor:    colors.borderSoft,
    borderRightColor:  colors.borderSoft,
    borderBottomColor: colors.borderSoft,
  },
  situationLabel: { ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  situationText:  { ...type.body, color: colors.textSecondary, lineHeight: 24 },

  // Avoid card
  avoidCard: {
    backgroundColor: colors.backgroundSoft,
    borderRadius:    radius.large,
    padding:         spacing.md,
    gap:             spacing.sm,
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
  avoidLabel:   { ...type.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  avoidPhrases: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  avoidPill: {
    backgroundColor:   colors.dangerLight,
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical:   5,
    borderWidth:       1,
    borderColor:       'rgba(201,91,91,0.2)',
  },
  avoidPillText: { fontSize: 12, fontWeight: '600', color: colors.dangerDark },

  shareBtn:  { alignSelf: 'center', paddingVertical: spacing.xs },
  shareText: { ...type.bodySmall, color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' },
  saveErr:   { ...type.bodySmall, color: colors.dangerDark, textAlign: 'center' },

  feedbackCard: {
    backgroundColor: colors.surface, borderRadius: radius.large,
    padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.borderSoft,
  },
  feedbackQ:         { ...type.label, color: colors.textSecondary, textTransform: 'uppercase', textAlign: 'center' },
  feedbackBtns:      { flexDirection: 'row', gap: spacing.sm },
  feedbackBtn: {
    flex: 1, height: 44, borderRadius: radius.medium,
    backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  feedbackBtnActive: { backgroundColor: colors.sageLight, borderColor: 'rgba(124,154,135,0.4)' },
  feedbackBtnText:   { ...type.bodySmall, fontWeight: '700', color: colors.text },
  feedbackThanks:    { ...type.caption, color: colors.textMuted, textAlign: 'center' },

  nudge: {
    backgroundColor: colors.amberLight, borderRadius: radius.large,
    padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: 'rgba(200,136,58,0.2)',
  },
  nudgeHeader:   { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  nudgeIcon:     { fontSize: 18, color: colors.amber, marginTop: 2 },
  nudgeTitle:    { fontSize: 17, fontWeight: '800', color: colors.text, lineHeight: 24, flex: 1 },
  nudgeBody:     { ...type.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  nudgeSkip:     { alignSelf: 'center', paddingVertical: spacing.xxs },
  nudgeSkipText: { ...type.caption, color: colors.textMuted },

  footerRow: { flexDirection: 'row', gap: spacing.sm },
  footerBtn: { flex: 1 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(26,24,20,0.5)',
    justifyContent: 'center', padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.xl, gap: spacing.md,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  modalBody:  { ...type.body, color: colors.textSecondary, lineHeight: 24 },
});


