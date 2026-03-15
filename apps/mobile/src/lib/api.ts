import type { ParentingScriptRequest, ParentingScriptResponse } from '../types/parentingScript';

const PARENTING_SCRIPT_URL =
  'https://shiny-xylophone-69665w5wgr6x3r55p-54321.app.github.dev/functions/v1/chat-parenting-assistant';

const PARENTING_SCRIPT_AUTHORIZATION = 'Bearer dev-local';

export async function getParentingScript(
  input: ParentingScriptRequest,
): Promise<ParentingScriptResponse> {
  let response: Response;

  try {
    response = await fetch(PARENTING_SCRIPT_URL, {
      method: 'POST',
      headers: {
        Authorization: PARENTING_SCRIPT_AUTHORIZATION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error('network-error');
  }

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