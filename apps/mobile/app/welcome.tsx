import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Screen } from '../src/components/ui/Screen';
import { useAuth } from '../src/context/AuthContext';
import { sturdyTheme } from '../src/theme';

const { colors, spacing, radii, shadows, typography, components } = sturdyTheme;

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const { session } = useAuth();
  const isWide = width >= 700;

  const handleStartPress = () => {
    console.log('START pressed');
    router.navigate('/emotional-framing');
  };

  const handleSavedScriptsPress = () => {
    router.push('/saved');
  };

  const handleAccountPress = () => {
    if (session) {
      router.push('/account');
      return;
    }

    router.push('/create-account');
  };

  return (
    <Screen>
      <View style={[styles.container, isWide ? styles.containerWide : null]}>
        <View pointerEvents="none" style={styles.ambientLayer}>
          <View style={styles.ambientWarm} />
          <View style={styles.ambientCool} />
        </View>

        <View style={[styles.heroShell, isWide ? styles.heroShellWide : null]}>
          <View style={[styles.heroCard, isWide ? styles.heroCardWide : null]}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Image source={require('../assets/logo.png')} style={styles.logoImage} />
              </View>
            </View>

            <View style={styles.headlineBlock}>
              <Text style={styles.title}>What should I say right now?</Text>
              <Text style={styles.subtitle}>Calm scripts for hard parenting moments.</Text>
            </View>

            <View style={styles.reassuranceRow}>
              <View style={[styles.reassurancePill, styles.reassurancePillBlue]}>
                <Text style={styles.reassuranceText}>Age-aware</Text>
              </View>
              <View style={[styles.reassurancePill, styles.reassurancePillCoral]}>
                <Text style={styles.reassuranceText}>Gentle tone</Text>
              </View>
              <View style={[styles.reassurancePill, styles.reassurancePillGreen]}>
                <Text style={styles.reassuranceText}>Ready in seconds</Text>
              </View>
            </View>

            <View style={styles.buttonBlock}>
              <Button label="Start Free" onPress={handleStartPress} style={styles.ctaButton} />
              <Button
                label={session ? 'Account' : 'Sign In'}
                onPress={handleAccountPress}
                style={styles.ctaButton}
              />
              <Button
                label="Saved Scripts"
                onPress={handleSavedScriptsPress}
                style={styles.ctaButton}
              />
              <Text style={styles.ctaCaption}>Get help in under a minute.</Text>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    gap: spacing.lg,
    paddingBottom: spacing.lg,
    position: 'relative',
  },
  containerWide: {
    alignSelf: 'center',
    maxWidth: 1100,
    width: '100%',
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  ambientWarm: {
    position: 'absolute',
    top: 18,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 179, 107, 0.18)',
  },
  ambientCool: {
    position: 'absolute',
    left: -60,
    top: 180,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(111, 168, 255, 0.12)',
  },
  heroShell: {
    gap: spacing.lg,
    flex: 1,
    justifyContent: 'center',
  },
  heroShellWide: {
    alignItems: 'center',
  },
  heroCard: {
    ...components.card,
    ...shadows.card,
    backgroundColor: colors.cardBackground,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  heroCardWide: {
    maxWidth: 640,
    width: '100%',
  },
  brandRow: {
    justifyContent: 'center',
  },
  logoBadge: {
    minHeight: 92,
    minWidth: 220,
    borderRadius: radii.lg,
    backgroundColor: colors.softSectionBackground,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logoImage: {
    width: 160,
    height: 48,
    resizeMode: 'contain',
  },
  headlineBlock: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    ...typography.h1,
    flexShrink: 1,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    ...typography.body,
    flexShrink: 1,
    textAlign: 'center',
  },
  reassuranceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  reassurancePill: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  reassurancePillBlue: {
    backgroundColor: 'rgba(111, 168, 255, 0.16)',
  },
  reassurancePillCoral: {
    backgroundColor: 'rgba(255, 122, 122, 0.16)',
  },
  reassurancePillGreen: {
    backgroundColor: 'rgba(123, 207, 166, 0.18)',
  },
  reassuranceText: {
    color: colors.textPrimary,
    ...typography.caption,
  },
  buttonBlock: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    width: '100%',
  },
  ctaButton: {
    ...components.primaryButton,
    ...shadows.soft,
  },
  ctaCaption: {
    color: colors.textMuted,
    ...typography.caption,
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
  },
});