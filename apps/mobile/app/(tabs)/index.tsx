// app/(tabs)/index.tsx — Dashboard Hub
// Everything lives here. SOS stays above fold always.
// Sections: Greeting → SOS → Your Child → Your Library → Settings

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router }          from 'expo-router';
import { StatusBar }       from 'expo-status-bar';
import { SafeAreaView }    from 'react-native-safe-area-context';
import { Button }          from '../../src/components/ui/Button';
import { useAuth }         from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';
import { getScriptUsage, type ScriptUsage } from '../../src/lib/getScriptUsage';
import { colors, radius, shadow, spacing, type } from '../../src/theme';

const FREE_TOTAL = 5;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getDayTime() {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const day  = days[new Date().getDay()];
  const h    = new Date().getHours();
  if (h < 12) return `${day} morning`;
  if (h < 18) return `${day} afternoon`;
  return `${day} evening`;
}

// Section header component
function SectionHeader({ label }: { label: string }) {
  return (
    <View style={sectionStyles.header}>
      <Text style={sectionStyles.label}>{label}</Text>
      <View style={sectionStyles.line} />
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label:  { ...type.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, flexShrink: 0 },
  line:   { flex: 1, height: 1, backgroundColor: colors.borderSoft },
});

export default function DashboardScreen() {
  const { session, signOut }  = useAuth();
  const { activeChild, reloadChild } = useChildProfile();

  const [usage,        setUsage]        = useState<ScriptUsage>({
    used: 0, remaining: FREE_TOTAL, total: FREE_TOTAL, isOut: false,
  });
  const [usageLoading, setUsageLoading] = useState(true);
  const [signingOut,   setSigningOut]   = useState(false);

  // Pulse animation for SOS dot
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const loadUsage = useCallback(async () => {
    if (!session?.user?.id) {
      setUsage({ used: 0, remaining: FREE_TOTAL, total: FREE_TOTAL, isOut: false });
      setUsageLoading(false);
      return;
    }
    setUsageLoading(true);
    try {
      const result = await getScriptUsage(session.user.id);
      setUsage(result);
    } finally { setUsageLoading(false); }
  }, [session?.user?.id]);

  useEffect(() => { loadUsage(); }, [loadUsage]);

  const hasChild     = activeChild !== null;
  const childName    = activeChild?.name;
  const childAge     = activeChild?.childAge;
  const outOfScripts = usage.isOut;

  const greetingName = hasChild
    ? `${getGreeting()},\n${childName}'s parent`
    : getGreeting();

  const handleSOS = () => {
    if (outOfScripts) return; // SOS tab modal handles paywall
    router.push('/now');
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/welcome');
    } catch { /* non-fatal */ }
    finally { setSigningOut(false); }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ══ GREETING ══ */}
        <View style={styles.greeting}>
          <Text style={styles.dayTime}>{getDayTime()}</Text>
          <Text style={styles.greetingText}>{greetingName}</Text>
          <Text style={styles.greetingSub}>
            {hasChild ? 'How can Sturdy support you today?' : 'Ready for support?'}
          </Text>
        </View>

        {/* ══ FREE SCRIPTS COUNTER ══ */}
        <View style={[styles.counterCard, outOfScripts && styles.counterCardWarn, shadow.sm]}>
          <View style={styles.counterLeft}>
            <Text style={styles.counterLabel}>Free support</Text>
            <View style={styles.pips}>
              {Array.from({ length: FREE_TOTAL }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.pip, i < usage.remaining ? styles.pipOn : styles.pipOff]}
                />
              ))}
            </View>
            <Text style={styles.counterValue}>
              {usageLoading ? '—' : outOfScripts
                ? 'No scripts left'
                : `${usage.remaining} of ${FREE_TOTAL} remaining`}
            </Text>
          </View>
          <Pressable
            onPress={() => { /* navigate to upgrade */ }}
            style={({ pressed }) => [styles.upgradeBtn, pressed && { opacity: 0.75 }]}
          >
            <Text style={styles.upgradeBtnText}>Unlock unlimited →</Text>
          </Pressable>
        </View>

        {/* ══ YOUR CHILD ══ */}
        <SectionHeader label="Your child" />

        <View style={[styles.card, shadow.sm]}>
          {hasChild ? (
            <>
              {/* Child avatar + name */}
              <View style={styles.childRow}>
                <View style={styles.childAvatar}>
                  <Text style={styles.childAvatarText}>
                    {childName!.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{childName}</Text>
                  <Text style={styles.childAge}>Age {childAge}</Text>
                </View>
                <Pressable
                  onPress={() => router.push('/child/new')}
                  style={({ pressed }) => [styles.addChildBtn, pressed && { opacity: 0.65 }]}
                >
                  <Text style={styles.addChildBtnText}>+ Add child</Text>
                </Pressable>
              </View>

              {/* Script tip */}
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  ✨ Better scripts start with better descriptions. In SOS, mention {childName}'s personality, usual triggers, and what typically helps. Sturdy adapts to every detail.
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Add your child</Text>
              <Text style={styles.cardBody}>
                Sturdy adapts every script to your child's exact age and what you share about them.
              </Text>
              <Button
                label="Add child"
                size="md"
                onPress={() => router.push(session ? '/child/new' : '/child-setup')}
              />
            </>
          )}
        </View>

        {/* ══ YOUR LIBRARY ══ */}
        <SectionHeader label="Your library" />

        <View style={styles.libraryRow}>
          {/* SOS History */}
          <Pressable
            onPress={() => router.push('/(tabs)/history')}
            style={({ pressed }) => [styles.libraryCard, shadow.sm, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.libraryIcon}>🆘</Text>
            <Text style={styles.libraryLabel}>SOS History</Text>
            <Text style={styles.libraryDesc}>Past hard moments</Text>
            <Text style={styles.libraryArrow}>→</Text>
          </Pressable>

          {/* Saved Scripts */}
          <Pressable
            onPress={() => router.push('/(tabs)/saved')}
            style={({ pressed }) => [styles.libraryCard, shadow.sm, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.libraryIcon}>🔖</Text>
            <Text style={styles.libraryLabel}>Saved Scripts</Text>
            <Text style={styles.libraryDesc}>Scripts that helped</Text>
            <Text style={styles.libraryArrow}>→</Text>
          </Pressable>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xxl,
    gap:               spacing.lg,
  },

  // Greeting
  greeting:     { gap: 4 },
  dayTime:      { ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  greetingText: { fontSize: 26, fontWeight: '800', color: colors.text, lineHeight: 32, letterSpacing: -0.3 },
  greetingSub:  { ...type.body, color: colors.textSecondary },

  // Counter
  counterCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.md,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
  counterCardWarn: { backgroundColor: colors.amberLight, borderColor: 'rgba(200,136,58,0.3)' },
  counterLeft:     { gap: 4 },
  counterLabel:    { ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  counterValue:    { fontSize: 13, fontWeight: '700', color: colors.text },
  pips:            { flexDirection: 'row', gap: 4, marginVertical: 2 },
  pip:             { width: 8, height: 8, borderRadius: radius.pill },
  pipOn:           { backgroundColor: colors.amber },
  pipOff:          { backgroundColor: 'rgba(200,136,58,0.15)' },
  upgradeBtn:      { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  upgradeBtnText:  { fontSize: 12, fontWeight: '700', color: colors.primary },

  // SOS hero
  sosCard: {
    backgroundColor: colors.night,
    borderRadius:    radius.xl,
    padding:         spacing.xl,
    gap:             spacing.sm,
  },
  sosBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  sosDot:      { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.danger },
  sosBadgeText: { ...type.label, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.8 },
  sosWord: { fontSize: 56, fontWeight: '800', color: colors.textInverse, lineHeight: 56, letterSpacing: -2 },
  sosSub:  { ...type.body, color: 'rgba(255,255,255,0.4)', marginTop: -spacing.xs },
  sosDesc: { ...type.body, color: 'rgba(255,255,255,0.65)', lineHeight: 26 },
  sosHint: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius:    radius.medium,
    padding:         spacing.sm,
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.08)',
  },
  sosHintText: { fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 18 },
  sosBtn:      { marginTop: spacing.xs },

  // Cards
  card:      { backgroundColor: colors.surface, borderRadius: radius.large, padding: spacing.lg, gap: spacing.md },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  cardBody:  { ...type.bodySmall, color: colors.textSecondary, lineHeight: 20 },

  // Child
  childRow:       { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  childAvatar:    { width: 48, height: 48, borderRadius: radius.pill, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  childAvatarText:{ fontSize: 20, fontWeight: '800', color: colors.textInverse },
  childInfo:      { flex: 1 },
  childName:      { fontSize: 17, fontWeight: '700', color: colors.text },
  childAge:       { ...type.bodySmall, color: colors.textMuted },
  addChildBtn:    { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  addChildBtnText:{ fontSize: 12, fontWeight: '700', color: colors.primary },
  tipCard:        { backgroundColor: colors.backgroundSoft, borderRadius: radius.medium, padding: spacing.sm, borderWidth: 1, borderColor: colors.borderSoft },
  tipText:        { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  // Library
  libraryRow: { flexDirection: 'row', gap: spacing.sm },
  libraryCard: {
    flex:            1,
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.md,
    gap:             4,
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
  libraryIcon:  { fontSize: 22 },
  libraryLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  libraryDesc:  { ...type.caption, color: colors.textMuted },
  libraryArrow: { ...type.bodySmall, color: colors.primary, fontWeight: '700', marginTop: spacing.xs },

  // Account
  accountRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  accountLeft: { flex: 1, gap: 2 },
  accountLabel:{ ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  accountEmail:{ fontSize: 14, fontWeight: '600', color: colors.text },
  accountPlan: { fontSize: 13, color: colors.textSecondary },
  planBtn:     { backgroundColor: colors.amberLight, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(200,136,58,0.3)' },
  planBtnText: { fontSize: 12, fontWeight: '700', color: colors.amberDark },
  guestRow:    { gap: spacing.md },
  authBtns:    { flexDirection: 'row', gap: spacing.sm },
  authBtn:     { flex: 1 },

  // Legal
  legalRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  legalText: { ...type.body, color: colors.primary, fontWeight: '600' },
  legalArrow:{ ...type.body, color: colors.textMuted },

  // Bottom
  version: { ...type.caption, color: colors.textMuted, textAlign: 'center' },
});


