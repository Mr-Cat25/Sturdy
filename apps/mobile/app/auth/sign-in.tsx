import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router }  from 'expo-router';
import { Button }  from '../../src/components/ui/Button';
import { Screen }  from '../../src/components/ui/Screen';
import { useAuth } from '../../src/context/AuthContext';
import { colors, radius, shadow, spacing, type } from '../../src/theme';

export default function SignInScreen() {
  const { signInWithEmail }              = useAuth();
  const [email,        setEmail]         = useState('');
  const [password,     setPassword]      = useState('');
  const [showPassword, setShowPassword]  = useState(false);
  const [error,        setError]         = useState('');
  const [submitting,   setSubmitting]    = useState(false);

  const handle = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !password) { setError('Enter your email and password.'); return; }
    setError(''); setSubmitting(true);
    try {
      await signInWithEmail(e, password);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <Screen
      footer={
        <Button
          label={submitting ? 'Signing in…' : 'Sign in'}
          onPress={handle}
          loading={submitting}
          disabled={submitting}
        />
      }
    >
<Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/welcome')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Sturdy</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to continue</Text>
      </View>

      <View style={[styles.card, shadow.sm]}>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={v => { setEmail(v); if (error) setError(''); }}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              autoCapitalize="none"
              autoComplete="password"
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={v => { setPassword(v); if (error) setError(''); }}
            />
            <Pressable
              onPress={() => setShowPassword(s => !s)}
              style={styles.eye}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
            </Pressable>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <Pressable
        onPress={() => router.push('/auth/sign-up')}
        style={({ pressed }) => [styles.link, pressed && { opacity: 0.65 }]}
      >
        <Text style={styles.linkText}>Don't have an account? Sign up free</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back:     { alignSelf: 'flex-start', paddingVertical: spacing.xs },
  backText: { ...type.body, fontWeight: '600', color: colors.textSecondary },

  header:  { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  eyebrow: { ...type.label, color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  title:   { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36, textAlign: 'center' },
  sub:     { ...type.body, color: colors.textSecondary, textAlign: 'center' },

  card:  { backgroundColor: colors.surface, borderRadius: radius.large, padding: spacing.lg, gap: spacing.md },
  field: { gap: spacing.xs },
  label: { ...type.label, color: colors.text, textTransform: 'uppercase', letterSpacing: 0.7 },

  input: {
    minHeight:         52,
    borderRadius:      radius.medium,
    borderWidth:       1.5,
    borderColor:       colors.border,
    backgroundColor:   colors.surfaceRaised,
    color:             colors.text,
    fontSize:          16,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
  },
  passwordWrap:  { position: 'relative' },
  passwordInput: { paddingRight: 52 },
  eye:           { position: 'absolute', right: spacing.sm, top: 0, bottom: 0, justifyContent: 'center' },
  eyeText:       { fontSize: 18 },

  error: { ...type.bodySmall, color: colors.dangerDark },

  link:     { alignSelf: 'center', paddingVertical: spacing.xs, minHeight: 44, justifyContent: 'center' },
  linkText: { ...type.body, color: colors.textSecondary, fontWeight: '600', textDecorationLine: 'underline', textAlign: 'center' },
});
