// app/crisis.tsx
// One adaptive crisis screen — four crisis types.
// Calm, warm, linen tone. No red. No alarming visuals.
// Always shows "I'm safe — this was a mistake" at the bottom.
// Parent taps that → back to SOS input to try again.

import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar }    from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing, type } from '../src/theme';

type CrisisType =
  | 'medical_emergency'
  | 'suicidal_parent'
  | 'suicidal_child'
  | 'parent_losing_control'
  | 'violence_toward_child'
  | 'violence_toward_parent'
  | 'child_self_harm'
  | 'abuse_indicator'
  | string
  | null;

// ─────────────────────────────────────────────
// Crisis content — one object per crisis type
// Calm, non-judgmental, brief, supportive
// ─────────────────────────────────────────────

type CrisisContent = {
  icon:        string;
  heading:     string;
  body:        string;
  actionLabel: string | null;
  actionSub:   string | null;
  secondary:   string | null;
};

function getCrisisContent(crisisType: CrisisType): CrisisContent {
  switch (crisisType) {

    case 'medical_emergency':
      return {
        icon:        '🚑',
        heading:     'This sounds like it needs immediate help.',
        body:        'If your child is not breathing, unconscious, seriously injured, or in any medical emergency — please contact your local emergency services right away.\n\nDo not wait. Emergency services are best equipped to help in this situation.',
        actionLabel: 'Contact emergency services',
        actionSub:   'Call your local emergency number now',
        secondary:   null,
      };

    case 'suicidal_parent':
      return {
        icon:        '🤍',
        heading:     'You reached out. That matters.',
        body:        'It sounds like this moment feels overwhelming.\n\nIf you are having thoughts of ending your life or harming yourself, please reach out to a crisis support line in your area. You do not have to face this alone.\n\nIf you are in immediate danger, please contact emergency services right away.',
        actionLabel: 'Find crisis support in your area',
        actionSub:   'Crisis lines are available 24 hours a day',
        secondary:   'Contact emergency services if you are in immediate danger',
      };

    case 'suicidal_child':
      return {
        icon:        '🤍',
        heading:     'Your child needs more support right now.',
        body:        'If your child has expressed thoughts of suicide or self-harm, please reach out to a mental health crisis line in your area.\n\nIf you believe your child is in immediate danger, contact emergency services right away.\n\nYou are doing the right thing by taking this seriously.',
        actionLabel: 'Find crisis support in your area',
        actionSub:   'Crisis lines are available 24 hours a day',
        secondary:   'Contact emergency services if your child is in immediate danger',
      };

    case 'parent_losing_control':
      return {
        icon:        '🌿',
        heading:     'This sounds like a very intense moment.',
        body:        'It is okay to step away briefly if your child is safe to do so.\n\nTake one slow breath. You reached out — that is already a sign of care.\n\nIf you feel like you might lose control, please contact a support line in your area. You do not have to handle this alone.',
        actionLabel: 'Find parent support in your area',
        actionSub:   'Support lines can help you through this moment',
        secondary:   null,
      };

    case 'violence_toward_child':
    case 'abuse_indicator':
      return {
        icon:        '🌿',
        heading:     "Let's focus on safety first.",
        body:        'If anyone may be in immediate danger, please focus on separating and ensuring everyone is safe.\n\nIf you are concerned about a child\'s safety, a child protection line in your area can provide guidance.\n\nYou are not alone in this.',
        actionLabel: 'Find child safety support in your area',
        actionSub:   'Child protection services can help',
        secondary:   'Contact emergency services if anyone is in immediate danger',
      };

    case 'violence_toward_parent':
      return {
        icon:        '🌿',
        heading:     'Please make sure you are safe first.',
        body:        'If your child is physically attacking you, focus on separating safely first.\n\nIf you are in immediate danger, please contact emergency services right away.\n\nOnce the immediate situation is stable, Sturdy can help you think through what happened.',
        actionLabel: 'Contact emergency services if needed',
        actionSub:   'Your safety comes first',
        secondary:   null,
      };

    case 'child_self_harm':
      return {
        icon:        '🤍',
        heading:     'Your child may need more support right now.',
        body:        'If your child is harming themselves, please reach out to a mental health crisis line or child health professional in your area.\n\nIf you believe your child is in immediate physical danger, contact emergency services right away.\n\nReaching out is the right step.',
        actionLabel: 'Find mental health support in your area',
        actionSub:   'Crisis and mental health lines are available 24 hours',
        secondary:   'Contact emergency services if your child is in immediate danger',
      };

    default:
      return {
        icon:        '🌿',
        heading:     'This may need more support than Sturdy can provide.',
        body:        'If anyone may be in immediate danger, please contact your local emergency services right away.\n\nIf this is a mental health crisis, a crisis line in your area can help.\n\nYou are doing the right thing by reaching out.',
        actionLabel: 'Contact emergency services if needed',
        actionSub:   'Emergency services are available 24 hours',
        secondary:   null,
      };
  }
}

