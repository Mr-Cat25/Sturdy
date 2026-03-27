import { useState } from 'react';
import {
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
import { colors, radius, shadow, spacing, type } from '../../src/theme';

export default function AccountScreen() {
  const { session, isLoading, signOut } = useAuth();
  const [error,      setError]      = useState('');
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setError('');
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/welcome');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Sign out failed. Please try again.',
      );
    } finally {
      setSigningOut(false);
    }
  };

  if (isLoading) return <View style={styles.root} />;

  // Guest state
  if (!session) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.sub}>
            Sign in or create an account to save scripts and unlock the full app.
          </Text>
          <View style={[styles.card, shadow.sm]}>
            <Button
              label="Sign in"
              onPress={() => router.push('/auth/sign-in')}
            />
            <Button
              label="Create account"
              variant="ghost"
              onPress={() => router.push('/auth/sign-up')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.sub}>Settings, plan, and legal.</Text>

        {/* Email */}
        <View style={[styles.card, shadow.sm]}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.emailText}>{session.user.email}</Text>
        </View>

        {/* Plan */}
        <View style={[styles.card, shadow.sm]}>
          <Text style={styles.label}>Plan</Text>
          <Text style={styles.cardTitle}>Free support</Text>
          <Text style={styles.cardBody}>
            5 scripts included. Upgrade for unlimited access.
          </Text>
          <Button
            label="Upgrade to unlimited"
            variant="amber"
            size="md"
            onPress={() => { /* navigate to upgrade */ }}
          />
        </View>

        {/* Legal */}
        <View style={[styles.card, shadow.sm]}>
          <Text style={styles.label}>Legal</Text>
          {[
            { label: 'Terms of Service', path: '/legal/terms-of-service' },
            { label: 'Privacy Policy',   path: '/legal/privacy-policy'   },
            { label: 'Medical Safety',   path: '/legal/medical-safety'   },
            { label: 'AI Limitations',   path: '/legal/ai-limitations'   },
          ].map(({ label, path }) => (
            <Pressable
              key={path}
              onPress={() => router.push(path as any)}
              style={({ pressed }) => [
                styles.legalRow,
                pressed && { opacity: 0.65 },
              ]}
            >
              <Text style={styles.legalText}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Sign out */}
        <View style={[styles.card, shadow.sm]}>
          <Text style={styles.label}>Session</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            label={signingOut ? 'Signing out…' : 'Sign out'}
            variant="ghost"
            loading={signingOut}
            disabled={signingOut}
            onPress={handleSignOut}
          />
        </View>

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

  card:      { backgroundColor: colors.surface, borderRadius: radius.large, padding: spacing.lg, gap: spacing.md },
  label:     { ...type.label, color: colors.textMuted, textTransform: 'uppercase' },
  emailText: { fontSize: 17, fontWeight: '600', color: colors.text },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  cardBody:  { ...type.bodySmall, color: colors.textSecondary },

  legalRow:  { minHeight: 44, justifyContent: 'center' },
  legalText: { ...type.body, color: colors.primary, fontWeight: '600' },

  errorText: { ...type.bodySmall, color: colors.dangerDark },
});
