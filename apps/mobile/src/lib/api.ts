import type { ParentingScriptRequest, ParentingScriptResponse } from '../types/parentingScript';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL. Add it to your Expo environment configuration.');
}

const PARENTING_SCRIPT_URL = `${SUPABASE_URL}/functions/v1/chat-parenting-assistant`;

const PARENTING_SCRIPT_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'dev-local'}`,
} as const;

export async function getParentingScript(
  input: ParentingScriptRequest,
): Promise<ParentingScriptResponse> {
  let response: Response;

  console.log('[STURDY_DEBUG] Request URL', PARENTING_SCRIPT_URL);
  console.log('[STURDY_DEBUG] Payload', input);
  console.log('[STURDY_DEBUG] Fetch start');

  try {
    response = await fetch(PARENTING_SCRIPT_URL, {
      method: 'POST',
      headers: PARENTING_SCRIPT_HEADERS,
      body: JSON.stringify(input),
    });
  } catch (error) {
    console.log('[STURDY_DEBUG] Fetch failed', {
      error:
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'unknown-error',
    });
    throw new Error('network-error');
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
        : 'request-failed';

    throw new Error(errorMessage);
  }

  if (!isParentingScriptResponse(data)) {
    throw new Error('invalid-response');
  }

  return data;
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