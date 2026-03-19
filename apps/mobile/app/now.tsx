import { useEffect } from 'react';
import { router } from 'expo-router';

export default function NowScreenRedirect() {
  useEffect(() => {
    router.replace('/(tabs)');
  }, []);
  return null;
}