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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AGE_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 2);

const COMMON_MOMENTS = [
  'Bedtime meltdown',
  'Hitting sibling',
  'Leaving the park',
  'Refusing homework',
  'Morning rush',
  'Screen time battle',
];

export default function WelcomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [childName, setChildName] = useState('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
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
    router.replace('/(tabs)');
  };

  const handleFinish = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const guestChild = {
        name: childName.trim() || undefined,
        childAge: selectedAge ?? undefined,
      };
      await AsyncStorage.setItem('sturdy_guest_child', JSON.stringify(guestChild));
      await AsyncStorage.setItem('sturdy_welcome_done', 'true');
    } catch {
      // ignore storage errors
    } finally {
      setIsSaving(false);
    }
    router.replace('/(tabs)');
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
              {[0, 1, 2].map((i) => (
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
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.dot, page === i ? styles.dotActive : null]} />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Built for real moments</Text>

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

            <View style={styles.chipsSection}>
              <Text style={styles.chipsLabel}>Common moments</Text>
              <View style={styles.chipsRow}>
                {COMMON_MOMENTS.map((m) => (
                  <View key={m} style={styles.momentChip}>
                    <Text style={styles.momentChipText}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.ctaBlock}>
              <Button label="Continue" onPress={() => goToPage(2)} />
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

        {/* PAGE 3 */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <View style={styles.pageContent}>
            <View style={styles.page3Header}>
              <View style={styles.dotRow}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={[styles.dot, page === i ? styles.dotActive : null]} />
                ))}
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={handleSkip}
                style={({ pressed }) => [
                  styles.skipButton,
                  pressed ? styles.skipButtonPressed : null,
                ]}
              >
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Personalize for your child</Text>
            <Text style={styles.sectionSubtitle}>
              Optional — helps Sturdy tailor the script to the right moment.
            </Text>

            <View style={styles.formCard}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Child&apos;s name (optional)</Text>
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={setChildName}
                  placeholder="e.g. Alex"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.textInput}
                  value={childName}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Age</Text>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.agePicker}
                  showsHorizontalScrollIndicator={false}
                >
                  {AGE_OPTIONS.map((age) => {
                    const isSelected = selectedAge === age;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        key={age}
                        onPress={() => setSelectedAge(age)}
                        style={({ pressed }) => [
                          styles.agePill,
                          isSelected ? styles.agePillSelected : null,
                          pressed ? styles.agePillPressed : null,
                        ]}
                      >
                        <Text
                          style={[styles.agePillText, isSelected ? styles.agePillTextSelected : null]}
                        >
                          {age}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View style={styles.ctaBlock}>
              <Button
                label={isSaving ? 'Saving...' : 'Get My First Script'}
                onPress={handleFinish}
                disabled={isSaving}
              />
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
  chipsSection: {
    gap: spacing.sm,
  },
  chipsLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  momentChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.chipBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  momentChipText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
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
  },
  page3Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  skipButtonPressed: {
    opacity: 0.7,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadow,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  textInput: {
    minHeight: 52,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 17,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    lineHeight: 24,
  },
  agePicker: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  agePill: {
    minWidth: 52,
    minHeight: 52,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  agePillSelected: {
    backgroundColor: colors.chipBackground,
    borderColor: colors.primary,
  },
  agePillPressed: {
    opacity: 0.82,
  },
  agePillText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  agePillTextSelected: {
    color: colors.primary,
  },
});

