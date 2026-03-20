import { supabase } from './supabase';

export type ConversationRow = {
  id: string;
  user_id: string;
  child_profile_id: string;
  title: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

export async function loadConversations(): Promise<ConversationRow[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("We couldn't load your account right now. Please try again.");
  }

  if (!user) {
    throw new Error('Sign in to view history.');
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('id, user_id, child_profile_id, title, summary, created_at, updated_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error("We couldn't load your history right now. Please try again.");
  }

  return (data ?? []) as ConversationRow[];
}