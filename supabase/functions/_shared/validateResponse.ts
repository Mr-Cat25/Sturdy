// supabase/functions/_shared/validateResponse.ts
// Validates the expanded schema:
// regulate/connect/guide are now objects with parent_action + script
// avoid is a string array

type ScriptStep = {
  parent_action: string;
  script:        string;
};

function isValidStep(value: unknown): value is ScriptStep {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.parent_action === 'string' && v.parent_action.trim().length > 0 &&
    typeof v.script        === 'string' && v.script.trim().length > 0
  );
}

function isValidAvoid(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  return value.every(item => typeof item === 'string' && item.trim().length > 0);
}

export type SturdyResponse = {
  situation_summary: string;
  regulate:          ScriptStep;
  connect:           ScriptStep;
  guide:             ScriptStep;
  avoid:             string[];
};

export function validateResponse(value: unknown): value is SturdyResponse {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.situation_summary === 'string' && c.situation_summary.trim().length > 0 &&
    isValidStep(c.regulate) &&
    isValidStep(c.connect)  &&
    isValidStep(c.guide)    &&
    isValidAvoid(c.avoid)
  );
}


