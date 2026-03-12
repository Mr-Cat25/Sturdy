ARCHITECTURE.md

# Sturdy Architecture

## Overview

Sturdy is a crisis-first AI parenting assistant built for real-time support during hard moments.

The system is designed around four goals:

- fast response time
- structured and predictable output
- child-specific personalization
- safety-aware guidance

Instead of acting like a general chatbot, Sturdy behaves like a focused parenting tool that turns a parent’s input into a practical script.

Every AI response follows:

**Regulate → Connect → Guide**

---

## High-Level System Design

```text
Mobile App (React Native / Expo)
            │
            │ authenticated request
            ▼
Supabase Edge Functions (Deno)
            │
            ├── Supabase Auth
            ├── PostgreSQL Database
            └── OpenAI API
Responsibilities by Layer
Mobile App
The mobile app is the parent-facing product.
It handles:
sign up and sign in
child profile creation
chat input
script display
saved scripts
conversation history
subscription UX
Supabase
Supabase provides the application backend.
It handles:
authentication
PostgreSQL database
row-level security
Edge Functions
future analytics and storage
Edge Functions
Edge Functions are the orchestration layer.
They handle:
user validation
child profile lookup
prompt building
safety detection
AI model calls
response normalization
message persistence
OpenAI
The model is used for structured script generation.
It does not run the product logic directly. The product logic stays in the Edge Function so outputs remain consistent and controlled.
Product Modes
Sturdy is designed with two main AI modes.
1. Hard Moment Mode
This is the primary mode.
Use cases:
hitting
screaming
refusal
transitions
leaving activities
bedtime conflict
sibling conflict
Response style:
short
calm
firm
actionable
structured
2. Reflection Mode
This is a secondary mode for after the crisis.
Use cases:
understanding patterns
planning for next time
reviewing what happened
preparing scripts in advance
Response style:
slightly more explanatory
still practical
still brief
child-specific
Request Flow
Hard Moment Request
Text
Copy code
Parent enters situation
        │
        ▼
Mobile app sends authenticated request
        │
        ▼
Edge Function validates user
        │
        ▼
Fetch child profile + recent conversation
        │
        ▼
Safety detector checks for urgent risk
        │
        ├── If unsafe: return safety-first response
        │
        └── If safe: build prompt
                    │
                    ▼
               OpenAI API
                    │
                    ▼
          Structured JSON response
                    │
                    ▼
 Store conversation + return response to app
Mobile App Architecture
Text
Copy code
apps/mobile/src/
├── app/               # routes and screens
├── components/        # reusable UI blocks
├── features/          # feature-level API and hooks
├── lib/               # shared clients (Supabase, etc.)
├── styles/            # theme, tokens, typography
└── types/             # app-local types
Route Areas
Auth
sign up
sign in
password recovery later
Child Profiles
create child profile
edit child profile
select child profile
Chat
new conversation
conversation detail
structured script result
future history view
Settings / Billing
subscription status
restore purchases
profile settings
support links
Backend Architecture
Text
Copy code
supabase/
├── migrations/        # schema changes
├── functions/
│   ├── _shared/       # shared utilities
│   ├── chat-parenting-assistant/
│   ├── create-conversation/
│   ├── list-conversations/
│   ├── save-script/
│   └── revenuecat-webhook/
Database Design
The schema is designed to support:
multiple children per parent
multiple conversations per child
structured AI messages
saved scripts
future personalization
1. profiles
Stores base user metadata.
Sql
Copy code
profiles
- id uuid primary key
- created_at timestamptz
2. child_profiles
Stores child context used to personalize scripts.
Sql
Copy code
child_profiles
- id uuid primary key
- user_id uuid
- name text
- age_band text
- neurotype text[]
- created_at timestamptz
3. conversations
Stores each chat session.
Sql
Copy code
conversations
- id uuid primary key
- user_id uuid
- child_profile_id uuid
- mode text
- title text
- created_at timestamptz
- updated_at timestamptz
4. messages
Stores user and assistant turns.
Sql
Copy code
messages
- id uuid primary key
- conversation_id uuid
- role text
- content text
- structured jsonb
- created_at timestamptz
5. saved_scripts
Planned table for reusable favorite scripts.
Sql
Copy code
saved_scripts
- id uuid primary key
- user_id uuid
- child_profile_id uuid
- title text
- structured jsonb
- source_conversation_id uuid
- created_at timestamptz
6. child_behavior_patterns
Planned table for learning what works for each child.
Sql
Copy code
child_behavior_patterns
- id uuid primary key
- child_profile_id uuid
- trigger text
- strategy text
- success_rating int
- notes text
- created_at timestamptz
This table is the foundation of long-term personalization.
Row-Level Security Strategy
RLS is essential because parenting conversations and child data are highly sensitive.
Rules:
users can only see their own child profiles
users can only see their own conversations
users can only see messages belonging to their conversations
insert/update access is limited to the owning user
This ensures each parent’s data stays isolated.
AI Response Design
The AI is not allowed to freestyle output. It must return structured JSON.
Response Schema
Json
Copy code
{
  "mode": "hard_moment",
  "situation_summary": "Child is overwhelmed because screen time ended.",
  "parent_tone": "calm, low voice, few words",
  "regulate": {
    "parent_action": "Take one breath and lower your voice.",
    "script": "I’m here. I won’t let you hit."
  },
  "connect": {
    "parent_action": "Name the feeling briefly.",
    "script": "You really wanted more TV."
  },
  "guide": {
    "parent_action": "Set the limit and give one next step.",
    "script": "TV is off. You can sit with me or stomp your feet."
  },
  "avoid": [
    "Stop this right now",
    "You’re being ridiculous"
  ],
  "notes": [
    "Keep sentences short",
    "Avoid reasoning during escalation"
  ],
  "safety_escalation": false
}
Why Structured Output Matters
Structured output gives Sturdy:
predictable UX
cleaner rendering
safer moderation
easier testing
analytics-friendly data
faster future iteration
Prompt Assembly Flow
The prompt is assembled server-side.
Inputs include:
current mode
parent message
child age band
child neurotype
child name if available
recent conversation context
future: previous successful strategies
Prompt Layers
Text
Copy code
Base system rules
    +
Mode-specific instructions
    +
Child profile context
    +
Recent conversation turns
    +
Current parent message
Prompt Rules
The assistant must:
be calm, firm, practical
avoid therapy jargon
avoid diagnosis
avoid shaming
use short sentences
give spoken scripts parents can say aloud
adapt to age and neurotype
prioritize safety
Safety Architecture
Sturdy must detect high-risk situations before normal AI generation.
Example Safety Triggers
“I want to hit my child”
“My child can’t breathe”
“They are hurting themselves”
“I think I might lose control”
“My baby was shaken”
“They ran away”
“There is a weapon”
Safety Flow
Text
Copy code
Parent message
    │
    ▼
Keyword + classifier safety check
    │
    ├── Safe: proceed to AI generation
    └── Unsafe: return safety-first response
Safety Response Principles
stop normal coaching
prioritize physical safety
reduce language load
advise emergency help when appropriate
avoid long analysis
Conversation and Message Lifecycle
Create Conversation
A new conversation is created when the user starts a new chat or when no existing conversation is present.
Store User Message
The parent’s message is stored immediately.
Generate Assistant Response
The model returns structured JSON.
Store Assistant Message
The assistant response is stored as both:
raw content
structured JSON
This preserves both auditability and render-friendly data.
Personalization Architecture
This is the most important future differentiator.
Current Personalization
Today the app personalizes by:
age band
neurotype
current conversation context
Future Personalization
Later the app should also personalize by:
repeated triggers
strategies that worked
strategies that failed
common settings
time-of-day patterns
transition-related challenges
Future Learning Loop
Text
Copy code
AI script shown
    │
    ▼
Parent feedback: "Did this help?"
    │
    ▼
Store result in child_behavior_patterns
    │
    ▼
Include known successful strategies in future prompts
This creates a child-specific behavior memory system.
API Design
1. Generate Script
Http
Copy code
POST /functions/v1/chat-parenting-assistant
Request
Json
Copy code
{
  "conversationId": "uuid",
  "childProfileId": "uuid",
  "mode": "hard_moment",
  "message": "My child is screaming because we have to leave the park."
}
Response
Json
Copy code
{
  "mode": "hard_moment",
  "situation_summary": "Child is overwhelmed about leaving the park.",
  "parent_tone": "steady, calm, low voice",
  "regulate": {
    "parent_action": "Take one breath and move closer.",
    "script": "I’m here. I won’t let you kick."
  },
  "connect": {
    "parent_action": "Name the feeling simply.",
    "script": "You really wanted to stay."
  },
  "guide": {
    "parent_action": "Set the limit and offer one next step.",
    "script": "We are leaving now. Hold my hand or I will carry you."
  },
  "avoid": ["Stop this right now"],
  "notes": ["Keep talking minimal"],
  "safety_escalation": false
}
2. List Conversations
Planned:
Http
Copy code
GET /functions/v1/list-conversations
3. Get Conversation Detail
Planned:
Http
Copy code
GET /functions/v1/get-conversation?id={conversationId}
4. Save Script
Planned:
Http
Copy code
POST /functions/v1/save-script
5. Sync Subscription
Planned:
Http
Copy code
POST /functions/v1/sync-subscription
Subscription Architecture
RevenueCat is planned for subscription management.
Free Tier
limited script generations
limited conversation history
Premium Tier
unlimited AI chat
saved scripts
future behavior insights
future coach mode
Enforcement Strategy
Subscription checks should happen server-side before AI generation to prevent client-only bypasses.
Observability and Analytics
Planned telemetry should include:
request count
generation latency
safety escalation rate
script save rate
retry rate
top trigger categories
most effective scripts by child profile type
This will help improve both the product and model performance.
Scaling Considerations
The architecture is designed to scale incrementally.
Why This Stack Works Early
mobile app is fast to ship
Supabase minimizes backend overhead
Edge Functions keep orchestration simple
structured AI output reduces UI complexity
Scaling Later
As usage grows, Sturdy can add:
streaming responses
prompt caching
message summarization
background analytics pipelines
specialized models for safety classification
admin review tools
Security and Privacy Considerations
Sturdy handles highly sensitive family data.
Important safeguards:
row-level security in Postgres
authenticated Edge Function calls
limited prompt context
no unnecessary data exposure to the client
future encryption and retention policies
Development Priorities
Current Build Priorities
auth
child profiles
structured script generation
safety path
conversation persistence
Next Build Priorities
conversation history
saved scripts
premium gating
response validation
behavior memory
Summary
Sturdy is not just a chatbot.
It is a structured AI parenting system built around:
speed
clarity
child-specific adaptation
safety
long-term personalization
The combination of:
structured AI output
child profile context
safety-aware orchestration
future behavior memory
is what makes the product strong, practical, and defensible.