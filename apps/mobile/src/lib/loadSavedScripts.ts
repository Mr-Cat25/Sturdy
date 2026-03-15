import { supabase } from './supabase';

export type SavedScriptRow = {
  id: string;
  user_id: string;
  situation_summary: string;
  regulate: string;
  connect: string;
  guide: string;
  child_age: number | null;
  created_at: string;
};

export async function loadSavedScripts(): Promise<SavedScriptRow[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('No signed-in user');
  }

  const { data, error } = await supabase
    .from('saved_scripts')
    .select('id, user_id, situation_summary, regulate, connect, guide, child_age, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as SavedScriptRow[];
}