// ─────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────

const val = (v?: string | string[]) => Array.isArray(v) ? v[0] : v;

export default function CrisisScreen() {
  const params      = useLocalSearchParams<{ crisisType?: string; riskLevel?: string }>();
  const crisisType  = val(params.crisisType) ?? null;
  const content     = getCrisisContent(crisisType);

  const handlePrimaryAction = () => {
    // Generic — opens local emergency search
    // In future: detect locale and show specific number
    Linking.openURL('https://www.google.com/search?q=emergency+services+near+me').catch(() => {});
  };

  const handleSecondaryAction = () => {
    Linking.openURL('https://www.google.com/search?q=emergency+services+near+me').catch(() => {});
  };

  const handleFalsePositive = () => {
    // Back to SOS input to try again
    router.replace({ pathname: '/now', params: { reset: Date.now().toString() } });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{content.icon}</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>{content.heading}</Text>

        {/* Body */}
        <View style={[styles.bodyCard, shadow.sm]}>
          <Text style={styles.body}>{content.body}</Text>
        </View>

        {/* Primary action */}
        {content.actionLabel ? (
          <Pressable
            onPress={handlePrimaryAction}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.88 }]}
          >
            <Text style={styles.primaryBtnText}>{content.actionLabel}</Text>
            {content.actionSub ? (
              <Text style={styles.primaryBtnSub}>{content.actionSub}</Text>
            ) : null}
          </Pressable>
        ) : null}

        {/* Secondary action */}
        {content.secondary ? (
          <Pressable
            onPress={handleSecondaryAction}
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.65 }]}
          >
            <Text style={styles.secondaryBtnText}>{content.secondary}</Text>
          </Pressable>
        ) : null}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Sturdy disclaimer */}
        <Text style={styles.disclaimer}>
          Sturdy is an AI parenting support tool. It is not a substitute for professional medical, psychological, or emergency services.
        </Text>

        {/* False positive — always visible */}
        <Pressable
          onPress={handleFalsePositive}
          style={({ pressed }) => [styles.falsePositiveBtn, pressed && { opacity: 0.65 }]}
        >
          <Text style={styles.falsePositiveText}>
            I'm safe — this was a mistake. Go back and try again.
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.xl,
    paddingBottom:     spacing.xxl,
    gap:               spacing.lg,
    alignItems:        'center',
  },

  iconWrap: {
    width:           72,
    height:          72,
    borderRadius:    radius.xl,
    backgroundColor: colors.backgroundSoft,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     colors.borderSoft,
    marginBottom:    spacing.xs,
  },
  icon: { fontSize: 34 },

  heading: {
    fontFamily:    'Georgia',
    fontSize:      24,
    fontWeight:    '700',
    color:         colors.text,
    lineHeight:    32,
    textAlign:     'center',
    letterSpacing: -0.3,
  },

  bodyCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.lg,
    width:           '100%',
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
  body: {
    fontSize:   15,
    color:      colors.textSecondary,
    lineHeight: 26,
  },

  primaryBtn: {
    backgroundColor: colors.amber,
    borderRadius:    radius.large,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width:           '100%',
    alignItems:      'center',
    gap:             4,
    boxShadow:       '0 6px 20px rgba(200,136,58,0.3)',
  },
  primaryBtnText: {
    fontSize:   16,
    fontWeight: '700',
    color:      colors.textInverse,
    textAlign:  'center',
  },
  primaryBtnSub: {
    fontSize:   12,
    color:      'rgba(255,255,255,0.7)',
    textAlign:  'center',
  },

  secondaryBtn: {
    paddingVertical:   spacing.sm,
    paddingHorizontal: spacing.md,
    width:             '100%',
    alignItems:        'center',
  },
  secondaryBtnText: {
    fontSize:           14,
    fontWeight:         '600',
    color:              colors.textSecondary,
    textDecorationLine: 'underline',
    textAlign:          'center',
  },

  divider: {
    width:           '100%',
    height:          1,
    backgroundColor: colors.borderSoft,
    marginVertical:  spacing.xs,
  },

  disclaimer: {
    fontSize:   12,
    color:      colors.textMuted,
    lineHeight: 18,
    textAlign:  'center',
    fontStyle:  'italic',
    maxWidth:   280,
  },

  falsePositiveBtn: {
    paddingVertical:   spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems:        'center',
  },
  falsePositiveText: {
    fontSize:           13,
    color:              colors.textMuted,
    textDecorationLine: 'underline',
    textAlign:          'center',
    lineHeight:         20,
  },
});
