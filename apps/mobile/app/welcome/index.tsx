import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Chip } from '../../src/components/ui/Chip';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { setGuestChild, setWelcomeDone } from '../../src/lib/mobileStorage';

const featureCards = ['Ready in seconds', 'Age-aware (2–17)', 'Safety-first'];
const commonMoments = ['Bedtime meltdown', 'Leaving the park', 'Hitting sibling', 'Refusing homework'];
const ageOptions = Array.from({ length: 16 }, (_, index) => index + 2);

export default function WelcomeScreen() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [selectedMoment, setSelectedMoment] = useState(commonMoments[0]);

  const pageTitle = useMemo(() => {
    if (page === 1) {
      return 'What should I say right now?';
    }

    if (page === 2) {
      return 'Built for real moments';
    }

    return 'Personalize for your child';
  }, [page]);

  const completeOnboarding = async () => {
    await setGuestChild({ name: name.trim(), childAge: age });
    await setWelcomeDone();
    router.replace('/(tabs)');
  };

  return (
    <Screen scrollable={false}>
      <View style={styles.shell}>
        <View pointerEvents="none" style={styles.glowLayer}>
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Image source={require('../../assets/logo.png')} style={styles.logo} />
            </View>
            <Text style={styles.pageCount}>{page}/3</Text>
          </View>

          <View style={styles.progressRow}>
            {[1, 2, 3].map((step) => (
              <View key={step} style={[styles.progressDot, page >= step ? styles.progressDotActive : null]} />
            ))}
          </View>

          {page === 1 ? (
            <View style={styles.section}>
              <Text style={styles.eyebrow}>For hard moments</Text>
              <Text style={styles.title}>{pageTitle}</Text>
              <Text style={styles.subtitle}>
                Sturdy gives you calm words for the exact moment in front of you.
              </Text>

              <Button label="Start Free" onPress={() => setPage(2)} />
            </View>
          ) : null}

          {page === 2 ? (
            <View style={styles.section}>
              <Text style={styles.title}>{pageTitle}</Text>

              <View style={styles.featureList}>
                {featureCards.map((feature) => (
                  <Card key={feature} style={styles.featureCard}>
                    <Text style={styles.featureTitle}>{feature}</Text>
                    <Text style={styles.featureBody}>
                      Calm, structured support that helps you answer quickly and clearly.
                    </Text>
                  </Card>
                ))}
              </View>

              <View style={styles.chipWrap}>
                {commonMoments.map((prompt) => (
                  <Chip
                    key={prompt}
                    label={prompt}
                    onPress={() => setSelectedMoment(prompt)}
                    selected={selectedMoment === prompt}
                  />
                ))}
              </View>

              <Button label="Continue" onPress={() => setPage(3)} />

              <Pressable onPress={() => router.push('/auth/sign-in')} style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Already have an account? Sign In</Text>
              </Pressable>
            </View>
          ) : null}

          {page === 3 ? (
            <View style={styles.section}>
              <View style={styles.sectionTopRow}>
                <Text style={styles.title}>{pageTitle}</Text>
                <Pressable onPress={completeOnboarding} style={styles.skipButton}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </Pressable>
              </View>

              <Card style={styles.formCard}>
                <View style={styles.momentSummary}>
                  <Text style={styles.fieldLabel}>Start with</Text>
                  <Text style={styles.momentSummaryText}>{selectedMoment}</Text>
                </View>

                <View style={styles.fieldBlock}>
                  <Text style={styles.fieldLabel}>Name (optional)</Text>
                  <TextInput
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={setName}
                    placeholder="What do you call them?"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                    value={name}
                  />
                </View>

                <View style={styles.fieldBlock}>
                  <Text style={styles.fieldLabel}>Age</Text>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.ageRow}
                    showsHorizontalScrollIndicator={false}
                  >
                    {ageOptions.map((option) => {
                      const isSelected = age === option;

                      return (
                        <Pressable
                          accessibilityRole="button"
                          key={option}
                          onPress={() => setAge(option)}
                          style={({ pressed }) => [
                            styles.agePill,
                            isSelected ? styles.agePillSelected : null,
                            pressed ? styles.agePillPressed : null,
                          ]}
                        >
                          <Text style={[styles.agePillText, isSelected ? styles.agePillTextSelected : null]}>
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              </Card>

              <Button label="Get My First Script" onPress={completeOnboarding} />
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    position: 'relative',
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glowOne: {
    position: 'absolute',
    right: -54,
    top: 24,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(79, 139, 255, 0.12)',
  },
  glowTwo: {
    position: 'absolute',
    left: -64,
    top: 220,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(143, 211, 180, 0.08)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.borderSoft,
  },
  progressDotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  logoBadge: {
    minHeight: 92,
    minWidth: 220,
    borderRadius: radius.large,
    backgroundColor: colors.softSectionBackground,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadow.soft,
  },
  logo: {
    width: 160,
    height: 48,
    resizeMode: 'contain',
  },
  pageCount: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  section: {
    gap: spacing.md,
  },
  sectionTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  skipButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    flexShrink: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  featureList: {
    gap: spacing.sm,
  },
  featureCard: {
    gap: spacing.xs,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  featureBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  footerLink: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  footerLinkText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  formCard: {
    gap: spacing.md,
  },
  momentSummary: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  momentSummaryText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  input: {
    minHeight: 58,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ageRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  agePill: {
    minWidth: 56,
    minHeight: 56,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  agePillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.chipBackground,
  },
  agePillPressed: {
    opacity: 0.82,
  },
  agePillText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  agePillTextSelected: {
    color: colors.primary,
  },
});
