import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<{ session: Session | null }>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeAuthError(message: string) {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'That email or password did not match. Try again.';
  }

  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Check your inbox for the confirmation email, then sign in.';
  }

  if (message.toLowerCase().includes('user already registered')) {
    return 'That email already has an account. Try signing in instead.';
  }

  if (message.toLowerCase().includes('invalid email')) {
    return 'Enter a valid email address.';
  }

  if (message.toLowerCase().includes('password should be at least')) {
    return 'Use at least 6 characters.';
  }

  return "We couldn't complete that just now. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        if (isMounted) {
          setSession(data.session);
        }
      })
      .catch((error) => {
        console.warn('Unable to restore auth session.', error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      signUpWithEmail: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw new Error(normalizeAuthError(error.message));
        }

        return { session: data.session };
      },
      signInWithEmail: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(normalizeAuthError(error.message));
        }
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw new Error(normalizeAuthError(error.message));
        }
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}