import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router }   from 'expo-router';
import { useAuth }  from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';
import { colors }   from '../src/theme';

export default function RootIndex() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    let mounted = true;

    async function route() {
      try {
        const [welcomeDone, guestChild] = await Promise.all([
          AsyncStorage.getItem('sturdy_welcome_done'),
          AsyncStorage.getItem('sturdy_guest_child'),
        ]);

        const hasGuest = (() => {
          if (!guestChild) return false;
          try {
            const p = JSON.parse(guestChild) as { name?: string; childAge?: number };
            return (
              typeof p.name === 'string' &&
              p.name.trim().length > 0 &&
              typeof p.childAge === 'number'
            );
          } catch { return false; }
        })();

        if (!session) {
          if (!mounted) return;
          router.replace(
            welcomeDone === 'true'
              ? hasGuest ? '/(tabs)' : '/child-setup'
              : '/welcome',
          );
          return;
        }

        const { data } = await supabase
          .from('child_profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .limit(1);

        if (!mounted) return;
        const hasChild = Array.isArray(data) && data.length > 0;
        router.replace(hasChild || hasGuest ? '/(tabs)' : '/child-setup');
      } catch {
        if (mounted) router.replace('/child-setup');
      }
    }

    route();
    return () => { mounted = false; };
  }, [isLoading, session]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.amber} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: colors.background,
  },
});
