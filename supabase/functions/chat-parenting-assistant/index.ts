declare const Deno: {
  env: { get(name: string): string | undefined; };
};

// @ts-ignore Remote Deno module import is resolved by the Supabase Edge runtime.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import { buildPrompt }      from "../_shared/buildPrompt.ts";
import { validateResponse } from "../_shared/validateResponse.ts";
import { runSafetyFilter }  from "../_shared/safetyFilter.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_MODEL   = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";
const SUPABASE_URL   = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

type RequestBody = {
  childName?:      unknown;
  childAge?:       unknown;
  message?:        unknown;
  userId?:         unknown;
  childProfileId?: unknown;
  intensity?:      unknown;
};

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(), "Content-Type": "application/json" },
  });
}

function validateInput(body: RequestBody) {
  const childName      = typeof body.childName === "string" ? body.childName.trim() : "";
  const childAge       = typeof body.childAge  === "number" ? body.childAge          : Number.NaN;
  const message        = typeof body.message   === "string" ? body.message.trim()    : "";
  const userId         = typeof body.userId    === "string" ? body.userId             : null;
  const childProfileId = typeof body.childProfileId === "string" ? body.childProfileId : null;
  const intensity      = typeof body.intensity === "number" &&
                         body.intensity >= 1 && body.intensity <= 5
                           ? Math.round(body.intensity) : null;

  if (!childName) throw new Error("childName is required.");
  if (!Number.isFinite(childAge) || childAge < 2 || childAge > 17) {
    throw new Error("childAge must be between 2 and 17.");
  }
  if (!message) throw new Error("message is required.");

  return { childName, childAge, message, userId, childProfileId, intensity };
}

async function logSafetyEvent(data: {
  userId: string | null; childProfileId: string | null;
  messageExcerpt: string; riskLevel: string;
  policyRoute: string; crisisType: string | null;
}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/safety_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        user_id:            data.userId,
        child_profile_id:   data.childProfileId,
        message_excerpt:    data.messageExcerpt.slice(0, 120),
        risk_level:         data.riskLevel,
        policy_route:       data.policyRoute,
        classifier_version: "v1-keyword",
        resolved_with:      data.crisisType,
      }),
    });
  } catch { console.warn("[STURDY_SAFETY] Failed to log"); }
}

async function logUsageEvent(data: {
  userId: string | null; childProfileId: string | null;
  eventType: string; eventMeta: Record<string, unknown>;
}) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !data.userId) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/usage_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        user_id:          data.userId,
        child_profile_id: data.childProfileId,
        event_type:       data.eventType,
        event_meta:       data.eventMeta,
      }),
    });
  } catch { console.warn("[STURDY_USAGE] Failed to log"); }
}

function extractContent(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new Error("OpenAI returned an invalid payload.");
  }
  const choices = (payload as {
    choices?: Array<{ message?: { content?: unknown } }>;
  }).choices;
  const content = choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const text = content
      .map(i => (i && typeof i === "object" && "text" in i && typeof i.text === "string") ? i.text : "")
      .join("").trim();
    if (text) return text;
  }
  throw new Error("No content in OpenAI response.");
}

async function generateScript(prompt: string) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY.");

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
      signal:  controller.signal,
      body: JSON.stringify({
        model:       OPENAI_MODEL,
        temperature: 0.5,
        messages: [
          {
            role:    "system",
            content: "You are Sturdy. You write calm, human-sounding parenting scripts. You return strict JSON only — no markdown, no explanation.",
          },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name:   "sturdy_script",
            schema: {
              type:                 "object",
              additionalProperties: false,
              required:             ["situation_summary", "regulate", "connect", "guide", "avoid"],
              properties: {
                situation_summary: { type: "string" },
                regulate: {
                  type:                 "object",
                  additionalProperties: false,
                  required:             ["parent_action", "script"],
                  properties: {
                    parent_action: { type: "string" },
                    script:        { type: "string" },
                  },
                },
                connect: {
                  type:                 "object",
                  additionalProperties: false,
                  required:             ["parent_action", "script"],
                  properties: {
                    parent_action: { type: "string" },
                    script:        { type: "string" },
                  },
                },
                guide: {
                  type:                 "object",
                  additionalProperties: false,
                  required:             ["parent_action", "script"],
                  properties: {
                    parent_action: { type: "string" },
                    script:        { type: "string" },
                  },
                },
                avoid: {
                  type:  "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI error: ${response.status} ${err}`);
    }

    const payload = await response.json();
    const content = extractContent(payload);

    let parsed: unknown;
    try { parsed = JSON.parse(content); }
    catch { throw new Error("Invalid JSON from model."); }

    if (!validateResponse(parsed)) throw new Error("Invalid response shape.");
    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}

// @ts-ignore
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin":  "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

  let body: RequestBody;
  try { body = await req.json(); }
  catch { return jsonResponse({ error: "Invalid JSON." }, 400); }

  let input;
  try { input = validateInput(body); }
  catch (e) { return jsonResponse({ error: e instanceof Error ? e.message : "Invalid request." }, 400); }

  // ── Safety filter
  const safety = runSafetyFilter(input.message);
  if (!safety.isSafe) {
    logSafetyEvent({
      userId: input.userId, childProfileId: input.childProfileId,
      messageExcerpt: input.message, riskLevel: safety.riskLevel,
      policyRoute: safety.policyRoute, crisisType: safety.crisisType,
    });
    return jsonResponse({
      response_type: "crisis",
      crisis_type:   safety.crisisType,
      risk_level:    safety.riskLevel,
      policy_route:  safety.policyRoute,
    }, 200);
  }

  // ── Generate
  try {
    const prompt = buildPrompt({
      childName: input.childName,
      childAge:  input.childAge,
      message:   input.message,
      intensity: input.intensity,
    });

    const result = await generateScript(prompt);

    logUsageEvent({
      userId: input.userId, childProfileId: input.childProfileId,
      eventType: "script_generated",
      eventMeta: { intensity: input.intensity, child_age: input.childAge },
    });

    return jsonResponse({ response_type: "normal", ...result as object }, 200);
  } catch (err) {
    console.error("[STURDY_ERROR]", err);
    return jsonResponse({ error: "Couldn't generate a script right now." }, 500);
  }
});


