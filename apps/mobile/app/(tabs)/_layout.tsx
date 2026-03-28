// app/(tabs)/_layout.tsx
// 3-tab layout: Dashboard | SOS (centre pulse modal) | Settings
// SOS sheet: ScrollView wraps content, flat params passed to result screen

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Tabs, router } from 'expo-router';
import { Button }          from '../../src/components/ui/Button';
import { useAuth }         from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';
import { getParentingScript, CrisisDetectedError } from '../../src/lib/api';
import { colors, radius, spacing, type } from '../../src/theme';

const INTENSITY_CONFIG = [
  { level: 1, size: 18, color: '#7C9A87' },
  { level: 2, size: 22, color: '#8FA8BC' },
  { level: 3, size: 26, color: '#3C5A73' },
  { level: 4, size: 30, color: '#C8883A' },
  { level: 5, size: 36, color: '#C98B6B' },
] as const;

const CRISIS_KEYWORDS = [
  'hurt','hit','kill','die','dead','suicide','not breathing',
  'unconscious','bleeding','seizure','choke','knife','gun',
  'lose it','losing it',"can't control",'self harm','cutting',
];

function hasCrisisKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
}

function SOSSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { session }     = useAuth();
  const { activeChild } = useChildProfile();
  const [situation, setSituation] = useState('');
  const [intensity, setIntensity] = useState<number | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [crisis,    setCrisis]    = useState(false);
  const crisisOpacity = useRef(new Animated.Value(0)).current;

  const childName = activeChild?.name     ?? null;
  const childAge  = activeChild?.childAge ?? null;
  const childId   = activeChild?.id       ?? undefined;
  const userId    = session?.user?.id     ?? undefined;
  const canSubmit = Boolean(childName) && childAge !== null && situation.trim().length > 0;

  useEffect(() => {
    if (visible) {
      setSituation(''); setIntensity(null);
      setError(''); setCrisis(false);
      crisisOpacity.setValue(0);
    }
  }, [visible, crisisOpacity]);

  const handleTextChange = (text: string) => {
    setSituation(text);
    if (error) setError('');
    const detected = hasCrisisKeyword(text);
    if (detected !== crisis) {
      setCrisis(detected);
      Animated.timing(crisisOpacity, { toValue: detected ? 1 : 0, duration: 300, useNativeDriver: true }).start();
    }
  };

  const handleGetScript = async () => {
    const msg = situation.trim();
    if (!msg || !childName || childAge === null) return;
    setError(''); setLoading(true);
    try {
      const script = await getParentingScript({
        childName, childAge, message: msg,
        userId, childProfileId: childId, intensity,
      });
      onClose();
      router.push({
        pathname: '/result',
        params: {
          situationSummary: script.situation_summary,
          regulateAction:   script.regulate.parent_action,
          regulateScript:   script.regulate.script,
          connectAction:    script.connect.parent_action,
          connectScript:    script.connect.script,
          guideAction:      script.guide.parent_action,
          guideScript:      script.guide.script,
          avoid:            JSON.stringify(script.avoid),
        },
      });
    } catch (err) {
      if (err instanceof CrisisDetectedError) {
        onClose();
        router.push({ pathname: '/crisis', params: { crisisType: err.crisisType, riskLevel: err.riskLevel } });
        return;
      }
      setError("Couldn't get a script right now. Please try again.");
    } finally { setLoading(false); }
  };

  const handleUnsafe = () => {
    onClose();
    router.push({ pathname: '/crisis', params: { crisisType: 'manual', riskLevel: 'ELEVATED_RISK' } });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sheet.overlay} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={sheet.keyboard}>
        <View style={sheet.root}>
          <View style={sheet.handle} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={sheet.scrollContent}
          >
            {/* Header */}
            <View style={sheet.header}>
              {childName && childAge !== null ? (
                <View style={sheet.contextPill}>
                  <Text style={sheet.contextPillText}>🧒 {childName} · Age {childAge}</Text>
                </View>
              ) : null}
              <Text style={sheet.title}>{"What's happening\nright now?"}</Text>
              <Text style={sheet.sub}>Describe the moment and get calm words to say.</Text>
            </View>

            {/* No child */}
            {(!childName || childAge === null) ? (
              <View style={sheet.noChild}>
                <Text style={sheet.noChildText}>Add a child profile so Sturdy can tailor the script.</Text>
                <Pressable onPress={() => { onClose(); router.push(session ? '/child/new' : '/child-setup'); }}>
                  <Text style={sheet.noChildLink}>Add child →</Text>
                </Pressable>
              </View>
            ) : null}

            {/* Textarea */}
            <View style={sheet.textareaCard}>
              <TextInput
                autoFocus={Boolean(childName) && childAge !== null}
                multiline
                numberOfLines={4}
                placeholder="My child is screaming because we have to leave the park."
                placeholderTextColor="rgba(255,255,255,0.22)"
                value={situation}
                onChangeText={handleTextChange}
                style={sheet.textarea}
                textAlignVertical="top"
              />
              <Text style={sheet.textareaHint}>A simple snapshot is enough.</Text>
              <Animated.View style={[sheet.crisisBanner, { opacity: crisisOpacity }]}>
                <Pressable onPress={handleUnsafe} style={sheet.crisisBannerInner}>
                  <Text style={sheet.crisisIcon}>⚠️</Text>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={sheet.crisisTitle}>This sounds serious</Text>
                    <Text style={sheet.crisisSub}>Tap here if you need immediate help →</Text>
                  </View>
                </Pressable>
              </Animated.View>
            </View>

            {/* Intensity */}
            <View style={sheet.intensityWrap}>
              <Text style={sheet.intensityLabel}>
                Intensity <Text style={sheet.intensityOpt}>(optional)</Text>
              </Text>
              <View style={sheet.intensityCircles}>
                {INTENSITY_CONFIG.map(cfg => {
                  const sel = intensity === cfg.level;
                  return (
                    <Pressable
                      key={cfg.level}
                      onPress={() => setIntensity(sel ? null : cfg.level)}
                      style={sheet.intensityTap}
                    >
                      <View style={[
                        sheet.intensityCircle,
                        {
                          width:           cfg.size,
                          height:          cfg.size,
                          borderRadius:    cfg.size / 2,
                          backgroundColor: sel ? cfg.color : 'rgba(255,255,255,0.08)',
                          borderColor:     sel ? cfg.color : 'rgba(255,255,255,0.12)',
                        },
                      ]} />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {error ? <Text style={sheet.error}>{error}</Text> : null}

            <Button
              label={loading ? 'Getting script…' : 'Get Script'}
              onPress={handleGetScript}
              variant="amber"
              loading={loading}
              disabled={!canSubmit || loading}
              dark
            />

            <Pressable onPress={handleUnsafe} style={sheet.unsafeBtn}>
              <Text style={sheet.unsafeText}>This feels like an emergency → Get help now</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function SOSTabButton({ onPress }: { onPress: () => void }) {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale,   { toValue: 1.12, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1,    duration: 700, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 1,   duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, [scale, opacity]);

  return (
    <Pressable onPress={onPress} style={sosBtn.wrap}>
      <Animated.View style={[sosBtn.outer, { transform: [{ scale }], opacity }]} />
      <View style={sosBtn.inner}>
        <Text style={sosBtn.label}>SOS</Text>
      </View>
    </Pressable>
  );
}

const sosBtn = StyleSheet.create({
  wrap:  { width: 60, height: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  outer: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: colors.danger },
  inner: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#C94040',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  label: { fontSize: 10, fontWeight: '900', color: 'white', letterSpacing: 0.5 },
});

export default function TabsLayout() {
  const [sosVisible, setSosVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown:             false,
          tabBarActiveTintColor:   colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor:  colors.borderSoft,
            borderTopWidth:  1,
            height:          64,
            paddingBottom:   10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title:            'Dashboard',
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>⊞</Text>,
          }}
        />
        <Tabs.Screen
  name="sos-placeholder"
  options={{
    title: '',
    tabBarButton: () => (
      <Pressable onPress={() => setSosVisible(true)} style={styles.sosTabBtn}>
        <SOSTabButton onPress={() => setSosVisible(true)} />
      </Pressable>
    ),
  }}
/>

        <Tabs.Screen
          name="settings"
          options={{
            title:            'Settings',
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>⚙</Text>,
          }}
        />
        <Tabs.Screen name="profile"  options={{ href: null }} />
        <Tabs.Screen name="account"  options={{ href: null }} />
        <Tabs.Screen name="saved"    options={{ href: null }} />
        <Tabs.Screen name="history"  options={{ href: null }} />
        <Tabs.Screen name="children" options={{ href: null }} />
      </Tabs>

      <SOSSheet visible={sosVisible} onClose={() => setSosVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  tabLabel:  { fontSize: 10, fontWeight: '700', letterSpacing: 0.06, textTransform: 'uppercase' },
  sosTabBtn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4 },
});

const sheet = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(17,24,32,0.6)' },
  keyboard: { justifyContent: 'flex-end' },
  root: {
    backgroundColor:      colors.night,
    borderTopLeftRadius:  radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal:    spacing.lg,
    paddingTop:           spacing.sm,
    paddingBottom:        spacing.md,
    maxHeight:            '90%',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center', marginBottom: spacing.sm,
  },
  scrollContent: { gap: spacing.md, paddingBottom: spacing.xl },
  header:        { gap: spacing.sm },
  contextPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124,154,135,0.15)',
    borderWidth: 1, borderColor: 'rgba(124,154,135,0.3)',
    borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4,
  },
  contextPillText: { ...type.label, color: colors.sage },
  title: { fontSize: 26, fontWeight: '800', color: colors.textInverse, lineHeight: 32, letterSpacing: -0.3 },
  sub:   { ...type.body, color: 'rgba(255,255,255,0.5)' },
  noChild: {
    backgroundColor: colors.amberLight, borderRadius: radius.medium,
    padding: spacing.md, gap: spacing.xs,
    borderWidth: 1, borderColor: 'rgba(200,136,58,0.25)',
  },
  noChildText: { ...type.bodySmall, color: colors.textSecondary },
  noChildLink: { ...type.bodySmall, color: colors.amberDark, fontWeight: '700' },
  textareaCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.large, overflow: 'hidden',
  },
  textarea:     { padding: spacing.md, fontSize: 16, color: colors.textInverse, lineHeight: 24, minHeight: 100 },
  textareaHint: {
    ...type.caption, color: 'rgba(255,255,255,0.25)',
    fontStyle: 'italic', paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  crisisBanner:      { borderTopWidth: 1, borderTopColor: 'rgba(200,136,58,0.3)', backgroundColor: 'rgba(200,136,58,0.1)' },
  crisisBannerInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, paddingHorizontal: spacing.md },
  crisisIcon:        { fontSize: 16 },
  crisisTitle:       { fontSize: 13, fontWeight: '700', color: colors.amber },
  crisisSub:         { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  intensityWrap:     { gap: spacing.xs },
  intensityLabel:    { ...type.label, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.8 },
  intensityOpt:      { fontSize: 10, fontWeight: '400', color: 'rgba(255,255,255,0.2)', textTransform: 'none' },
  intensityCircles:  { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, paddingVertical: spacing.xs },
  intensityTap:      { alignItems: 'center', justifyContent: 'flex-end', height: 40, flex: 1 },
  intensityCircle:   { borderWidth: 1.5 },
  error:             { ...type.bodySmall, color: colors.dangerDark },
  unsafeBtn:         { alignSelf: 'center', paddingVertical: spacing.xs, minHeight: 40, justifyContent: 'center' },
  unsafeText:        { fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecorationLine: 'underline', textAlign: 'center' },
});


