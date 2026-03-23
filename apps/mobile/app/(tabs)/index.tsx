import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';

const FREE_SUPPORT_REMAINING = 3;
const FREE_SUPPORT_TOTAL = 5;

const quickSituations = [
  'Bedtime',
  'Leaving the park',
  'Sibling conflict',
  'Public meltdown',
];

function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

export default function DashboardTabScreen() {
  const { width } = useWindowDimensions();
  const { session } = useAuth();
  const { draft } = useChildProfile();
  const isWide = width >= 700;

  const childName = draft.name?.trim();
  const childAge = draft.childAge;
  const greeting = getTimeGreeting();
  const hasActiveChild = childAge !== null;
  const greetingTitle = hasActiveChild && childName ? `${greeting}, ${childName}'s parent` : greeting;
  const greetingSubtitle = hasActiveChild ? 'How can Sturdy support you today?' : 'Ready for support?';
  const childSummaryTitle = hasActiveChild
    ? childName
      ? `${childName} · Age ${childAge}`
      : `Your child · Age ${childAge}`
    : 'No child added yet';
  const childSummaryBody = hasActiveChild
    ? 'Active child. Manage this profile and your library in Profile.'
    : 'Add a child so Sturdy can tailor support to the right age.';

  const handleStartSos = () => {
    router.push('/now');
  };

  return (
    <Screen>
      <View style={[styles.header, isWide ? styles.headerWide : null]}>
        <Text style={styles.greeting}>{greetingTitle}</Text>
        <Text style={styles.supportLine}>{greetingSubtitle}</Text>
      </View>

      <View style={[styles.topRow, isWide ? styles.topRowWide : null]}>
        <View style={[styles.supportCard, styles.topCard, isWide ? styles.supportCardWide : null]}>
          <Text style={styles.cardEyebrow}>Included support</Text>
          <Text style={styles.cardTitle}>Your free support</Text>
          <Text style={styles.cardBody}>
            {FREE_SUPPORT_REMAINING} of {FREE_SUPPORT_TOTAL} scripts remaining
          </Text>
        </View>

        <View style={[styles.childCard, styles.topCard, isWide ? styles.childCardWide : null]}>
          <Text style={styles.cardEyebrow}>{hasActiveChild ? 'Active child' : 'Profile setup'}</Text>
          <Text style={styles.cardTitle}>{childSummaryTitle}</Text>
          <Text style={styles.cardBody}>{childSummaryBody}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              hasActiveChild
                ? router.push('/(tabs)/profile')
                : router.push(session ? '/child/new' : '/create-account')
            }
            style={({ pressed }) => [styles.inlineAction, pressed ? styles.inlineActionPressed : null]}
          >
            <Text style={styles.inlineActionText}>{hasActiveChild ? 'Manage in Profile' : 'Add child'}</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleStartSos}
        style={({ pressed }) => [styles.sosCard, pressed ? styles.sosCardPressed : null]}
      >
        <Text style={styles.sosEyebrow}>Immediate support</Text>
        <Text style={styles.sosTitle}>SOS</Text>
        <Text style={styles.sosSubtitle}>For hard moments right now</Text>
        <Text style={styles.sosBody}>Get calm, practical words you can use right away.</Text>
        <View style={styles.sosButtonWrap}>
          <Button label="Start SOS" onPress={handleStartSos} style={styles.sosButton} />
        </View>
      </Pressable>

      <View style={styles.quickSection}>
        <Text style={styles.quickSectionTitle}>Quick situations</Text>
        <View style={styles.quickChips}>
          {quickSituations.map((situation) => (
            <Chip
              key={situation}
              label={situation}
              onPress={handleStartSos}
              selected={false}
            />
          ))}
        </View>
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Profile keeps your child context, saved scripts, and history together.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/profile')}
          style={({ pressed }) => [styles.previewLink, pressed ? styles.inlineActionPressed : null]}
        >
          <Text style={styles.previewLinkText}>Open Profile</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  headerWide: {
    maxWidth: 760,
  },
  greeting: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    flexShrink: 1,
  },
  supportLine: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
  },
  topRow: {
    gap: spacing.md,
  },
  topRowWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  topCard: {
    flex: 1,
  },
  supportCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadow,
  },
  supportCardWide: {
    minHeight: 150,
  },
  childCard: {
    backgroundColor: '#FFF9F1',
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: '#F1E0BF',
    ...shadow,
  },
  childCardWide: {
    minHeight: 150,
  },
  cardEyebrow: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  inlineAction: {
    alignSelf: 'flex-start',
    minHeight: 36,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  inlineActionPressed: {
    opacity: 0.82,
  },
  inlineActionText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  sosCard: {
    backgroundColor: '#FFF2E1',
    borderRadius: 32,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#F1D4A7',
    ...shadow,
  },
  sosCardPressed: {
    opacity: 0.96,
  },
  sosEyebrow: {
    color: '#8A5A14',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sosTitle: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 44,
  },
  sosSubtitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  sosBody: {
    color: colors.textSecondary,
    fontSize: 17,
    lineHeight: 25,
    maxWidth: 420,
  },
  sosButtonWrap: {
    paddingTop: spacing.sm,
  },
  sosButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E58A2F',
  },
  quickSection: {
    gap: spacing.sm,
  },
  quickSectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  quickChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  previewCard: {
    backgroundColor: '#F2F5FB',
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewTitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  previewLink: {
    alignSelf: 'flex-start',
    minHeight: 34,
    justifyContent: 'center',
  },
  previewLinkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
});
