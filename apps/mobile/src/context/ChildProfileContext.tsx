import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type ChildProfileDraft = {
  name?: string;
  childAge: number | null;
  neurotype: string[];
};

type ChildProfileContextValue = {
  draft: ChildProfileDraft;
  setDraft: (draft: ChildProfileDraft) => void;
};

const initialDraft: ChildProfileDraft = {
  name: undefined,
  childAge: null,
  neurotype: [],
};

const ChildProfileContext = createContext<ChildProfileContextValue | null>(null);

export function ChildProfileProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ChildProfileDraft>(initialDraft);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
    }),
    [draft],
  );

  return <ChildProfileContext.Provider value={value}>{children}</ChildProfileContext.Provider>;
}

export function useChildProfile() {
  const context = useContext(ChildProfileContext);

  if (!context) {
    throw new Error('useChildProfile must be used within a ChildProfileProvider');
  }

  return context;
}