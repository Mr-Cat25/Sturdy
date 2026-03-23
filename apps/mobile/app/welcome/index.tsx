import { useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WelcomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const goToPage = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setPage(index);
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('sturdy_welcome_done', 'true');
    } catch {
      // ignore
    }
    router.replace('/');
  };

  const handleFinish = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await AsyncStorage.setItem('sturdy_welcome_done', 'true');
    } catch {
      // ignore storage errors
    } finally {
      setIsSaving(false);
    }
    router.replace('/');
  };

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.pager}
      >
        {/* PAGE 1 */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <View style={styles.pageContent}>
            <View style={styles.dotRow}>
              {[0, 1].map((i) => (
                <View key={i} style={[styles.dot, page === i ? styles.dotActive : null]} />
              ))}
            </View>

            <View style={styles.heroBlock}>
              <Text style={styles.eyebrow}>Sturdy</Text>
              <Text style={styles.heroTitle}>What should I say right now?</Text>
              <Text style={styles.heroSubtitle}>
                Calm, age-aware words for the exact moment in front of you.
              </Text>
            </View>

            <View style={styles.ctaBlock}>
              <Button label="Start Free" onPress={() => goToPage(1)} />
              <Text style={styles.ctaCaption}>No account needed to get started.</Text>
            </View>
          </View>
        </View>

        {/* PAGE 2 */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <View style={styles.pageContent}>
            <View style={styles.dotRow}>
              {[0, 1].map((i) => (
                <View key={i} style={[styles.dot, page === i ? styles.dotActive : null]} />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Built for real moments</Text>
            <Text style={styles.sectionSubtitle}>
              Sturdy helps you move from stress to calm, useful words without digging through generic advice.
            </Text>

            <View style={styles.featureCards}>
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Ready in seconds</Text>
                <Text style={styles.featureBody}>
                  Describe the moment, get a calm script instantly.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Age-aware (2–17)</Text>
                <Text style={styles.featureBody}>
                  Scripts matched to where your child is developmentally.
                </Text>
              </View>
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Safety-first</Text>
                <Text style={styles.featureBody}>
                  Grounded in child development and de-escalation principles.
                </Text>
              </View>
            </View>

            <View style={styles.ctaBlock}>
              <Button
                label={isSaving ? 'Starting...' : 'Continue'}
                onPress={handleFinish}
                disabled={isSaving}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/auth/sign-in')}
                style={({ pressed }) => [styles.authLink, pressed ? styles.authLinkPressed : null]}
              >
                <Text style={styles.authLinkText}>Already have an account? Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  pageContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  heroBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 17,
    lineHeight: 26,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  featureCards: {
    gap: spacing.sm,
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.medium,
    padding: spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  featureBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  ctaBlock: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  ctaCaption: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  authLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authLinkPressed: {
    opacity: 0.7,
  },
  authLinkText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

