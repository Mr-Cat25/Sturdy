import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Screen } from '../src/components/ui/Screen';
import { sturdyTheme } from '../src/theme';

const { colors, spacing, radii, shadows, typography, components } = sturdyTheme;

export default function EmotionalFramingScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  return (
    <Screen
      footer={<Button label="Continue" onPress={() => router.navigate('/child-setup')} style={styles.ctaButton} />}
    >
      <View style={[styles.container, isWide ? styles.containerWide : null]}>
        <View pointerEvents="none" style={styles.ambientLayer}>
          <View style={styles.ambientWarm} />
          <View style={styles.ambientCool} />
        </View>

        <View style={[styles.card, isWide ? styles.cardWide : null]}>
          <View style={styles.illustrationWrap}>
            <View style={styles.illustrationOuter}>
              <View style={styles.illustrationInner} />
            </View>
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.title}>Parenting moments can escalate fast.</Text>
            <Text style={styles.body}>
              Sometimes you just need the right words. Sturdy helps you regulate, connect,
              and guide your child.
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  containerWide: {
    alignSelf: 'center',
    maxWidth: 900,
    width: '100%',
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  ambientWarm: {
    position: 'absolute',
    top: 36,
    right: -56,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 179, 107, 0.14)',
  },
  ambientCool: {
    position: 'absolute',
    left: -72,
    bottom: 120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(111, 168, 255, 0.10)',
  },
  card: {
    ...components.card,
    ...shadows.card,
    backgroundColor: colors.cardBackground,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.xl,
    justifyContent: 'center',
  },
  cardWide: {
    maxWidth: 680,
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationOuter: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(111, 168, 255, 0.14)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(123, 207, 166, 0.24)',
  },
  copyBlock: {
    gap: spacing.md,
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    ...typography.h1,
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: 'center',
    maxWidth: 520,
  },
  ctaButton: {
    ...components.primaryButton,
    ...shadows.soft,
  },
});