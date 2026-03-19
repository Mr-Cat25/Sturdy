import { useEffect } from 'react';
import { router } from 'expo-router';

export default function CreateAccountRedirect() {
  useEffect(() => {
    router.replace('/auth/sign-up');
  }, []);
  return null;
}
