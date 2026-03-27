import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

type Step = 'Regulate' | 'Connect' | 'Guide';

type ScriptCardProps = {
  step:    Step;
  action:  string;
  script:  string;
  delay?:  number;
};

const STEP_CONFIG = {
  Regulate: {
    bg:    colors.sageLight,
    badge: colors.sage,
    hint:  'What you do first',
  },
  Connect: {
    bg:    colors.primaryLight,
    badge: colors.primary,
    hint:  'Name the feeling · hold the limit',
  },
  Guide: {
    bg:    colors.amberLight,
    badge: colors.amber,
    hint:  'Move it forward',
  },
} as const;

export function ScriptCard({ step, action, script, delay = 0 }: ScriptCardProps) {
  const config     = STEP_CONFIG[step];
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue:         1,
        duration:        420,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue:         0,
        duration:        420,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: config.bg, opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: config.badge }]}>
          <Text style={styles.badgeText}>{step.toUpperCase()}</Text>
        </View>
        <Text style={styles.hint}>{config.hint}</Text>
      </View>

      {action ? <Text style={styles.action}>{action}</Text> : null}

      <Text style={styles.script}>"{script}"</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.large,
    padding:      spacing.lg,
    gap:          spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.xs,
  },
  badge: {
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical:   3,
  },
  badgeText: {
    fontSize:      10,
    fontWeight:    '800',
    color:         colors.textInverse,
    letterSpacing: 0.6,
  },
  hint: {
    fontSize:  11,
    color:     colors.textMuted,
    fontStyle: 'italic',
  },
  action: {
    fontSize:  13,
    color:     colors.textSecondary,
    fontStyle: 'italic',
  },
  script: {
    fontSize:      18,
    fontWeight:    '600',
    lineHeight:    28,
    color:         colors.text,
    letterSpacing: -0.1,
  },
});
