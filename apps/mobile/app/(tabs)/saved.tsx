import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router }       from 'expo-router';
import { StatusBar }    from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button }       from '../../src/components/ui/Button';
import { useAuth }      from '../../src/context/AuthContext';
import {
  loadSavedScripts,
  type SavedScriptRow,
} from '../../src/lib/loadSavedScripts';
import { colors, radius, shadow, spacing, type } from '../../src/theme';

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric',
    }).format(new Date(iso));
  } catch {
    return 'Saved recently';
  }
}

export default function SavedScreen() {
  const { session, isLoading: authLoading } = useAuth();
  const [scripts, setScripts] = useState<SavedScriptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(async () => {
    if (!session) { setLoading(false); return; }
    setLoading(true);
    setError('');
    try {
      const data = await loadSavedScripts();
      setScripts(data);
    } catch {
      setError('Could not load saved scripts.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  // Guest state
  if (!session && !authLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Sign in to see saved scripts</Text>
          <Text style={styles.emptyBody}>
            Your saved scripts are stored with your account.
          </Text>
          <Button
            label="Sign in"
            onPress={() => router.push('/auth/sign-in')}
            style={styles.emptyBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Saved scripts</Text>
        <Text style={styles.sub}>Scripts that helped, ready to use again.</Text>

        {loading ? (
          <ActivityIndicator
            color={colors.amber}
            style={{ marginTop: spacing.xl }}
          />
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button label="Try again" size="md" variant="ghost" onPress={load} />
          </View>
        ) : scripts.length === 0 ? (
          <View style={[styles.emptyCard, shadow.sm]}>
            <Text style={styles.emptyCardTitle}>No saved scripts yet</Text>
            <Text style={styles.emptyCardBody}>
              After getting a script, tap "Save script" to add it here.
            </Text>
            <Button
              label="Start SOS"
              size="md"
              onPress={() => router.push('/now')}
            />
          </View>
        ) : (
          scripts.map(s => (
            <View key={s.id} style={[styles.scriptCard, shadow.sm]}>
              <View style={styles.scriptMeta}>
                <Text style={styles.scriptDate}>{formatDate(s.created_at)}</Text>
                {s.child_age ? (
                  <Text style={styles.scriptAge}>Age {s.child_age}</Text>
                ) : null}
              </View>
              <Text style={styles.scriptSummary}>{s.situation_summary}</Text>
              <View style={styles.scriptBadges}>
                {(
                  [
                    { step: 'Regulate', bg: colors.sageLight,    tc: colors.sage    },
                    { step: 'Connect',  bg: colors.primaryLight,  tc: colors.primary },
                    { step: 'Guide',    bg: colors.amberLight,    tc: colors.amber   },
                  ] as const
                ).map(({ step, bg, tc }) => (
                  <View key={step} style={[styles.badge, { backgroundColor: bg }]}>
                    <Text style={[styles.badgeText, { color: tc }]}>{step}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.scriptPreview} numberOfLines={2}>
                {s.regulate}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xxl,
    gap:               spacing.lg,
  },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36 },
  sub:   { ...type.body, color: colors.textSecondary },

  empty: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        spacing.xl,
    gap:            spacing.md,
  },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  emptyBody:  { ...type.body, color: colors.textSecondary, textAlign: 'center' },
  emptyBtn:   { alignSelf: 'center' },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.xl,
    gap:             spacing.md,
    alignItems:      'center',
  },
  emptyCardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  emptyCardBody:  { ...type.bodySmall, color: colors.textSecondary, textAlign: 'center' },

  errorCard: {
    backgroundColor: colors.dangerLight,
    borderRadius:    radius.large,
    padding:         spacing.lg,
    gap:             spacing.sm,
  },
  errorText: { ...type.bodySmall, color: colors.dangerDark },

  scriptCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.lg,
    gap:             spacing.sm,
  },
  scriptMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  scriptDate: { ...type.caption, color: colors.textMuted },
  scriptAge:  {
    ...type.caption,
    color:             colors.sage,
    fontWeight:        '700',
    backgroundColor:   colors.sageLight,
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      radius.pill,
  },
  scriptSummary: { ...type.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  scriptBadges:  { flexDirection: 'row', gap: spacing.xs },
  badge: {
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical:   3,
  },
  badgeText:     { fontSize: 10, fontWeight: '800' },
  scriptPreview: { ...type.body, fontWeight: '600', color: colors.text, lineHeight: 24 },
});
