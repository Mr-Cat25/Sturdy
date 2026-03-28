
// apps/mobile/src/components/ui/ScriptCard.tsx
// Renders one step of the script (Regulate / Connect / Guide)
// parent_action = what the parent DOES — shown as a small action line
// script = what the parent SAYS — shown as the main text

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, type } from '../../theme';

type Step = 'Regulate' | 'Connect' | 'Guide';

type Props = {
  step:          Step;
  parent_action: string;
  script:        string;
  delay?:        number;
};

const STEP_COLORS: Record<Step, { bg: string; border: string; badge: string }> = {
  Regulate: {
    bg:     'rgba(124,154,135,0.08)',
    border: 'rgba(124,154,135,0.18)',
    badge:  colors.sage,
  },
  Connect: {
    bg:     'rgba(60,90,115,0.08)',
    border: 'rgba(60,90,115,0.2)',
    badge:  colors.primary,
  },
  Guide: {
    bg:     'rgba(200,136,58,0.07)',
    border: 'rgba(200,136,58,0.18)',
    badge:  colors.amber,
  },
};

export function ScriptCard({ step, parent_action, script, delay = 0 }: Props) {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, opacity, translateY]);

  const c = STEP_COLORS[step];

  return (
    <Animated.View style={[
      styles.card,
      { backgroundColor: c.bg, borderColor: c.border },
      { opacity, transform: [{ translateY }] },
    ]}>
      {/* Badge */}
      <View style={[styles.badge, { backgroundColor: c.badge }]}>
        <Text style={styles.badgeText}>{step.toUpperCase()}</Text>
      </View>

      {/* Parent action */}
      <Text style={styles.action}>{parent_action}</Text>

      {/* Script — what to say */}
      <Text style={styles.script}>"{script}"</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.large,
    borderWidth:  1,
    padding:      spacing.lg,
    gap:          spacing.xs,
  },
  badge: {
    alignSelf:         'flex-start',
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical:   3,
    marginBottom:      spacing.xxs,
  },
  badgeText: {
    fontSize:      9,
    fontWeight:    '800',
    color:         colors.textInverse,
    letterSpacing: 0.6,
  },
  action: {
    fontSize:   13,
    fontWeight: '600',
    color:      colors.textMuted,
    fontStyle:  'italic',
    lineHeight: 18,
  },
  script: {
    fontSize:   18,
    fontWeight: '600',
    color:      colors.text,
    lineHeight: 28,
  },
});


