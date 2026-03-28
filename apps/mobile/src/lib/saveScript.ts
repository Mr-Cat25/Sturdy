// apps/mobile/src/lib/saveScript.ts
// Updated for expanded schema — regulate/connect/guide are now ScriptStep objects
// Stored as JSONB in Supabase

import { supabase } from './supabase';
import type { ScriptStep } from '../types/parentingScript';

type SaveScriptInput = {
  situation_summary: string;
  regulate:          ScriptStep;
  connect:           ScriptStep;
  guide:             ScriptStep;
  avoid:             string[];
  childAge:          number | null;
};

export async function saveScript({
  situation_summary,
  regulate,
  connect,
  guide,
  avoid,
  childAge,
}: SaveScriptInput): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('No signed-in user');

  const { error } = await supabase
    .from('saved_scripts')
    .insert({
      user_id:           user.id,
      situation_summary,
      // Store as JSON strings so they work with existing text columns
      // or as JSONB if the table supports it
      regulate:          JSON.stringify(regulate),
      connect:           JSON.stringify(connect),
      guide:             JSON.stringify(guide),
      avoid:             JSON.stringify(avoid),
      child_age:         childAge,
    });

  if (error) throw error;
}

