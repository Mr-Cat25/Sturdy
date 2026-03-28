// app/(tabs)/settings.tsx
// Full settings screen — structure-first with placeholders for future features

import { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { router }       from 'expo-router';
import { StatusBar }    from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button }       from '../../src/components/ui/Button';
import { useAuth }      from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';
import { colors, radius, shadow, spacing, type } from '../../src/theme';

// ── Section header
function SectionHeader({ label }: { label: string }) {
  return (
    <View style={sh.wrap}>
      <Text style={sh.label}>{label}</Text>
      <View style={sh.line} />
    </View>
  );
}
const sh = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  label: { ...type.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, flexShrink: 0 },
  line:  { flex: 1, height: 1, backgroundColor: colors.borderSoft },
});

// ── Menu row
function MenuRow({
  label,
  sub,
  onPress,
  destructive = false,
  comingSoon  = false,
  right,
}: {
  label:       string;
  sub?:        string;
  onPress?:    () => void;
  destructive?: boolean;
  comingSoon?:  boolean;
  right?:       React.ReactNode;
}) {
  return (
    <Pressable
      onPress={comingSoon ? undefined : onPress}
      style={({ pressed }) => [
        mr.row,
        pressed && onPress && !comingSoon && { opacity: 0.65 },
        comingSoon && { opacity: 0.45 },
      ]}
    >
      <View style={mr.left}>
        <Text style={[mr.label, destructive && { color: colors.dangerDark }]}>
          {label}
        </Text>
        {sub ? <Text style={mr.sub}>{sub}</Text> : null}
      </View>
      {right ?? (
        comingSoon
          ? <View style={mr.comingSoon}><Text style={mr.comingSoonText}>Soon</Text></View>
          : <Text style={mr.arrow}>→</Text>
      )}
    </Pressable>
  );
}
const mr = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, gap: spacing.sm },
  left: { flex: 1, gap: 2 },
  label:{ ...type.body, color: colors.text, fontWeight: '500' },
  sub:  { ...type.caption, color: colors.textMuted },
  arrow:{ ...type.body, color: colors.textMuted },
  comingSoon: {
    backgroundColor: colors.backgroundSoft, borderRadius: radius.pill,
    paddingHorizontal: spacing.xs, paddingVertical: 2,
    borderWidth: 1, borderColor: colors.borderSoft,
  },
  comingSoonText: { fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.4 },
});

// ── Divider inside card
function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.borderSoft }} />;
}

// ── Card wrapper
function SettingsCard({ children }: { children: React.ReactNode }) {
  return <View style={[card.wrap, shadow.sm]}>{children}</View>;
}
const card = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    paddingHorizontal: spacing.lg,
    overflow:        'hidden',
    borderWidth:     1,
    borderColor:     colors.borderSoft,
  },
});

// ─────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────

