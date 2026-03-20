import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '../src/components/ui/Screen';
import { useAuth } from '../src/context/AuthContext';
import { getWelcomeDone } from '../src/lib/mobileStorage';

export default function LaunchGateScreen() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const resolveRoute = async () => {
      if (isLoading) {
        return;
      }

      if (session) {
        if (isMounted) {
          router.replace('/(tabs)');
        }

        return;
      }

      const welcomeDone = await getWelcomeDone();

      if (isMounted) {
        router.replace(welcomeDone ? '/(tabs)' : '/welcome');
      }
    };

    resolveRoute();

    return () => {
      isMounted = false;
    };
  }, [isLoading, session]);

  return (
    <Screen scrollable={false}>
      <View />
    </Screen>
  );
}
