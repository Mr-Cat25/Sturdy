// apps/mobile/src/lib/api.ts
// Maps expanded response (parent_action objects + avoid array)
// to flat router params for result screen

import type { ParentingScriptRequest, ParentingScriptResponse } from '../types/parentingScript';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
if (!SUPABASE_URL) throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL.');

const PARENTING_SCRIPT_URL = `${SUPABASE_URL}/functions/v1/chat-parenting-assistant`;

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization:  `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'dev-local'}`,
} as const;

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

export async function getParentingScript(
  input: ParentingScriptRequest,
): Promise<ParentingScriptResponse> {
  let response: Response;
  try {
    response = await fetch(PARENTING_SCRIPT_URL, {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify(input),
    });
  } catch { throw new Error('network-error'); }

  let data: unknown = null;
  try { data = await response.json(); } catch { data = null; }

  if (!response.ok) {
    const msg = typeof data === 'object' && data !== null && 'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error : 'request-failed';
    throw new Error(msg);
  }

  // Crisis
  if (typeof data === 'object' && data !== null && 'response_type' in data &&
    (data as { response_type: unknown }).response_type === 'crisis'
  ) {
    const c = data as { crisis_type?: string; risk_level?: string };
    throw new CrisisDetectedError(c.crisis_type ?? 'unknown', c.risk_level ?? 'ELEVATED_RISK');
  }

  if (!isValidResponse(data)) throw new Error('invalid-response');
  return data;
}

function isValidStep(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return typeof s.parent_action === 'string' && typeof s.script === 'string';
}

function isValidResponse(v: unknown): v is ParentingScriptResponse {
  if (!v || typeof v !== 'object') return false;
  const c = v as Record<string, unknown>;
  return (
    typeof c.situation_summary === 'string' &&
    isValidStep(c.regulate) &&
    isValidStep(c.connect)  &&
    isValidStep(c.guide)    &&
    Array.isArray(c.avoid)
  );
}


