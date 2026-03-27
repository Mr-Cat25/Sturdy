import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage     from '@react-native-async-storage/async-storage';
import { router }       from 'expo-router';
import { StatusBar }    from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button }       from '../../src/components/ui/Button';
import { colors, radius, spacing } from '../../src/theme';

const { width: W } = Dimensions.get('window');

// ── Animated demo — Regulate/Connect/Guide cards loop in
function AnimatedDemo() {
  const cards = [
    {
      label:  'REGULATE',
      script: '"You\'re really upset about leaving the park."',
      bg:     colors.sageLight,
      badge:  colors.sage,
    },
    {
      label:  'CONNECT',
      script: '"You wanted more time. It\'s still time to go."',
      bg:     colors.primaryLight,
      badge:  colors.primary,
    },
    {
      label:  'GUIDE',
      script: '"We\'re leaving now. Walk with me to the car."',
      bg:     colors.amberLight,
      badge:  colors.amber,
    },
  ];

  const anims = useRef(
    cards.map(() => ({
      opacity:    new Animated.Value(0),
      translateY: new Animated.Value(14),
    }))
  ).current;

  useEffect(() => {
    const buildCardAnim = (i: number, delay: number) =>
      Animated.parallel([
        Animated.timing(anims[i].opacity, {
          toValue:         1,
          duration:        380,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(anims[i].translateY, {
          toValue:         0,
          duration:        380,
          delay,
          useNativeDriver: true,
        }),
      ]);

    const buildReset = () =>
      Animated.parallel(
        anims.map(a =>
          Animated.parallel([
            Animated.timing(a.opacity,    { toValue: 0, duration: 220, useNativeDriver: true }),
            Animated.timing(a.translateY, { toValue: 14, duration: 0,  useNativeDriver: true }),
          ])
        )
      );

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        buildCardAnim(0, 0),
        buildCardAnim(1, 300),
        buildCardAnim(2, 300),
        Animated.delay(2000),
        buildReset(),
        Animated.delay(500),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [anims]);

  return (
    <View style={demo.wrap}>
      <View style={demo.situation}>
        <Text style={demo.situationText}>Leaving the park · Age 4</Text>
      </View>
      {cards.map((c, i) => (
        <Animated.View
          key={c.label}
          style={[
            demo.card,
            {
              backgroundColor: c.bg,
              opacity:          anims[i].opacity,
              transform:        [{ translateY: anims[i].translateY }],
            },
          ]}
        >
          <View style={[demo.badge, { backgroundColor: c.badge }]}>
            <Text style={demo.badgeText}>{c.label}</Text>
          </View>
          <Text style={demo.script}>{c.script}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

export default function WelcomeScreen() {
  const scrollRef           = useRef<ScrollView>(null);
  const [page,   setPage]   = useState(0);
  const [saving, setSaving] = useState(false);

  // Hero fade-in on mount
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY       = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1, duration: 600, delay: 150, useNativeDriver: true,
      }),
      Animated.timing(heroY, {
        toValue: 0, duration: 600, delay: 150, useNativeDriver: true,
      }),
    ]).start();
  }, [heroOpacity, heroY]);

  const goTo = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * W, animated: true });
    setPage(i);
  };

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    try { await AsyncStorage.setItem('sturdy_welcome_done', 'true'); } catch { }
    setSaving(false);
    router.replace('/auth/sign-up');
  };

  const skip = async () => {
    try { await AsyncStorage.setItem('sturdy_welcome_done', 'true'); } catch { }
    router.replace('/child-setup');
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

        {/* ══════════════════════════════
            PAGE 1 — Hero
        ══════════════════════════════ */}
        <View style={[styles.page, { width: W }]}>

          <Pressable
            onPress={skip}
            style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>

          <Animated.View
            style={[
              styles.heroContent,
              { opacity: heroOpacity, transform: [{ translateY: heroY }] },
            ]}
          >
            {/* Wordmark row */}
            <View style={styles.wordmarkRow}>
              <View style={styles.wordmarkDot} />
              <Text style={styles.wordmark}>STURDY</Text>
            </View>

            {/* Headline */}
            <Text style={styles.headline}>
              What should{'\n'}I say{' '}
              <Text style={styles.headlineAccent}>right now?</Text>
            </Text>

            <Text style={styles.heroBody}>
              Calm, age-aware words for the exact parenting moment
              in front of you — in seconds.
            </Text>

            {/* Trust chips */}
            <View style={styles.chips}>
              {[
                { label: 'Ages 2–17',   color: colors.primary },
                { label: 'In seconds',  color: colors.sage    },
                { label: 'No jargon',   color: colors.amber   },
              ].map(({ label, color }) => (
                <View
                  key={label}
                  style={[styles.chip, { backgroundColor: color + '18' }]}
                >
                  <View style={[styles.chipDot, { backgroundColor: color }]} />
                  <Text style={[styles.chipText, { color }]}>{label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Pips */}
          <View style={styles.pips}>
            {[0, 1].map(j => (
              <View
                key={j}
                style={[styles.pip, page === j ? styles.pipActive : styles.pipInactive]}
              />
            ))}
          </View>

          <View style={styles.ctas}>
            <Button label="See how it works" onPress={() => goTo(1)} />
          </View>

        </View>

        {/* ══════════════════════════════
            PAGE 2 — Animated demo
        ══════════════════════════════ */}
        <View style={[styles.page, { width: W }]}>

          <View style={styles.demoHeader}>
            <Text style={styles.demoEyebrow}>How it works</Text>
            <Text style={styles.demoHeadline}>
              Describe.{'\n'}Get the words.
            </Text>
            <Text style={styles.demoBody}>
              Type what's happening. Sturdy returns a{' '}
              <Text style={styles.demoBold}>Regulate → Connect → Guide</Text>
              {' '}script matched to your child's exact age — right away.
            </Text>
          </View>

          {/* Live animated cards */}
          <AnimatedDemo />

          {/* Pips */}
          <View style={styles.pips}>
            {[0, 1].map(j => (
              <View
                key={j}
                style={[styles.pip, page === j ? styles.pipActive : styles.pipInactive]}
              />
            ))}
          </View>

          <View style={styles.ctas}>
            <Button
              label={saving ? 'Starting…' : 'Start free'}
              onPress={finish}
              disabled={saving}
            />
            <Pressable
              onPress={() => router.push('/auth/sign-in')}
              style={({ pressed }) => [styles.signinBtn, pressed && { opacity: 0.65 }]}
            >
              <Text style={styles.signinText}>
                Already have an account? Sign in
              </Text>
            </Pressable>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Demo card styles
const demo = StyleSheet.create({
  wrap: {
    flex:            1,
    gap:             spacing.sm,
    justifyContent:  'center',
    paddingVertical: spacing.sm,
  },
  situation: {
    alignSelf:         'flex-start',
    backgroundColor:   colors.chipBg,
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical:   4,
    marginBottom:      spacing.xs,
  },
  situationText: {
    fontSize:      11,
    fontWeight:    '700',
    color:         colors.textMuted,
    letterSpacing: 0.3,
  },
  card: {
    borderRadius: radius.large,
    padding:      spacing.md,
    gap:          spacing.xs,
  },
  badge: {
    alignSelf:         'flex-start',
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical:   3,
  },
  badgeText: {
    fontSize:      9,
    fontWeight:    '800',
    color:         colors.textInverse,
    letterSpacing: 0.6,
  },
  script: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.text,
    lineHeight: 22,
  },
});

// ── Screen styles
const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.background },
  pager: { flex: 1 },

  page: {
    flex:              1,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.sm,
    paddingBottom:     spacing.xl,
  },

  skipBtn: {
    alignSelf:         'flex-end',
    paddingVertical:   spacing.xs,
    paddingHorizontal: spacing.xs,
    minHeight:         40,
    justifyContent:    'center',
  },
  skipText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },

  // Hero
  heroContent: {
    flex:           1,
    justifyContent: 'center',
    gap:            spacing.lg,
  },

  wordmarkRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.xs,
  },
  wordmarkDot: {
    width:           8,
    height:          8,
    borderRadius:    radius.pill,
    backgroundColor: colors.amber,
  },
  wordmark: {
    fontSize:      11,
    fontWeight:    '800',
    letterSpacing: 0.18,
    color:         colors.textMuted,
  },

  headline: {
    fontSize:      40,
    fontWeight:    '800',
    lineHeight:    46,
    color:         colors.text,
    letterSpacing: -0.5,
  },
  headlineAccent: {
    color: colors.primary,
  },

  heroBody: {
    fontSize:   17,
    color:      colors.textSecondary,
    lineHeight: 26,
    maxWidth:   300,
  },

  chips: {
    flexDirection: 'row',
    gap:           spacing.xs,
    flexWrap:      'wrap',
  },
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical:   6,
  },
  chipDot:  { width: 5, height: 5, borderRadius: radius.pill },
  chipText: { fontSize: 12, fontWeight: '700' },

  // Demo page
  demoHeader: {
    gap:          spacing.xs,
    marginBottom: spacing.sm,
  },
  demoEyebrow: {
    fontSize:      11,
    fontWeight:    '700',
    letterSpacing: 0.12,
    textTransform: 'uppercase',
    color:         colors.textMuted,
  },
  demoHeadline: {
    fontSize:      32,
    fontWeight:    '800',
    lineHeight:    38,
    color:         colors.text,
    letterSpacing: -0.4,
  },
  demoBody: {
    fontSize:   15,
    color:      colors.textSecondary,
    lineHeight: 23,
  },
  demoBold: { fontWeight: '700', color: colors.text },

  // Shared
  pips: {
    flexDirection:   'row',
    gap:             spacing.xs,
    justifyContent:  'center',
    paddingVertical: spacing.md,
  },
  pip:         { height: 5, borderRadius: radius.pill },
  pipActive:   { width: 22, backgroundColor: colors.primary },
  pipInactive: { width: 5,  backgroundColor: colors.border },

  ctas: { gap: spacing.sm },

  signinBtn: {
    alignSelf:       'center',
    paddingVertical: spacing.xs,
    minHeight:       44,
    justifyContent:  'center',
  },
  signinText: {
    fontSize:           14,
    fontWeight:         '600',
    color:              colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
