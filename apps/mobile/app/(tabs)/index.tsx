import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
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
import { colors, radius, shadow, spacing, type } from '../../src/theme';

const FREE_TOTAL     = 5;
let FREE_REMAINING = 3;

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

export default function DashboardScreen() {
  const { session }      = useAuth();
  const { activeChild }  = useChildProfile();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const hasChild     = activeChild !== null;
  const childName    = activeChild?.name;
  const childAge     = activeChild?.childAge;
  const outOfScripts = FREE_REMAINING ==5;

  const greetingName = hasChild
    ? `${getGreeting()},\n${childName}'s parent`
    : getGreeting();

  const handleSOS = () => {
    if (outOfScripts) { setPaywallVisible(true); return; }
    router.push('/now');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.dayTime}>{getDayTime()}</Text>
          <Text style={styles.greetingText}>{greetingName}</Text>
          <Text style={styles.greetingSub}>
            {hasChild ? 'How can Sturdy support you today?' : 'Ready for support?'}
          </Text>
        </View>

        {/* Meta strip */}
        <View style={styles.metaStrip}>
          <View style={[styles.metaPill, shadow.sm, outOfScripts && styles.metaPillWarn]}>
            <Text style={styles.metaLabel}>Free support</Text>
            <View style={styles.pips}>
              {Array.from({ length: FREE_TOTAL }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.pip, i < FREE_REMAINING ? styles.pipOn : styles.pipOff]}
                />
              ))}
            </View>
            <Text style={styles.metaValue}>
              {outOfScripts ? 'No scripts left' : `${FREE_REMAINING} remaining`}
            </Text>
            <Pressable onPress={() => setPaywallVisible(true)}>
              <Text style={styles.metaAction}>Unlock unlimited →</Text>
            </Pressable>
          </View>

          <View style={[styles.metaPill, shadow.sm]}>
            <Text style={styles.metaLabel}>Active child</Text>
            {hasChild ? (
              <>
                <View style={styles.childAvatar}>
                  <Text style={styles.childAvatarText}>
                    {childName!.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.metaValue}>{childName} · {childAge}</Text>
                <Pressable onPress={() => router.push('/(tabs)/profile')}>
                  <Text style={styles.metaAction}>Manage →</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.metaValue}>No child added</Text>
                <Pressable
                  onPress={() => router.push(session ? '/child/new' : '/child-setup')}
                >
                  <Text style={styles.metaAction}>Add child →</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* SOS Hero */}
        <Pressable
          onPress={handleSOS}
          style={({ pressed }) => [styles.sosCard, pressed && { opacity: 0.94 }]}
        >
          <View style={styles.sosBadgeRow}>
            <Animated.View style={[styles.sosDot, { opacity: pulse }]} />
            <Text style={styles.sosBadgeText}>For hard moments right now</Text>
          </View>

          <Text style={styles.sosWord}>SOS</Text>
          <Text style={styles.sosSub}>Immediate support</Text>
          <Text style={styles.sosDesc}>
            Describe what's happening and get calm, practical words you can use right away.
          </Text>

          <View style={styles.sosBtn}>
            <Button
              label={outOfScripts ? 'See upgrade options' : 'Start SOS'}
              onPress={handleSOS}
              variant={outOfScripts ? 'ghost' : 'amber'}
              dark
            />
          </View>
        </Pressable>

        {/* Continuity */}
        <View style={styles.previewCard}>
          <Text style={styles.previewText}>
            Saved scripts and history live in{' '}
            <Text
              style={styles.previewLink}
              onPress={() => router.push('/(tabs)/profile')}
            >
              Profile →
            </Text>
          </Text>
        </View>

      </ScrollView>

      {/* Paywall bottom sheet */}
      <Modal
        visible={paywallVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaywallVisible(false)}
      >
        <Pressable
          style={styles.sheetOverlay}
          onPress={() => setPaywallVisible(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetHeadline}>
            Keep going.{'\n'}Unlock unlimited.
          </Text>
          <Text style={styles.sheetSub}>
            You've used your {FREE_TOTAL} free scripts. Upgrade to keep Sturdy
            ready whenever hard moments happen.
          </Text>

          <View style={styles.sheetPerks}>
            {[
              'Unlimited scripts, any time',
              'Save every script that works',
              'Full history and child insights',
            ].map(perk => (
              <View key={perk} style={styles.sheetPerk}>
                <View style={styles.perkCheck}>
                  <Text style={styles.perkCheckText}>✓</Text>
                </View>
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sheetPriceRow}>
            <Text style={styles.sheetPriceBig}>$7</Text>
            <Text style={styles.sheetPricePeriod}> / month</Text>
            <View style={styles.sheetPricePill}>
              <Text style={styles.sheetPricePillText}>Save 30% annually</Text>
            </View>
          </View>

          <Button
            label="Unlock unlimited access"
            onPress={() => setPaywallVisible(false)}
          />
          <Button
            label="Maybe later"
            variant="ghost"
            size="md"
            onPress={() => setPaywallVisible(false)}
          />
          <Text style={styles.sheetTerms}>Cancel anytime · No hidden fees</Text>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xl,
    gap:               spacing.md,
  },

  greeting:     { gap: 4 },
  dayTime:      { ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  greetingText: {
    fontSize:      26,
    fontWeight:    '800',
    color:         colors.text,
    lineHeight:    32,
    letterSpacing: -0.3,
  },
  greetingSub: { ...type.body, color: colors.textSecondary },

  metaStrip: { flexDirection: 'row', gap: spacing.sm },
  metaPill: {
    flex:            1,
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.md,
    gap:             spacing.xxs,
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
  metaPillWarn: {
    borderColor:     'rgba(200,136,58,0.3)',
    backgroundColor: colors.amberLight,
  },
  metaLabel:  { ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  metaValue:  { fontSize: 14, fontWeight: '700', color: colors.text },
  metaAction: { fontSize: 11, fontWeight: '700', color: colors.primary, marginTop: 2 },

  pips:   { flexDirection: 'row', gap: 3, marginVertical: 2 },
  pip:    { width: 8, height: 8, borderRadius: radius.pill },
  pipOn:  { backgroundColor: colors.amber },
  pipOff: { backgroundColor: 'rgba(200,136,58,0.15)' },

  childAvatar: {
    width:           28,
    height:          28,
    borderRadius:    radius.pill,
    backgroundColor: colors.sage,
    alignItems:      'center',
    justifyContent:  'center',
    marginVertical:  2,
  },
  childAvatarText: { fontSize: 13, fontWeight: '800', color: colors.textInverse },

  sosCard: {
    backgroundColor: colors.night,
    borderRadius:    radius.xl,
    padding:         spacing.xl,
    gap:             spacing.sm,
    minHeight:       280,
    justifyContent:  'space-between',
  },
  sosBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  sosDot:      { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.danger },
  sosBadgeText: {
    ...type.label,
    color:         'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sosWord: {
    fontSize:      64,
    fontWeight:    '800',
    color:         colors.textInverse,
    lineHeight:    64,
    letterSpacing: -2,
  },
  sosSub:  { ...type.body, color: 'rgba(255,255,255,0.4)', marginTop: -spacing.xs },
  sosDesc: { ...type.body, color: 'rgba(255,255,255,0.65)', lineHeight: 26 },
  sosBtn:  { marginTop: spacing.xs },

  previewCard: {
    backgroundColor: colors.backgroundSoft,
    borderRadius:    radius.medium,
    padding:         spacing.md,
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
  previewText: { ...type.bodySmall, color: colors.textSecondary },
  previewLink: { color: colors.primary, fontWeight: '700' },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(26,24,20,0.45)' },
  sheet: {
    backgroundColor:  colors.surface,
    borderRadius:     radius.xl,
    padding:          spacing.xl,
    paddingTop:       spacing.sm,
    gap:              spacing.md,
    marginHorizontal: spacing.sm,
    marginBottom:     spacing.md,
  },
  sheetHandle: {
    width:           36,
    height:          4,
    borderRadius:    2,
    backgroundColor: colors.borderSoft,
    alignSelf:       'center',
    marginBottom:    spacing.sm,
  },
  sheetHeadline: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 28 },
  sheetSub:      { ...type.body, color: colors.textSecondary, lineHeight: 24 },

  sheetPerks: {
    gap:             spacing.sm,
    backgroundColor: colors.background,
    borderRadius:    radius.medium,
    padding:         spacing.md,
  },
  sheetPerk:  { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  perkCheck: {
    width:           18,
    height:          18,
    borderRadius:    radius.pill,
    backgroundColor: colors.sageLight,
    borderWidth:     1,
    borderColor:     'rgba(124,154,135,0.3)',
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       1,
    flexShrink:      0,
  },
  perkCheckText: { fontSize: 9, fontWeight: '800', color: colors.sage },
  perkText:      { ...type.bodySmall, color: colors.textSecondary, flex: 1 },

  sheetPriceRow:    { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  sheetPriceBig:    { fontSize: 32, fontWeight: '800', color: colors.text },
  sheetPricePeriod: { ...type.body, color: colors.textMuted },
  sheetPricePill: {
    backgroundColor:   colors.sageLight,
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical:   2,
    marginLeft:        spacing.xs,
  },
  sheetPricePillText: { fontSize: 10, fontWeight: '700', color: colors.sage },
  sheetTerms:         { ...type.caption, color: colors.textMuted, textAlign: 'center' },
});
