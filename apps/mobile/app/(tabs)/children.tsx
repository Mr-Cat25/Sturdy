import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/ui/Button';
import { GuestPrompt } from '../../src/components/GuestPrompt';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';

type ChildProfile = {
  id: string;
  name: string | null;
  child_age: number;
};

export default function ChildrenTabScreen() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthLoading || !session) return;

    let isMounted = true;

    async function fetchChildren() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const { data, error } = await supabase
          .from('child_profiles')
          .select('id, name, child_age')
          .eq('user_id', session!.user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (isMounted) setChildren((data as ChildProfile[]) ?? []);
      } catch {
        if (isMounted) setErrorMessage('Could not load children. Please try again.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchChildren();
    return () => { isMounted = false; };
  }, [isAuthLoading, session]);

  if (isAuthLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!session) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <StatusBar style="dark" />
        <GuestPrompt
          title="Your child profiles"
          body="Create an account to add child profiles and get age-tailored scripts every time."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Children</Text>
          <Button
            label="Add Child"
            onPress={() => router.push('/child/new')}
          />
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.stateCard}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {!isLoading && !errorMessage && children.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>No children added yet.</Text>
            <Text style={styles.stateBody}>
              Add a child profile to get age-tailored scripts.
            </Text>
          </View>
        ) : null}

        {!isLoading && children.map((child) => (
          <Pressable
            accessibilityRole="button"
            key={child.id}
            onPress={() => router.push(`/child/${child.id}`)}
            style={({ pressed }) => [styles.childCard, pressed ? styles.childCardPressed : null]}
          >
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name ?? 'Unnamed child'}</Text>
              <View style={styles.agePill}>
                <Text style={styles.agePillText}>Age {child.child_age}</Text>
              </View>
            </View>
            <Text style={styles.childChevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  stateCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
  stateBody: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: '#B45309',
    fontSize: 15,
    lineHeight: 22,
  },
  childCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow,
  },
  childCardPressed: {
    opacity: 0.88,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  childName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  agePill: {
    borderRadius: radius.pill,
    backgroundColor: colors.chipBackground,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  agePillText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  childChevron: {
    color: colors.textSecondary,
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 28,
  },
});

