// app/welcome/index.tsx — Fixed for new expanded schema
// Trial fetch now reads regulate.script not regulate (string)
// Page 2 uses ScrollView to prevent cutoff on small screens

import { useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage     from '@react-native-async-storage/async-storage';
import { router }       from 'expo-router';
import { StatusBar }    from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button }       from '../../src/components/ui/Button';
import { colors, radius, spacing, type } from '../../src/theme';

const { width: W } = Dimensions.get('window');
const QUICK_AGES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

// ─────────────────────────────────────────────
// Trial API — handles new expanded schema
// regulate is now { parent_action, script }
// ─────────────────────────────────────────────

async function getTrialScript(params: {
  childName: string;
  childAge:  number;
  message:   string;
}): Promise<{ regulate: string } | null> {
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/chat-parenting-assistant`,
      {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify(params),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.response_type === 'crisis') return null;

    // Handle expanded schema — regulate is { parent_action, script }
    const extractScript = (step: unknown): string => {
      if (typeof step === 'string') return step;
      if (step && typeof step === 'object' && 'script' in step) {
        return (step as { script: string }).script;
      }
      return '';
    };

    const regulate = extractScript(data.regulate);
    if (!regulate) return null;
    return { regulate };
  } catch {
    return null;
  }
}

export default function WelcomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [page,      setPage]      = useState(0);
  const [childName, setChildName] = useState('');
  const [childAge,  setChildAge]  = useState<number | null>(null);
  const [situation, setSituation] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<{ regulate: string } | null>(null);
  const [error,     setError]     = useState('');
  const [saving,    setSaving]    = useState(false);

  const canTry = childAge !== null && situation.trim().length > 0;

  const goTo = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * W, animated: true });
    setPage(i);
  };

  const handleTry = async () => {
    if (!canTry || loading) return;
    setError(''); setLoading(true); setResult(null);
    const script = await getTrialScript({
      childName: childName.trim() || 'your child',
      childAge:  childAge!,
      message:   situation.trim(),
    });
    setLoading(false);
    if (!script) { setError("Couldn't get a script right now. Please try again."); return; }
    setResult({ regulate: script.regulate });
  };

  const handleSignUp = async () => {
    if (saving) return;
    setSaving(true);
    try { await AsyncStorage.setItem('sturdy_welcome_done', 'true'); } catch { }
    setSaving(false);
    router.replace('/auth/sign-up');
  };

  const resetTrial = () => {
    setResult(null); setError('');
    setSituation(''); setChildAge(null); setChildName('');
    goTo(0);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.pager}
      >

        {/* ════ PAGE 1 — Hero ════ */}
        <View style={[styles.page, { width: W }]}>
          <View style={styles.heroContent}>
            <View style={styles.wordmarkRow}>
              <View style={styles.wordmarkDot} />
              <Text style={styles.wordmark}>STURDY</Text>
            </View>
            <Text style={styles.headline}>
              What should{'\n'}I say{' '}
              <Text style={styles.headlineAccent}>right now?</Text>
            </Text>
            <Text style={styles.heroBody}>
              Calm, age-aware words for the exact parenting moment in front of you — in seconds.
            </Text>
            <View style={styles.chips}>
              {[
                { label: '👶 Ages 2–17',  color: colors.primary },
                { label: '⚡ In seconds', color: colors.sage    },
                { label: '✨ No jargon',  color: colors.amber   },
              ].map(({ label, color }) => (
                <View key={label} style={[styles.chip, { backgroundColor: color + '18' }]}>
                  <Text style={[styles.chipText, { color }]}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.pips}>
            {[0, 1].map(j => (
              <View key={j} style={[styles.pip, page === j ? styles.pipActive : styles.pipInactive]} />
            ))}
          </View>

          <View style={styles.ctas}>
            <Button label="Try it right now →" onPress={() => goTo(1)} />
            <Pressable
              onPress={() => router.push('/auth/sign-in')}
              style={({ pressed }) => [styles.signinBtn, pressed && { opacity: 0.65 }]}
            >
              <Text style={styles.signinText}>Already have an account? Sign in</Text>
            </Pressable>
          </View>
        </View>

        {/* ════ PAGE 2 — Live Trial ════ */}
        <View style={[styles.page, { width: W }]}>
          {!result ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.trialScroll}
            >
              <View style={styles.trialHeader}>
                <Pressable onPress={() => goTo(0)} style={styles.backBtn}>
                  <Text style={styles.backText}>← Back</Text>
                </Pressable>
                <Text style={styles.trialTitle}>Try Sturdy now</Text>
                <Text style={styles.trialSub}>
                  Get a real script for a real moment — no account needed.
                </Text>
              </View>

              <View style={styles.trialField}>
                <Text style={styles.trialLabel}>
                  Child name <Text style={styles.trialOptional}>(optional)</Text>
                </Text>
                <TextInput
                  placeholder="Olivia"
                  placeholderTextColor={colors.textMuted}
                  value={childName}
                  onChangeText={setChildName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  style={styles.trialInput}
                />
              </View>

              <View style={styles.trialField}>
                <Text style={styles.trialLabel}>Child age</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.ageTapRow}
                >
                  {QUICK_AGES.map(age => (
                    <Pressable
                      key={age}
                      onPress={() => setChildAge(age)}
                      style={[styles.ageTap, childAge === age && styles.ageTapSelected]}
                    >
                      <Text style={[styles.ageTapText, childAge === age && styles.ageTapTextSelected]}>
                        {age}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.trialField}>
                <Text style={styles.trialLabel}>What's happening?</Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder={`My ${childAge ? childAge + '-year-old' : 'child'} is screaming because we have to leave the park.`}
                  placeholderTextColor={colors.textMuted}
                  value={situation}
                  onChangeText={setSituation}
                  style={styles.trialTextarea}
                  textAlignVertical="top"
                />
                <Text style={styles.trialHint}>
                  The more detail you share — personality, triggers, what usually helps — the more specific the script will be.
                </Text>
              </View>

              {error ? <Text style={styles.trialError}>{error}</Text> : null}

              <Button
                label={loading ? 'Getting your script…' : 'Get my script →'}
                onPress={handleTry}
                disabled={!canTry || loading}
                loading={loading}
                variant="amber"
              />

              <View style={styles.pips}>
                {[0, 1].map(j => (
                  <View key={j} style={[styles.pip, page === j ? styles.pipActive : styles.pipInactive]} />
                ))}
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultContent}
            >
              <Text style={styles.resultTitle}>Your script</Text>
              <Text style={styles.resultSub}>Here's one calm way to handle this moment.</Text>

              <View style={styles.resultCard}>
                <View style={[styles.resultBadge, { backgroundColor: colors.sage }]}>
                  <Text style={styles.resultBadgeText}>REGULATE</Text>
                </View>
                <Text style={styles.resultScript}>"{result.regulate}"</Text>
              </View>

              <View style={[styles.resultCard, styles.lockedCard]}>
                <View style={styles.lockedRow}>
                  <View style={[styles.resultBadge, { backgroundColor: colors.primary, opacity: 0.4 }]}>
                    <Text style={styles.resultBadgeText}>CONNECT</Text>
                  </View>
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockBadgeText}>🔒 Sign up to see</Text>
                  </View>
                </View>
                <View style={styles.lockedLines}>
                  <View style={styles.lockedLine} />
                  <View style={[styles.lockedLine, { width: '70%' }]} />
                </View>
              </View>

              <View style={[styles.resultCard, styles.lockedCard]}>
                <View style={styles.lockedRow}>
                  <View style={[styles.resultBadge, { backgroundColor: colors.amber, opacity: 0.4 }]}>
                    <Text style={styles.resultBadgeText}>GUIDE</Text>
                  </View>
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockBadgeText}>🔒 Sign up to see</Text>
                  </View>
                </View>
                <View style={styles.lockedLines}>
                  <View style={styles.lockedLine} />
                  <View style={[styles.lockedLine, { width: '55%' }]} />
                </View>
              </View>

              <View style={styles.resultCta}>
                <Text style={styles.resultCtaTitle}>Your full script is ready.</Text>
                <Text style={styles.resultCtaBody}>
                  Create a free account to see Connect and Guide — and get unlimited scripts matched to your child.
                </Text>
                <Button
                  label={saving ? 'Starting…' : "See full script — it's free"}
                  onPress={handleSignUp}
                  disabled={saving}
                  loading={saving}
                />
                <Pressable
                  onPress={resetTrial}
                  style={({ pressed }) => [styles.loopBtn, pressed && { opacity: 0.65 }]}
                >
                  <Text style={styles.loopBtnText}>← Try a different situation</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.background },
  pager: { flex: 1 },
  page:  { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xl },

  heroContent:    { flex: 1, justifyContent: 'center', gap: spacing.lg },
  wordmarkRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  wordmarkDot:    { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.amber },
  wordmark:       { fontSize: 11, fontWeight: '800', letterSpacing: 0.18, color: colors.textMuted },
  headline:       { fontSize: 38, fontWeight: '800', lineHeight: 44, color: colors.text, letterSpacing: -0.5 },
  headlineAccent: { color: colors.primary },
  heroBody:       { fontSize: 17, color: colors.textSecondary, lineHeight: 26, maxWidth: 300 },
  chips:          { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  chip:           { borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  chipText:       { fontSize: 12, fontWeight: '700' },

  trialScroll: { gap: spacing.lg, paddingBottom: spacing.xxl },
  trialHeader: { gap: spacing.xs },
  backBtn:     { alignSelf: 'flex-start', paddingVertical: spacing.xs },
  backText:    { ...type.body, fontWeight: '600', color: colors.textSecondary },
  trialTitle:  { fontSize: 26, fontWeight: '800', color: colors.text, lineHeight: 32, letterSpacing: -0.3 },
  trialSub:    { ...type.body, color: colors.textSecondary },
  trialField:    { gap: spacing.xs },
  trialLabel:    { ...type.label, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  trialOptional: { fontSize: 10, fontWeight: '400', color: colors.textMuted, textTransform: 'none' },
  trialInput: {
    fontSize: 18, color: colors.text,
    borderBottomWidth: 2, borderBottomColor: colors.border,
    paddingVertical: spacing.xs,
  },
  ageTapRow:          { flexDirection: 'row', gap: spacing.xs, paddingVertical: spacing.xs },
  ageTap:             { width: 40, height: 40, borderRadius: radius.medium, backgroundColor: colors.backgroundSoft, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  ageTapSelected:     { backgroundColor: colors.primary, borderColor: colors.primary },
  ageTapText:         { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  ageTapTextSelected: { color: colors.textInverse, fontWeight: '800' },
  trialTextarea:      { backgroundColor: colors.backgroundSoft, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.large, padding: spacing.md, fontSize: 15, color: colors.text, lineHeight: 22, minHeight: 100 },
  trialHint:          { ...type.caption, color: colors.textMuted, fontStyle: 'italic' },
  trialError:         { ...type.bodySmall, color: colors.dangerDark },

  resultContent:   { gap: spacing.md, paddingBottom: spacing.xl },
  resultTitle:     { fontSize: 24, fontWeight: '800', color: colors.text },
  resultSub:       { ...type.body, color: colors.textSecondary },
  resultCard:      { backgroundColor: colors.surface, borderRadius: radius.large, padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.borderSoft },
  resultBadge:     { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  resultBadgeText: { fontSize: 9, fontWeight: '800', color: colors.textInverse, letterSpacing: 0.6 },
  resultScript:    { fontSize: 17, fontWeight: '600', color: colors.text, lineHeight: 26 },
  lockedCard:      { opacity: 0.7 },
  lockedRow:       { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  lockBadge:       { backgroundColor: colors.backgroundSoft, borderRadius: radius.pill, paddingHorizontal: spacing.xs, paddingVertical: 3, borderWidth: 1, borderColor: colors.borderSoft },
  lockBadgeText:   { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  lockedLines:     { gap: spacing.xs },
  lockedLine:      { height: 10, borderRadius: radius.pill, backgroundColor: colors.borderSoft, width: '85%' },

  resultCta:      { backgroundColor: colors.primaryLight, borderRadius: radius.large, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: 'rgba(60,90,115,0.2)' },
  resultCtaTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  resultCtaBody:  { ...type.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  loopBtn:        { alignSelf: 'center', paddingVertical: spacing.xs },
  loopBtnText:    { ...type.bodySmall, color: colors.textMuted, fontWeight: '600', textDecorationLine: 'underline' },

  pips:        { flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', paddingVertical: spacing.md },
  pip:         { height: 5, borderRadius: radius.pill },
  pipActive:   { width: 22, backgroundColor: colors.primary },
  pipInactive: { width: 5, backgroundColor: colors.border },

  ctas:       { gap: spacing.sm },
  signinBtn:  { alignSelf: 'center', paddingVertical: spacing.xs, minHeight: 44, justifyContent: 'center' },
  signinText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, textDecorationLine: 'underline' },
});


