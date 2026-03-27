import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router }          from 'expo-router';
import { Button }          from '../../src/components/ui/Button';
import { Screen }          from '../../src/components/ui/Screen';
import { useAuth }         from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';
import { colors, radius, shadow, spacing, type } from '../../src/theme';

export default function ProfileScreen() {
  const { session }     = useAuth();
  const { activeChild } = useChildProfile();

  const hasChild   = activeChild !== null;
  const childLabel = hasChild
    ? `${activeChild.name} · Age ${activeChild.childAge}`
    : 'No child added yet';

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.sub}>
          Your child, support history, and saved scripts.
        </Text>
      </View>

      {/* ── Active child ── */}
      <View style={[styles.card, shadow.sm]}>
        <Text style={styles.label}>Active child</Text>
        <Text style={styles.cardTitle}>{childLabel}</Text>
        <Text style={styles.cardBody}>
          {hasChild
            ? 'This child context shapes every script Sturdy generates.'
            : 'Add a child so Sturdy can tailor support to the right age.'}
        </Text>
        <Button
          label={hasChild ? 'Add another child' : 'Add child'}
          variant={hasChild ? 'ghost' : 'primary'}
          size="md"
          onPress={() =>
            router.push(session ? '/child/new' : '/child-setup')
          }
        />
      </View>

      {/* ── SOS History ── */}
      <View style={[styles.card, shadow.sm]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconDot, { backgroundColor: colors.dangerLight }]}>
            <Text style={styles.iconEmoji}>🆘</Text>
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.label}>SOS History</Text>
            <Text style={styles.cardTitle}>Past hard moments</Text>
          </View>
        </View>
        <Text style={styles.cardBody}>
          Every situation you've described and the script Sturdy gave
          you — organised by child and date.
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/history')}
          style={({ pressed }) => [styles.link, pressed && { opacity: 0.65 }]}
        >
          <Text style={styles.linkText}>Open SOS history →</Text>
        </Pressable>
      </View>

      {/* ── Saved Scripts ── */}
      <View style={[styles.card, shadow.sm]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconDot, { backgroundColor: colors.sageLight }]}>
            <Text style={styles.iconEmoji}>🔖</Text>
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.label}>Saved Scripts</Text>
            <Text style={styles.cardTitle}>Scripts that helped</Text>
          </View>
        </View>
        <Text style={styles.cardBody}>
          Scripts you've bookmarked to reuse — your personal support
          library, ready when you need it.
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/saved')}
          style={({ pressed }) => [styles.link, pressed && { opacity: 0.65 }]}
        >
          <Text style={styles.linkText}>Open saved scripts →</Text>
        </Pressable>
      </View>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginTop: spacing.xs },
  title:  { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36 },
  sub:    { ...type.body, color: colors.textSecondary },

  card: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.lg,
    gap:             spacing.sm,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
  },
  iconDot: {
    width:          40,
    height:         40,
    borderRadius:   radius.medium,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  iconEmoji:      { fontSize: 18 },
  cardHeaderText: { flex: 1, gap: 2 },

  label:     { ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, lineHeight: 24 },
  cardBody:  { ...type.bodySmall, color: colors.textSecondary, lineHeight: 20 },

  link:     { alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center' },
  linkText: { ...type.body, color: colors.primary, fontWeight: '700' },
});
