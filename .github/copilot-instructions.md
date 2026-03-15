# Sturdy Copilot Instructions

## Critical Rule
Do not modify the AI script generation pipeline unless explicitly asked.

Protected files:
- supabase/functions/chat-parenting-assistant/index.ts
- supabase/functions/_shared/buildPrompt.ts
- supabase/functions/_shared/validateResponse.ts

## Default behavior
When working on UI, UX, mobile screens, navigation, theme, or product features:
- do not change the protected backend files
- do not change the edge function request/response shape
- do not change prompt logic
- do not change response validation logic

## If backend changes are requested
Only modify the protected files when the request is specifically about:
- AI prompt quality
- edge function behavior
- response schema
- backend validation

Otherwise leave them untouched.
