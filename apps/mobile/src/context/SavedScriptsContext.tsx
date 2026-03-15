import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { SavedScript, SavedScriptInput } from '../types/parentingScript';

type SavedScriptsContextValue = {
  savedScripts: SavedScript[];
  saveScript: (input: SavedScriptInput) => SavedScript;
};

const SavedScriptsContext = createContext<SavedScriptsContextValue | null>(null);

function createSavedScript(input: SavedScriptInput): SavedScript {
  return {
    ...input,
    id: `script-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
}

export function SavedScriptsProvider({ children }: { children: ReactNode }) {
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>([]);

  const value = useMemo(
    () => ({
      savedScripts,
      saveScript: (input: SavedScriptInput) => {
        const savedScript = createSavedScript(input);

        setSavedScripts((current) => [savedScript, ...current]);

        return savedScript;
      },
    }),
    [savedScripts],
  );

  return <SavedScriptsContext.Provider value={value}>{children}</SavedScriptsContext.Provider>;
}

export function useSavedScripts() {
  const context = useContext(SavedScriptsContext);

  if (!context) {
    throw new Error('useSavedScripts must be used within a SavedScriptsProvider');
  }

  return context;
}