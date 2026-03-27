// app/now.tsx — Phase A update
// Handles CrisisDetectedError → routes to /crisis
// Adds "This feels unsafe" button at bottom

import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar }          from 'expo-status-bar';
import { SafeAreaView }       from 'react-native-safe-area-context';
import { Button }             from '../src/components/ui/Button';
import { useAuth }            from '../src/context/AuthContext';
import { useChildProfile }    from '../src/context/ChildProfileContext';
import { getParentingScript, CrisisDetectedError } from '../src/lib/api';
import { colors, radius, spacing, type } from '../src/theme';

export default function NowScreen() {
  const navigation = useRouter();
  const params     = useLocalSearchParams<{ reset?: string }>();
  const { session }      = useAuth();
  const { activeChild }  = useChildProfile();
  const [situation, setSituation] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const childName = activeChild?.name    ?? null;
  const childAge  = activeChild?.childAge ?? null;
  const childId   = activeChild?.id       ?? undefined;
  const userId    = session?.user?.id     ?? undefined;

  const reset     = Array.isArray(params.reset) ? params.reset[0] : params.reset;
  const canSubmit = Boolean(childName) && childAge !== null && situation.trim().length > 0;

  useEffect(() => {
    if (!reset) return;
    setSituation('');
    setError('');
  }, [reset]);

  const handleGetScript = async () => {
    const msg = situation.trim();
    if (!msg || !childName || childAge === null) return;
    setError('');
    setLoading(true);

    try {
      const script = await getParentingScript({
        childName,
        childAge,
        message:       msg,
        userId,
        childProfileId: childId,
      });

      navigation.push({
        pathname: '/result',
        params: {
          situationSummary: script.situation_summary,
          regulate:         script.regulate,
          connect:          script.connect,
          guide:            script.guide,
        },
      });
    } catch (err) {
      // ─────────────────────────────────────
      // Crisis detected — route to crisis screen
      // ─────────────────────────────────────
      if (err instanceof CrisisDetectedError) {
        router.push({
          pathname: '/crisis',
          params: {
            crisisType: err.crisisType,
            riskLevel:  err.riskLevel,
          },
        });
        return;
      }

      setError("We couldn't get a script right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Manual crisis route — parent taps "This feels unsafe"
  const handleUnsafe = () => {
    router.push({
      pathname: '/crisis',
      params: { crisisType: 'manual', riskLevel: 'ELEVATED_RISK' },
    });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.65 }]}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            {childName && childAge !== null ? (
              <View style={styles.contextPill}>
                <Text style={styles.contextPillText}>
                  🧒 {childName} · Age {childAge}
                </Text>
              </View>
            ) : null}
            <Text style={styles.title}>{"What's happening\nright now?"}</Text>
            <Text style={styles.sub}>
              Describe the moment and get calm words to say.
            </Text>
          </View>

          {/* No child warning */}
          {(!childName || childAge === null) ? (
            <View style={styles.noChildCard}>
              <Text style={styles.noChildText}>
                Add a child profile first so Sturdy can tailor the script to the right age.
              </Text>
              <Pressable onPress={() => router.push(session ? '/child/new' : '/child-setup')}>
                <Text style={styles.noChildLink}>Add child →</Text>
              </Pressable>
            </View>
          ) : null}

          {/* Textarea */}
          <View style={styles.textareaWrap}>
            <TextInput
              autoFocus={Boolean(childName) && childAge !== null}
              multiline
              numberOfLines={5}
              placeholder="My child is screaming because we have to leave the park."
              placeholderTextColor="rgba(255,255,255,0.22)"
              value={situation}
              onChangeText={v => {
                setSituation(v);
                if (error) setError('');
              }}
              style={styles.textarea}
              textAlignVertical="top"
            />
            <Text style={styles.textareaHint}>
              You're not writing a report — a snapshot is enough.
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Get Script CTA */}
          <Button
            label={loading ? 'Getting script…' : 'Get Script'}
            onPress={handleGetScript}
            variant="amber"
            loading={loading}
            disabled={!canSubmit || loading}
            dark
          />

          {/* This feels unsafe — always visible */}
          <Pressable
            onPress={handleUnsafe}
            style={({ pressed }) => [styles.unsafeBtn, pressed && { opacity: 0.65 }]}
          >
            <Text style={styles.unsafeBtnText}>
              This feels like an emergency → Get help now
            </Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: colors.night },
  keyboard: { flex: 1 },
  content: {
    flexGrow:          1,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xxl,
    gap:               spacing.lg,
  },

  back:     { alignSelf: 'flex-start', paddingVertical: spacing.xs },
  backText: { ...type.body, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },

  header: { gap: spacing.sm },
  contextPill: {
    alignSelf:         'flex-start',
    backgroundColor:   'rgba(124,154,135,0.15)',
    borderWidth:       1,
    borderColor:       'rgba(124,154,135,0.3)',
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical:   4,
  },
  contextPillText: { ...type.label, color: colors.sage },

  title: {
    fontSize:      30,
    fontWeight:    '800',
    lineHeight:    36,
    color:         colors.textInverse,
    letterSpacing: -0.3,
  },
  sub: { ...type.body, color: 'rgba(255,255,255,0.5)' },

  noChildCard: {
    backgroundColor: colors.amberLight,
    borderRadius:    radius.medium,
    padding:         spacing.md,
    gap:             spacing.xs,
    borderWidth:     1,
    borderColor:     'rgba(200,136,58,0.25)',
  },
  noChildText: { ...type.bodySmall, color: colors.textSecondary },
  noChildLink: { ...type.bodySmall, color: colors.amberDark, fontWeight: '700' },

  textareaWrap: { gap: spacing.xs },
  textarea: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth:     1.5,
    borderColor:     'rgba(255,255,255,0.1)',
    borderRadius:    radius.large,
    padding:         spacing.md,
    fontSize:        17,
    color:           colors.textInverse,
    lineHeight:      26,
    minHeight:       140,
  },
  textareaHint: {
    ...type.caption,
    color:     'rgba(255,255,255,0.25)',
    fontStyle: 'italic',
  },
  errorText: { ...type.bodySmall, color: colors.dangerDark },

  // "This feels unsafe" — subdued, always present, non-alarming
  unsafeBtn: {
    alignSelf:      'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  unsafeBtnText: {
    fontSize:           13,
    color:              'rgba(255,255,255,0.3)',
    textAlign:          'center',
    textDecorationLine: 'underline',
    fontWeight:         '500',
  },
});
