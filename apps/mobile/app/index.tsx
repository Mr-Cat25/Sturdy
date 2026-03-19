import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { colors } from '../src/components/ui/theme';
import { useAuth } from '../src/context/AuthContext';

export default function LaunchGate() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    async function route() {
      if (session) {
        router.replace('/(tabs)');
        return;
      }

      try {
        const welcomeDone = await AsyncStorage.getItem('sturdy_welcome_done');
        if (welcomeDone === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/welcome');
        }
      } catch {
        router.replace('/welcome');
      }
    }

    route();
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
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
