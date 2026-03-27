// app/(tabs)/profile.tsx — Phase B update
// Neurotype card added below active child.
// Free users: locked card with explanation modal → paywall.
// Premium users: selectable neurotypes (one at a time).

import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router }          from 'expo-router';
import { StatusBar }       from 'expo-status-bar';
import { SafeAreaView }    from 'react-native-safe-area-context';
import { Button }          from '../../src/components/ui/Button';
import { useAuth }         from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';
import { supabase }        from '../../src/lib/supabase';
import { colors, radius, shadow, spacing, type } from '../../src/theme';

// ── Neurotype config
const NEUROTYPES = [
  { key: 'ADHD',    label: 'ADHD',                  emoji: '⚡', desc: 'Short, direct, movement-based scripts.' },
  { key: 'Autism',  label: 'Autism',                emoji: '🎯', desc: 'Literal, concrete, step-by-step language.' },
  { key: 'Anxiety', label: 'Anxiety',               emoji: '🌿', desc: 'Reassurance-first, predictable next steps.' },
  { key: 'Sensory', label: 'Sensory Processing',    emoji: '🎧', desc: 'Sensory-aware, reduced demands.' },
  { key: 'PDA',     label: 'PDA',                   emoji: '🤝', desc: 'Collaborative, demand-free, choice-based.' },
  { key: '2e',      label: 'Twice Exceptional (2e)',emoji: '✨', desc: 'Intellectually matched, emotionally held.' },
] as const;

// TODO: Replace with real subscription check
const IS_PREMIUM = false;