export default function SettingsScreen() {
  const { session, signOut, isLoading } = useAuth();
  const { activeChild }                 = useChildProfile();

  const [signingOut,        setSigningOut]        = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [notificationsOn,   setNotificationsOn]   = useState(false);
  const [researchConsent,   setResearchConsent]   = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/welcome');
    } catch { /* non-fatal */ }
    finally { setSigningOut(false); }
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    // TODO: implement account deletion API call
  };

  const handleEmail = (subject: string) => {
    Linking.openURL(
      `mailto:support@sturdy.app?subject=${encodeURIComponent(subject)}`
    );
  };

  if (isLoading) return <View style={styles.root} />;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Settings</Text>

        {/* ══════════════════════════════
            ACCOUNT
        ══════════════════════════════ */}
        <SectionHeader label="Account" />

        {session ? (
          <SettingsCard>
            <MenuRow
              label="Email"
              sub={session.user.email}
              onPress={undefined}
              right={<View />}
            />
            <Divider />
            <MenuRow
              label="Change password"
              sub="Update your Sturdy password"
              onPress={() => router.push('/auth/sign-in')}
            />
            <Divider />
            <MenuRow
              label="Delete account"
              sub="Permanently remove your data"
              destructive
              onPress={() => setDeleteModalVisible(true)}
            />
          </SettingsCard>
        ) : (
          <SettingsCard>
            <View style={styles.guestSection}>
              <Text style={styles.guestText}>
                Sign in to access your account settings, saved scripts, and history.
              </Text>
              <Button label="Sign in" size="md" onPress={() => router.push('/auth/sign-in')} />
              <Button label="Create account" size="md" variant="ghost" onPress={() => router.push('/auth/sign-up')} />
            </View>
          </SettingsCard>
        )}

        {/* ══════════════════════════════
            SUBSCRIPTION
        ══════════════════════════════ */}
        <SectionHeader label="Subscription" />

        <SettingsCard>
          <MenuRow
            label="Current plan"
            sub="Free · 5 scripts included"
            right={
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>
            }
          />
          <Divider />
          <MenuRow
            label="Unlock unlimited access"
            sub="$7 / month · Cancel anytime"
            onPress={() => { /* navigate to upgrade */ }}
          />
          <Divider />
          <MenuRow
            label="Restore purchase"
            sub="Already subscribed? Tap to restore"
            onPress={() => { /* restore purchase */ }}
          />
        </SettingsCard>

        {/* ══════════════════════════════
            YOUR CHILDREN
        ══════════════════════════════ */}
        <SectionHeader label="Your children" />

        <SettingsCard>
          {activeChild ? (
            <>
              <MenuRow
                label={`${activeChild.name} · Age ${activeChild.childAge}`}
                sub="Active child profile"
                onPress={() => router.push(`/child/${activeChild.id}`)}
              />
              <Divider />
            </>
          ) : null}
          <MenuRow
            label="Add a child"
            sub="Each child gets their own age-matched scripts"
            onPress={() => router.push(session ? '/child/new' : '/child-setup')}
          />
        </SettingsCard>

        {/* ══════════════════════════════
            GENERAL
        ══════════════════════════════ */}
        <SectionHeader label="General" />

        <SettingsCard>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Text style={mr.label}>Push notifications</Text>
              <Text style={mr.sub}>Gentle check-ins after hard moments</Text>
            </View>
            <Switch
              value={notificationsOn}
              onValueChange={setNotificationsOn}
              trackColor={{ false: colors.border, true: colors.sage }}
              thumbColor={colors.surfaceRaised}
            />
          </View>
          <Divider />
          <MenuRow
            label="Language"
            sub="English (more coming soon)"
            comingSoon
          />
          <Divider />
          <MenuRow
            label="Clear cached data"
            sub="Remove locally stored data"
            onPress={() => Alert.alert('Clear cache', 'This will clear locally stored data. Your saved scripts and account data are safe.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => { /* clear cache */ } },
            ])}
          />
        </SettingsCard>

        {/* ══════════════════════════════
            PRIVACY
        ══════════════════════════════ */}
        <SectionHeader label="Privacy" />

        <SettingsCard>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Text style={mr.label}>Contribute to research</Text>
              <Text style={mr.sub}>
                Share anonymised usage patterns to help improve parenting support. Your data is never identified.
              </Text>
            </View>
            <Switch
              value={researchConsent}
              onValueChange={setResearchConsent}
              trackColor={{ false: colors.border, true: colors.sage }}
              thumbColor={colors.surfaceRaised}
            />
          </View>
          <Divider />
          <MenuRow
            label="Download my data"
            sub="Request a copy of your data"
            comingSoon
          />
          <Divider />
          <MenuRow
            label="Privacy Policy"
            onPress={() => router.push('/legal/privacy-policy')}
          />
        </SettingsCard>

        {/* ══════════════════════════════
            SUPPORT
        ══════════════════════════════ */}
        <SectionHeader label="Support" />

        <SettingsCard>
          <MenuRow
            label="Send feedback"
            sub="Tell us what's working or what could be better"
            onPress={() => handleEmail('Sturdy Feedback')}
          />
          <Divider />
          <MenuRow
            label="Report a problem"
            sub="Something not working? Let us know"
            onPress={() => handleEmail('Sturdy Problem Report')}
          />
          <Divider />
          <MenuRow
            label="FAQ"
            sub="Common questions answered"
            comingSoon
          />
          <Divider />
          <MenuRow
            label="Contact us"
            sub="support@sturdy.app"
            onPress={() => handleEmail('Sturdy Support')}
          />
        </SettingsCard>

        {/* ══════════════════════════════
            LEGAL
        ══════════════════════════════ */}
        <SectionHeader label="Legal" />

        <SettingsCard>
          {[
            { label: 'Terms of Service',  path: '/legal/terms-of-service' },
            { label: 'Privacy Policy',    path: '/legal/privacy-policy'   },
            { label: 'Medical Safety',    path: '/legal/medical-safety'   },
            { label: 'AI Limitations',    path: '/legal/ai-limitations'   },
          ].map(({ label, path }, i, arr) => (
            <View key={path}>
              <MenuRow
                label={label}
                onPress={() => router.push(path as any)}
              />
              {i < arr.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </SettingsCard>

        {/* ══════════════════════════════
            ABOUT
        ══════════════════════════════ */}
        <SectionHeader label="About" />

        <SettingsCard>
          <MenuRow
            label="What is Sturdy?"
            sub="An AI parenting support tool — not medical advice"
            right={<View />}
          />
          <Divider />
          <MenuRow
            label="Rate Sturdy"
            sub="Enjoying the app? Leave a review"
            comingSoon
          />
          <Divider />
          <MenuRow
            label="Version"
            sub="1.0.0"
            right={<Text style={styles.versionText}>1.0.0</Text>}
          />
        </SettingsCard>

        {/* ══════════════════════════════
            LOG OUT
        ══════════════════════════════ */}
        {session ? (
          <>
            <SectionHeader label="" />
            <Button
              label={signingOut ? 'Signing out…' : 'Log out'}
              variant="ghost"
              loading={signingOut}
              disabled={signingOut}
              onPress={handleSignOut}
            />
          </>
        ) : null}

        <Text style={styles.footer}>
          Sturdy · AI parenting support{'\n'}Not a substitute for professional advice
        </Text>

      </ScrollView>

      {/* ── Delete account confirmation modal ── */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, shadow.lg]}>
            <Text style={styles.modalTitle}>Delete account?</Text>
            <Text style={styles.modalBody}>
              This will permanently delete your account, all child profiles, saved scripts, and history.
              {'\n\n'}This cannot be undone.
            </Text>
            <Button
              label="Yes, delete my account"
              variant="danger"
              onPress={handleDeleteAccount}
            />
            <Button
              label="Cancel"
              variant="ghost"
              size="md"
              onPress={() => setDeleteModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xxl,
    gap:               spacing.md,
  },

  title: { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36 },

  guestSection: { paddingVertical: spacing.md, gap: spacing.md },
  guestText:    { ...type.bodySmall, color: colors.textSecondary, lineHeight: 20 },

  freeBadge: {
    backgroundColor:   colors.sageLight,
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical:   3,
    borderWidth:       1,
    borderColor:       'rgba(124,154,135,0.3)',
  },
  freeBadgeText: { fontSize: 9, fontWeight: '800', color: colors.sage, letterSpacing: 0.5 },

  switchRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            spacing.md,
    minHeight:      52,
    paddingVertical: spacing.xs,
  },
  switchLeft: { flex: 1, gap: 2 },

  versionText: { ...type.caption, color: colors.textMuted },

  footer: {
    ...type.caption,
    color:     colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(26,24,20,0.5)',
    justifyContent:  'center',
    padding:         spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.xl,
    padding:         spacing.xl,
    gap:             spacing.md,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  modalBody:  { ...type.body, color: colors.textSecondary, lineHeight: 26 },
});


