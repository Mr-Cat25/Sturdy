import { supabase } from './supabase';

export type ChildProfileRow = {
  id: string;
  user_id: string;
  name: string | null;
  child_age: number;
  created_at: string;
  updated_at: string;
};

export type ChildProfileInput = {
  name: string;
  childAge: number;
};

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("We couldn't load your account right now. Please try again.");
  }

  if (!user) {
    throw new Error('Sign in to manage child profiles.');
  }

  return user;
}

export async function loadChildProfiles() {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('child_profiles')
    .select('id, user_id, name, child_age, created_at, updated_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error("We couldn't load child profiles right now. Please try again.");
  }

  return (data ?? []) as ChildProfileRow[];
}

export async function getChildProfileById(id: string) {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('child_profiles')
    .select('id, user_id, name, child_age, created_at, updated_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error("We couldn't load that child profile right now. Please try again.");
  }

  return data as ChildProfileRow | null;
}

export async function createChildProfile(input: ChildProfileInput) {
  const user = await getCurrentUser();

  const { count, error: countError } = await supabase
    .from('child_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (countError) {
    throw new Error("We couldn't check your child limit right now. Please try again.");
  }

  if ((count ?? 0) >= 1) {
    throw new Error('Free plans include one child profile. Remove one or upgrade to add more.');
  }

  const { data, error } = await supabase
    .from('child_profiles')
    .insert({
      user_id: user.id,
      name: input.name.trim() || null,
      child_age: input.childAge,
    })
    .select('id, user_id, name, child_age, created_at, updated_at')
    .single();

  if (error) {
    throw new Error("We couldn't save that child profile right now. Please try again.");
  }

  return data as ChildProfileRow;
}

export async function updateChildProfile(id: string, input: ChildProfileInput) {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('child_profiles')
    .update({
      name: input.name.trim() || null,
      child_age: input.childAge,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, user_id, name, child_age, created_at, updated_at')
    .single();

  if (error) {
    throw new Error("We couldn't update that child profile right now. Please try again.");
  }

  return data as ChildProfileRow;
}

export async function deleteChildProfile(id: string) {
  const user = await getCurrentUser();

  const { error } = await supabase.from('child_profiles').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    throw new Error("We couldn't delete that child profile right now. Please try again.");
  }
}