import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ChildSetupRedirect() {
  useEffect(() => {
    router.replace('/welcome');
  }, []);
  return null;
}
