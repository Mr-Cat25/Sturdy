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
  childName?:       unknown;
  childAge?:        unknown;
  message?:         unknown;
  userId?:          unknown;
  childProfileId?:  unknown;
  neurotype?:       unknown;
  intensity?:       unknown;  // 1–5
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
  const childName      = typeof body.childName      === "string" ? body.childName.trim() : "";
  const childAge       = typeof body.childAge       === "number" ? body.childAge          : Number.NaN;
  const message        = typeof body.message        === "string" ? body.message.trim()    : "";
  const userId         = typeof body.userId         === "string" ? body.userId             : null;
  const childProfileId = typeof body.childProfileId === "string" ? body.childProfileId    : null;
  const neurotype      = typeof body.neurotype      === "string" ? body.neurotype          : null;
  const intensity      = typeof body.intensity      === "number" &&
                         body.intensity >= 1 && body.intensity <= 5
                           ? Math.round(body.intensity)
                           : null;

  if (!childName) throw new Error("childName is required.");
  if (!Number.isFinite(childAge) || childAge < 2 || childAge > 17) {
    throw new Error("childAge must be between 2 and 17.");
  }
  if (!message) throw new Error("message is required.");

  return { childName, childAge, message, userId, childProfileId, neurotype, intensity };
}

async function logSafetyEvent({
  userId, childProfileId, messageExcerpt, riskLevel, policyRoute, crisisType,
}: {
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
        user_id:            userId,
        child_profile_id:   childProfileId,
        message_excerpt:    messageExcerpt.slice(0, 120),
        risk_level:         riskLevel,
        policy_route:       policyRoute,
        classifier_version: "v1-keyword",
        resolved_with:      crisisType,
      }),
    });
  } catch { console.warn("[STURDY_SAFETY] Failed to log safety event"); }
}

async function logUsageEvent({
  userId, childProfileId, eventType, eventMeta,
}: {
  userId: string | null; childProfileId: string | null;
  eventType: string; eventMeta: Record<string, unknown>;
}) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !userId) return;
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
        user_id:          userId,
        child_profile_id: childProfileId,
        event_type:       eventType,
        event_meta:       eventMeta,
      }),
    });
  } catch { console.warn("[STURDY_USAGE] Failed to log usage event"); }
}

function extractContent(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new Error("OpenAI returned an invalid response payload.");
  }
  const choices = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices;
  const content = choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const text = content
      .map(item => (item && typeof item === "object" && "text" in item && typeof item.text === "string") ? item.text : "")
      .join("").trim();
    if (text) return text;
  }
  throw new Error("OpenAI response did not include message content.");
}

async function generateParentingResponse(prompt: string) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY.");
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
      signal: controller.signal,
      body: JSON.stringify({
        model:       OPENAI_MODEL,
        temperature: 0.4,
        messages: [
          {
            role:    "system",
            content: "You are Sturdy, a calm parenting guide. You help parents know what to say next in hard moments. Return strict JSON only.",
          },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name:   "sturdy_parenting_response",
            schema: {
              type: "object", additionalProperties: false,
              required: ["situation_summary", "regulate", "connect", "guide"],
              properties: {
                situation_summary: { type: "string" },
                regulate:          { type: "string" },
                connect:           { type: "string" },
                guide:             { type: "string" },
              },
            },
          },
        },
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }
    const payload = await response.json();
    const content = extractContent(payload);
    let parsed: unknown;
    try { parsed = JSON.parse(content); } catch { throw new Error("Model returned invalid JSON."); }
    if (!validateResponse(parsed)) throw new Error("Model returned an invalid response shape.");
    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}

// @ts-ignore Preserve the requested handler signature.
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
  catch { return jsonResponse({ error: "Request body must be valid JSON." }, 400); }

  let input;
  try { input = validateInput(body); }
  catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "Invalid request." }, 400);
  }

  // ── Layer 1: Safety filter
  const safety = runSafetyFilter(input.message);
  if (!safety.isSafe) {
    console.log("[STURDY_SAFETY] Triggered:", safety.riskLevel, safety.crisisType);
    logSafetyEvent({
      userId:         input.userId,
      childProfileId: input.childProfileId,
      messageExcerpt: input.message,
      riskLevel:      safety.riskLevel,
      policyRoute:    safety.policyRoute,
      crisisType:     safety.crisisType,
    });
    return jsonResponse({
      response_type: "crisis",
      crisis_type:   safety.crisisType,
      risk_level:    safety.riskLevel,
      policy_route:  safety.policyRoute,
    }, 200);
  }

  // ── Safe: generate script
  try {
    const prompt = buildPrompt({
      childName: input.childName,
      childAge:  input.childAge,
      message:   input.message,
      neurotype: input.neurotype,
      intensity: input.intensity,
    });

    const result = await generateParentingResponse(prompt);

    // Log usage — include intensity in metadata for future analytics
    logUsageEvent({
      userId:         input.userId,
      childProfileId: input.childProfileId,
      eventType:      "script_generated",
      eventMeta: {
        intensity:  input.intensity,
        neurotype:  input.neurotype,
        child_age:  input.childAge,
      },
    });

    return jsonResponse({ response_type: "normal", ...result as object }, 200);
  } catch (error) {
    console.error("[STURDY_ERROR]", error);
    return jsonResponse({ error: "We couldn't generate a script right now." }, 500);
  }
});

