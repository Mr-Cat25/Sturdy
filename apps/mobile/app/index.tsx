import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { colors } from '../src/components/ui/theme';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';

function hasStoredChildContext(value: string | null) {
  if (!value) {
    return false;
  }

  try {
    const parsed = JSON.parse(value) as { name?: string; childAge?: number };
    return typeof parsed.name === 'string' && parsed.name.trim().length > 0 && typeof parsed.childAge === 'number';
  } catch {
    return false;
  }
}

export default function RootIndexRoute() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    let isMounted = true;

    async function resolveRoute() {
      let hasGuestChildContext = false;

      try {
        const [welcomeDone, storedChild] = await Promise.all([
          AsyncStorage.getItem('sturdy_welcome_done'),
          AsyncStorage.getItem('sturdy_guest_child'),
        ]);

        hasGuestChildContext = hasStoredChildContext(storedChild);

        if (!session) {
          router.replace(welcomeDone === 'true'
            ? hasGuestChildContext
              ? '/(tabs)'
              : '/child-setup'
            : '/welcome');
          return;
        }

        const { data, error } = await supabase
          .from('child_profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .limit(1);

        if (error) {
          throw error;
        }

        const hasBackendChildProfile = Array.isArray(data) && data.length > 0;

        router.replace(hasBackendChildProfile || hasGuestChildContext ? '/(tabs)' : '/child-setup');
      } catch {
        if (isMounted) {
          router.replace(hasGuestChildContext ? '/(tabs)' : '/child-setup');
        }
      }
    }

    resolveRoute();

    return () => {
      isMounted = false;
    };
  }, [isLoading, session]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
