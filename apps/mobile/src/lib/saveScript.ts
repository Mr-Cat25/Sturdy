import { supabase } from './supabase';

type SaveScriptInput = {
  situation_summary: string;
  regulate: string;
  connect: string;
  guide: string;
  childAge: number | null;
};

type SavedScriptRow = {
  id: string;
  user_id: string;
  situation_summary: string;
  regulate: string;
  connect: string;
  guide: string;
  child_age: number | null;
};

export async function saveScript({
  situation_summary,
  regulate,
  connect,
  guide,
  childAge,
}: SaveScriptInput): Promise<SavedScriptRow> {
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
    .insert({
      user_id: user.id,
      situation_summary,
      regulate,
      connect,
      guide,
      child_age: childAge,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as SavedScriptRow;
}