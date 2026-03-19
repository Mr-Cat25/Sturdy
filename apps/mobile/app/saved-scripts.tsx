import { useEffect } from 'react';
import { router } from 'expo-router';

export default function SavedScriptsRedirect() {
  useEffect(() => {
    router.replace('/(tabs)/saved');
  }, []);
  return null;
}
