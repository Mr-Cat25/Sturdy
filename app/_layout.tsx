import { useEffect } from 'react';
import { router } from 'expo-router';

export default function RootLayout() {
  useEffect(() => {
    router.replace('/');
  }, []);
  return null;
}
