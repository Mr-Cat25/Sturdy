import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { useAuth } from '../../src/context/AuthContext';
import { sturdyTheme } from '../../src/theme';

const { colors, spacing, radii, shadows, typography, components } = sturdyTheme;

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const { session } = useAuth();
  const isWide = width >= 700;

  const handleStartPress = () => {
    console.log('START pressed');
    router.navigate('/emotional-framing');
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
                <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
              </View>
            </View>

            <View style={styles.headlineBlock}>
              <Text style={styles.eyebrow}>For hard parenting moments</Text>
              <Text style={styles.title}>What do I say right now?</Text>
              <Text style={styles.subtitle}>
                Sturdy gives you calm, age-aware words for the exact moment in front of you.
              </Text>
            </View>

            <View style={styles.buttonBlock}>
              <Button label="Start Free" onPress={handleStartPress} style={styles.ctaButton} />
              <Button
                label={session ? 'Account' : 'Sign In'}
                onPress={handleAccountPress}
                style={styles.ctaButton}
              />
              <Text style={styles.ctaCaption}>Get a calm script in under a minute.</Text>
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
  eyebrow: {
    color: colors.primary,
    ...typography.eyebrow,
    textAlign: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    flexShrink: 1,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    ...typography.body,
    flexShrink: 1,
    textAlign: 'center',
  },
  buttonBlock: {
    gap: spacing.md,
    paddingTop: spacing.xs,
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
