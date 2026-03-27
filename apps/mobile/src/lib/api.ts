// apps/mobile/src/lib/api.ts
// Updated for Phase A — handles crisis response_type from Edge Function

import type { ParentingScriptRequest, ParentingScriptResponse } from '../types/parentingScript';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL. Add it to your Expo environment configuration.');
}

const PARENTING_SCRIPT_URL = `${SUPABASE_URL}/functions/v1/chat-parenting-assistant`;

const PARENTING_SCRIPT_HEADERS = {
  'Content-Type': 'application/json',
  Authorization:  `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'dev-local'}`,
} as const;

// ─────────────────────────────────────────────
// Crisis error — thrown when safety filter
// triggers. Carries crisis type for routing.
// ─────────────────────────────────────────────

export class CrisisDetectedError extends Error {
  readonly crisisType: string;
  readonly riskLevel:  string;

  constructor(crisisType: string, riskLevel: string) {
    super('crisis-detected');
    this.name       = 'CrisisDetectedError';
    this.crisisType = crisisType;
    this.riskLevel  = riskLevel;
  }
}

// ─────────────────────────────────────────────
// Extended request — includes user context
// for safety event logging
// ─────────────────────────────────────────────

type ExtendedRequest = ParentingScriptRequest & {
  userId?:         string;
  childProfileId?: string;
};

// ─────────────────────────────────────────────
// Main API call
// ─────────────────────────────────────────────

export async function getParentingScript(
  input: ExtendedRequest,
): Promise<ParentingScriptResponse> {
  let response: Response;

  console.log('[STURDY_DEBUG] Request URL', PARENTING_SCRIPT_URL);
  console.log('[STURDY_DEBUG] Payload', { ...input, message: input.message.slice(0, 50) + '…' });

  try {
    response = await fetch(PARENTING_SCRIPT_URL, {
      method:  'POST',
      headers: PARENTING_SCRIPT_HEADERS,
      body:    JSON.stringify(input),
    });
  } catch (error) {
    console.log('[STURDY_DEBUG] Fetch failed', {
      error: error instanceof Error ? error.message : 'unknown-error',
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

  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : 'request-failed';
    throw new Error(errorMessage);
  }

  // ─────────────────────────────────────────
  // Check for crisis response
  // Safety filter triggered — throw CrisisDetectedError
  // so the calling screen can route to /crisis
  // ─────────────────────────────────────────

  if (
    typeof data === 'object' &&
    data !== null &&
    'response_type' in data &&
    (data as { response_type: unknown }).response_type === 'crisis'
  ) {
    const crisis = data as {
      crisis_type?: string;
      risk_level?:  string;
    };

    throw new CrisisDetectedError(
      crisis.crisis_type ?? 'unknown',
      crisis.risk_level  ?? 'ELEVATED_RISK',
    );
  }

  // ─────────────────────────────────────────
  // Normal response — validate shape
  // ─────────────────────────────────────────

  if (!isParentingScriptResponse(data)) {
    throw new Error('invalid-response');
  }

  return data;
}

function isParentingScriptResponse(value: unknown): value is ParentingScriptResponse {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.situation_summary === 'string' &&
    typeof c.regulate          === 'string' &&
    typeof c.connect           === 'string' &&
    typeof c.guide             === 'string'
  );
}