export default function ProfileScreen() {
  const { session }                 = useAuth();
  const { activeChild, reloadChild } = useChildProfile();

  const [explainModalVisible, setExplainModalVisible] = useState(false);
  const [neurotypeSaving,     setNeurotypeSaving]     = useState(false);
  const [neurotypeError,      setNeurotypeError]      = useState('');

  const hasChild    = activeChild !== null;
  const childLabel  = hasChild
    ? `${activeChild.name} · Age ${activeChild.childAge}`
    : 'No child added yet';
  const activeNeurotype = activeChild?.neurotype ?? null;

  const handleNeurotypeSelect = async (key: string) => {
    if (!session || !activeChild?.id) return;
    setNeurotypeSaving(true);
    setNeurotypeError('');

    // Toggle — if already selected, deselect
    const newValue = activeNeurotype === key ? [] : [key];

    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({ neurotype: newValue })
        .eq('id', activeChild.id)
        .eq('user_id', session.user.id);

      if (error) throw error;
      await reloadChild();
    } catch {
      setNeurotypeError('Could not save neurotype. Please try again.');
    } finally {
      setNeurotypeSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.sub}>Your child, support history, and saved scripts.</Text>
        </View>

        {/* ── Active child ── */}
        <View style={[styles.card, shadow.sm]}>
          <Text style={styles.label}>Active child</Text>
          <Text style={styles.cardTitle}>{childLabel}</Text>
          <Text style={styles.cardBody}>
            {hasChild
              ? 'This child context shapes every script Sturdy generates.'
              : 'Add a child so Sturdy can tailor support to the right age.'}
          </Text>
          <Button
            label={hasChild ? 'Add another child' : 'Add child'}
            variant={hasChild ? 'ghost' : 'primary'}
            size="md"
            onPress={() => router.push(session ? '/child/new' : '/child-setup')}
          />
        </View>

        {/* ── Neurotype — premium feature ── */}
        {IS_PREMIUM ? (
          // Premium: selectable neurotypes
          <View style={[styles.card, shadow.sm]}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.label}>Neurotype support</Text>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>
              {activeNeurotype
                ? `${NEUROTYPES.find(n => n.key === activeNeurotype)?.label ?? activeNeurotype} active`
                : 'Select a neurotype'}
            </Text>
            <Text style={styles.cardBody}>
              One at a time. Scripts adapt silently — {activeChild?.name ?? 'your child'} just gets words that feel right.
            </Text>

            <View style={styles.neurotypes}>
              {NEUROTYPES.map(n => (
                <Pressable
                  key={n.key}
                  onPress={() => handleNeurotypeSelect(n.key)}
                  disabled={neurotypeSaving}
                  style={({ pressed }) => [
                    styles.neurotypeTile,
                    activeNeurotype === n.key && styles.neurotypeTileActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.neurotypeTileEmoji}>{n.emoji}</Text>
                  <Text style={[
                    styles.neurotypeTileLabel,
                    activeNeurotype === n.key && styles.neurotypeTileLabelActive,
                  ]}>
                    {n.label}
                  </Text>
                  <Text style={styles.neurotypeTileDesc}>{n.desc}</Text>
                  {activeNeurotype === n.key ? (
                    <View style={styles.neurotypeTileCheck}>
                      <Text style={styles.neurotypeTileCheckText}>✓</Text>
                    </View>
                  ) : null}
                </Pressable>
              ))}
            </View>

            {neurotypeError ? (
              <Text style={styles.neurotypeError}>{neurotypeError}</Text>
            ) : null}

            {activeNeurotype ? (
              <Pressable
                onPress={() => handleNeurotypeSelect(activeNeurotype)}
                style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.65 }]}
              >
                <Text style={styles.clearBtnText}>Clear neurotype →</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          // Free: locked card with explanation modal
          <Pressable onPress={() => setExplainModalVisible(true)}>
            <View style={[styles.card, styles.lockedCard, shadow.sm]}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.label}>Neurotype support</Text>
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                </View>
              </View>
              <View style={styles.lockedContent}>
                <Text style={styles.lockedIcon}>🔒</Text>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.cardTitle}>Scripts that know your child</Text>
                  <Text style={styles.cardBody}>
                    Add ADHD, Autism, Anxiety or Sensory context and get scripts tuned to exactly how your child experiences the world.
                  </Text>
                </View>
              </View>
              <View style={styles.lockedPreview}>
                {NEUROTYPES.slice(0, 4).map(n => (
                  <View key={n.key} style={styles.lockedChip}>
                    <Text style={styles.lockedChipText}>{n.emoji} {n.label}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.lockedCta}>Tap to learn more →</Text>
            </View>
          </Pressable>
        )}

        {/* ── SOS History ── */}
        <View style={[styles.card, shadow.sm]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconDot, { backgroundColor: colors.dangerLight }]}>
              <Text style={styles.iconEmoji}>🆘</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.label}>SOS History</Text>
              <Text style={styles.cardTitle}>Past hard moments</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            Every situation you've described and the script Sturdy gave you.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/history')}
            style={({ pressed }) => [styles.link, pressed && { opacity: 0.65 }]}
          >
            <Text style={styles.linkText}>Open SOS history →</Text>
          </Pressable>
        </View>

        {/* ── Saved Scripts ── */}
        <View style={[styles.card, shadow.sm]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconDot, { backgroundColor: colors.sageLight }]}>
              <Text style={styles.iconEmoji}>🔖</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.label}>Saved Scripts</Text>
              <Text style={styles.cardTitle}>Scripts that helped</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            Scripts you've bookmarked to reuse — your personal support library.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/saved')}
            style={({ pressed }) => [styles.link, pressed && { opacity: 0.65 }]}
          >
            <Text style={styles.linkText}>Open saved scripts →</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* ── Neurotype explanation modal — free users ── */}
      <Modal
        visible={explainModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setExplainModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setExplainModalVisible(false)}
        />
        <View style={styles.modal}>
          <View style={styles.modalHandle} />

          <Text style={styles.modalTitle}>
            Scripts that know your child
          </Text>

          <Text style={styles.modalBody}>
            Every child is different. With Neurotype Support, you tell Sturdy how your child is wired — and every script adapts silently to match.
          </Text>

          <View style={styles.modalExamples}>
            <View style={styles.modalExample}>
              <Text style={styles.modalExampleEmoji}>⚡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalExampleLabel}>ADHD</Text>
                <Text style={styles.modalExampleDesc}>Short sentences. Body first. Movement in every guide.</Text>
              </View>
            </View>
            <View style={styles.modalExample}>
              <Text style={styles.modalExampleEmoji}>🎯</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalExampleLabel}>Autism</Text>
                <Text style={styles.modalExampleDesc}>Literal, concrete, step-by-step. No metaphors.</Text>
              </View>
            </View>
            <View style={styles.modalExample}>
              <Text style={styles.modalExampleEmoji}>🌿</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalExampleLabel}>Anxiety</Text>
                <Text style={styles.modalExampleDesc}>Reassurance-first. Predictable. Your presence foregrounded.</Text>
              </View>
            </View>
          </View>

          <Text style={styles.modalNote}>
            One neurotype at a time. Scripts feel different — not because you changed a setting, but because Sturdy understood your child.
          </Text>

          <Button
            label="Unlock with Sturdy Unlimited"
            variant="amber"
            onPress={() => {
              setExplainModalVisible(false);
              // TODO: navigate to upgrade screen
            }}
          />
          <Button
            label="Maybe later"
            variant="ghost"
            size="md"
            onPress={() => setExplainModalVisible(false)}
          />
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xxl,
    gap:               spacing.lg,
  },

  header: { gap: spacing.xs, marginTop: spacing.xs },
  title:  { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36 },
  sub:    { ...type.body, color: colors.textSecondary },

  card: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.lg,
    gap:             spacing.sm,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label:         { ...type.label, color: colors.textMuted, textTransform: 'uppercase', flex: 1 },
  cardTitle:     { fontSize: 18, fontWeight: '700', color: colors.text, lineHeight: 24 },
  cardBody:      { ...type.bodySmall, color: colors.textSecondary, lineHeight: 20 },

  premiumBadge: {
    backgroundColor:   colors.amberLight,
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical:   3,
    borderWidth:       1,
    borderColor:       'rgba(200,136,58,0.25)',
  },
  premiumBadgeText: { fontSize: 9, fontWeight: '800', color: colors.amber, letterSpacing: 0.5 },

  // Locked card
  lockedCard:    { borderWidth: 1, borderColor: 'rgba(200,136,58,0.15)', borderStyle: 'dashed' },
  lockedContent: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  lockedIcon:    { fontSize: 22, marginTop: 2 },
  lockedPreview: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  lockedChip: {
    backgroundColor:   colors.backgroundSoft,
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical:   3,
    borderWidth:       1,
    borderColor:       colors.borderSoft,
  },
  lockedChipText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  lockedCta:      { ...type.caption, color: colors.amber, fontWeight: '700' },

  // Neurotype tiles — premium
  neurotypes: { gap: spacing.sm },
  neurotypeTile: {
    backgroundColor: colors.backgroundSoft,
    borderRadius:    radius.medium,
    padding:         spacing.md,
    gap:             spacing.xxs,
    borderWidth:     1.5,
    borderColor:     colors.border,
    position:        'relative',
  },
  neurotypeTileActive: {
    backgroundColor: colors.amberLight,
    borderColor:     colors.amber,
  },
  neurotypeTileEmoji: { fontSize: 20, marginBottom: 2 },
  neurotypeTileLabel: {
    fontSize:   14,
    fontWeight: '700',
    color:      colors.text,
  },
  neurotypeTileLabelActive: { color: colors.amberDark },
  neurotypeTileDesc: {
    ...type.caption,
    color: colors.textMuted,
  },
  neurotypeTileCheck: {
    position:        'absolute',
    top:             spacing.sm,
    right:           spacing.sm,
    width:           22,
    height:          22,
    borderRadius:    radius.pill,
    backgroundColor: colors.amber,
    alignItems:      'center',
    justifyContent:  'center',
  },
  neurotypeTileCheckText: { fontSize: 12, fontWeight: '800', color: colors.textInverse },

  neurotypeError: { ...type.bodySmall, color: colors.dangerDark },
  clearBtn:       { alignSelf: 'flex-start', paddingVertical: spacing.xxs },
  clearBtnText:   { ...type.bodySmall, color: colors.textMuted, fontWeight: '600' },

  // History / Saved cards
  iconDot: {
    width:          40,
    height:         40,
    borderRadius:   radius.medium,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  iconEmoji: { fontSize: 18 },

  link:     { alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center' },
  linkText: { ...type.body, color: colors.primary, fontWeight: '700' },

  // Neurotype explanation modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26,24,20,0.45)' },
  modal: {
    backgroundColor:  colors.surface,
    borderRadius:     radius.xl,
    padding:          spacing.xl,
    paddingTop:       spacing.sm,
    gap:              spacing.md,
    marginHorizontal: spacing.sm,
    marginBottom:     spacing.md,
  },
  modalHandle: {
    width:           36,
    height:          4,
    borderRadius:    2,
    backgroundColor: colors.borderSoft,
    alignSelf:       'center',
    marginBottom:    spacing.sm,
  },
  modalTitle: {
    fontSize:      22,
    fontWeight:    '800',
    color:         colors.text,
    lineHeight:    28,
  },
  modalBody: {
    ...type.body,
    color:    colors.textSecondary,
    lineHeight: 24,
  },
  modalExamples: {
    backgroundColor: colors.background,
    borderRadius:    radius.medium,
    padding:         spacing.md,
    gap:             spacing.md,
  },
  modalExample: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  modalExampleEmoji: { fontSize: 20, marginTop: 1 },
  modalExampleLabel: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  modalExampleDesc:  { ...type.caption, color: colors.textSecondary, lineHeight: 18 },
  modalNote: {
    ...type.bodySmall,
    color:      colors.textMuted,
    fontStyle:  'italic',
    lineHeight: 20,
  },
});
