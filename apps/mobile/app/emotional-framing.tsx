import { useEffect } from 'react';
import { router } from 'expo-router';

export default function EmotionalFramingRedirect() {
  useEffect(() => {
    router.replace('/welcome');
  }, []);
  return null;
}
