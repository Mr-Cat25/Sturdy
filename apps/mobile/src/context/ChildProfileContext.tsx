// apps/mobile/src/context/ChildProfileContext.tsx
// Phase B update — loads neurotype from Supabase child_profiles table.
// neurotype is exposed on activeChild so SOS input and API can use it.
// Free users: neurotype is always null (never set in UI).
// Premium users: neurotype is set from Profile screen.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const GUEST_CHILD_KEY = 'sturdy_guest_child';

export type ChildProfile = {
  id?:       string;
  name:      string;
  childAge:  number;
  neurotype: string | null;  // null = not set or free user
};

type ChildProfileContextValue = {
  activeChild:    ChildProfile | null;
  isLoadingChild: boolean;
  setActiveChild: (profile: ChildProfile | null) => void;
  reloadChild:    () => Promise<void>;
};

const ChildProfileContext = createContext<ChildProfileContextValue | null>(null);

export function ChildProfileProvider({ children }: { children: ReactNode }) {
  const [activeChild,    setActiveChildState] = useState<ChildProfile | null>(null);
  const [isLoadingChild, setIsLoadingChild]   = useState(true);

  const loadChild = useCallback(async () => {
    setIsLoadingChild(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (session?.user) {
        // Load first child — includes neurotype array
        const { data, error } = await supabase
          .from('child_profiles')
          .select('id, name, child_age, neurotype')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        if (!error && data) {
          // neurotype is text[] in DB — take first element if set
          const neurotypes = Array.isArray(data.neurotype) ? data.neurotype : [];
          const neurotype  = neurotypes.length > 0 ? neurotypes[0] : null;

          setActiveChildState({
            id:        data.id,
            name:      data.name ?? '',
            childAge:  data.child_age,
            neurotype,
          });
          return;
        }
      }

      // Guest — AsyncStorage, no neurotype support
      const stored = await AsyncStorage.getItem(GUEST_CHILD_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { name: string; childAge: number };
        if (parsed.name && parsed.childAge) {
          setActiveChildState({
            name:      parsed.name,
            childAge:  parsed.childAge,
            neurotype: null,
          });
          return;
        }
      }

      setActiveChildState(null);
    } catch {
      setActiveChildState(null);
    } finally {
      setIsLoadingChild(false);
    }
  }, []);

  useEffect(() => { loadChild(); }, [loadChild]);

  const setActiveChild = useCallback((profile: ChildProfile | null) => {
    setActiveChildState(profile);
  }, []);

  const reloadChild = useCallback(async () => {
    await loadChild();
  }, [loadChild]);

  const value = useMemo<ChildProfileContextValue>(
    () => ({ activeChild, isLoadingChild, setActiveChild, reloadChild }),
    [activeChild, isLoadingChild, setActiveChild, reloadChild],
  );

  return (
    <ChildProfileContext.Provider value={value}>
      {children}
    </ChildProfileContext.Provider>
  );
}

export function useChildProfile() {
  const ctx = useContext(ChildProfileContext);
  if (!ctx) throw new Error('useChildProfile must be used within ChildProfileProvider');
  return ctx;
}
