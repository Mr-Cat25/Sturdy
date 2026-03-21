import type { ParentingScriptRequest, ParentingScriptResponse } from '../types/parentingScript';


const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();


if (!SUPABASE_URL) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL. Add it to your Expo environment configuration.');
}


if (!SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_ANON_KEY. Add it to your Expo environment configuration.'
  );
}


const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;
const PARENTING_SCRIPT_URL = `${supabaseUrl}/functions/v1/chat-parenting-assistant`;

console.log('[STURDY_DEBUG] process.env.EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('[STURDY_DEBUG] Resolved EXPO_PUBLIC_SUPABASE_URL', supabaseUrl);
console.log('[STURDY_DEBUG] Final request URL', PARENTING_SCRIPT_URL);


async function generateParentingScript(
  input: ParentingScriptRequest
): Promise<ParentingScriptResponse> {
  let response: Response;


  console.log('[STURDY_DEBUG] Payload', input);
  console.log('[STURDY_DEBUG] Fetch start');


  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  };


  try {
    response = await fetch(PARENTING_SCRIPT_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });
  } catch (error) {
    console.log('[STURDY_DEBUG] Fetch failed', {
      error:
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'unknown-error',
    });
    throw new Error("We couldn't reach Sturdy right now. Check your connection and try again.");
  }


  console.log('[STURDY_DEBUG] Response status', response.status);


  let data: unknown = null;


  try {
    data = await response.json();
  } catch {
    data = null;
  }


  if (data !== null) {
    console.log('[STURDY_DEBUG] Response body', data);
  } else {
    console.log('[STURDY_DEBUG] Response body', 'unavailable');
  }


  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof data.error === 'string'
        ? data.error
        : "We couldn't get a script right now. Please try again.";


    throw new Error(errorMessage);
  }


  if (!isParentingScriptResponse(data)) {
    throw new Error("We couldn't read that script just now. Please try again.");
  }


  return data;
}


export const api = {
  parenting: {
    generateGuest: generateParentingScript,
  },
} as const;


export async function getParentingScript(
  input: ParentingScriptRequest
): Promise<ParentingScriptResponse> {
  return api.parenting.generateGuest(input);
}


function isParentingScriptResponse(value: unknown): value is ParentingScriptResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }


  const candidate = value as Record<string, unknown>;


  return (
    typeof candidate.situation_summary === 'string' &&
    typeof candidate.regulate === 'string' &&
    typeof candidate.connect === 'string' &&
    typeof candidate.guide === 'string'
  );
}

