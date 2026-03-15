declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
};

// @ts-ignore Remote Deno module import is resolved by the Supabase Edge runtime.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import { buildPrompt } from "../_shared/buildPrompt.ts";
import { validateResponse } from "../_shared/validateResponse.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

type RequestBody = {
  message?: unknown;
  childAge?: unknown;
  neurotype?: unknown;
};

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(),
      "Content-Type": "application/json",
    },
  });
}

function validateInput(body: RequestBody) {
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const childAge = typeof body.childAge === "number" ? body.childAge : Number.NaN;

  if (!message) {
    throw new Error("message is required and must be a non-empty string.");
  }

  if (!Number.isFinite(childAge) || childAge < 2 || childAge > 17) {
    throw new Error("childAge is required and must be a number between 2 and 17.");
  }

  let neurotype: string[] = [];

  if (body.neurotype !== undefined) {
    if (!Array.isArray(body.neurotype) || body.neurotype.some((item) => typeof item !== "string")) {
      throw new Error("neurotype must be an array of strings when provided.");
    }

    neurotype = body.neurotype.map((item) => item.trim()).filter(Boolean);
  }

  return { message, childAge, neurotype };
}

function extractContent(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new Error("OpenAI returned an invalid response payload.");
  }

  const choices = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices;
  const content = choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((item) => {
        if (item && typeof item === "object" && "text" in item && typeof item.text === "string") {
          return item.text;
        }

        return "";
      })
      .join("")
      .trim();

    if (text) {
      return text;
    }
  }

  throw new Error("OpenAI response did not include message content.");
}

async function generateParentingResponse(prompt: string) {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You write calm, human parenting scripts for Sturdy. Return strict JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "sturdy_parenting_response",
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["situation_summary", "regulate", "connect", "guide"],
              properties: {
                situation_summary: { type: "string" },
                regulate: { type: "string" },
                connect: { type: "string" },
                guide: { type: "string" },
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

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("Model returned invalid JSON.");
    }

    if (!validateResponse(parsed)) {
      throw new Error("Model returned an invalid response shape.");
    }

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
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    })
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  let body: RequestBody;

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  let input;

  try {
    input = validateInput(body);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "Invalid request." }, 400);
  }

  try {
    const prompt = buildPrompt(input);
    const result = await generateParentingResponse(prompt);

    return jsonResponse(result, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "We couldn't generate a script right now." }, 500);
  }
});
