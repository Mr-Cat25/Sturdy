# Sturdy Database Schema

## Purpose

This document defines the database structure for Sturdy.

Sturdy is a **crisis-first parenting response tool for hard moments**.
The database should support fast, structured, safety-aware responses while keeping the system flexible enough to grow later.

The schema should support:

- authenticated parents
- child profiles
- exact-age adaptation
- neurotype-aware prompting
- hard-moment conversations
- structured AI responses
- safety routing
- conversation persistence
- future saved scripts and insights

---

## Core Data Principles

### 1. The mobile app is the product

The schema is designed primarily for the app experience, not for a generic chat product.

### 2. Responses are structured product data

Assistant output should not be treated as raw text only.
It should be stored in structured form so the app can render predictable sections like:

- Regulate
- Connect
- Guide
- Avoid
- Notes

### 3. Child context matters

Responses should adapt to the child’s actual profile.
That means the schema should support:

- exact age
- neurotype
- preferences
- optional profile notes

Broad age bands are not enough for final script generation.

### 4. Safety is a first-class system layer

The schema must support safety classification, routing, and logging.

### 5. Start with a focused MVP

The MVP should support the hard-moment core loop first.
Do not overbuild early.

---

## MVP Schema Scope

The first usable MVP should support:

- user account
- child profile
- conversation
- user message
- assistant response
- safety event logging
- basic usage tracking

Minimum MVP tables:

- `profiles`
- `child_profiles`
- `conversations`
- `messages`
- `safety_events`
- `usage_events`

Future tables can be added later.

---

## Table Overview

## `profiles`

Represents the authenticated parent account.

Purpose:

- app-level user metadata
- ownership root for child data
- future settings / preferences

Suggested fields:

- `id` uuid primary key, references `auth.users(id)`
- `full_name` text nullable
- `created_at` timestamptz
- `updated_at` timestamptz

Notes:

- one row per authenticated user
- should be auto-created on signup

---

# 2. child_profiles

## Purpose

Stores child-specific context used for personalization.

## Table

```sql
create table public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  child_age integer not null check (child_age between 2 and 17),
  neurotype text[] not null default '{}',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Field Notes

name  
Optional. Some parents may not want to store a real name.

child_age  
Required exact age in years.  
This must be stored as a single age value, not a broad age band.  
Sturdy uses this value to adapt scripts developmentally and precisely.

Examples:
- 2
- 4
- 7
- 13
- 17

neurotype  
Examples:
- ADHD
- Autism
- Anxiety
- Sensory

preferences  
Flexible JSON for future additions such as:
- preferred calming strategies
- routine context
- school-related notes
- sensory environment preferences
-

---

## `conversations`

Represents one hard-moment interaction thread for a specific child.

Purpose:

- store a sequence of messages tied to one moment
- support conversation history
- allow future follow-up

Suggested fields:

- `id` uuid primary key
- `user_id` uuid not null references `auth.users(id)`
- `child_profile_id` uuid not null references `child_profiles(id)`
- `mode` text not null
- `title` text nullable
- `summary` text nullable
- `archived` boolean not null default false
- `created_at` timestamptz
- `updated_at` timestamptz

### MVP mode

For MVP, only support:

- `hard_moment`

Recommended constraint for MVP:

- `mode = 'hard_moment'`

Reflection or coach modes can be added later in future migrations.

### Ownership rule

A conversation’s `child_profile_id` must belong to the same `user_id`.
This should be enforced at the database level, not only in app code.

---

## `messages`

Represents individual conversation turns.

Purpose:

- store parent messages
- store assistant responses
- persist structured scripts
- attach risk classification to each turn when needed

Suggested fields:

- `id` uuid primary key
- `conversation_id` uuid not null references `conversations(id)`
- `role` text not null
- `content` text not null
- `structured` jsonb nullable
- `risk_level` text nullable
- `policy_route` text nullable
- `created_at` timestamptz

### Allowed roles

- `user`
- `assistant`
- `system`

### Structured assistant output

Assistant responses should store both:

- `content` → readable flattened text
- `structured` → JSON used by the app UI

This allows:

- reliable rendering
- easier analytics later
- future response transformation without reparsing raw text

### Expected structured shape for assistant messages

```json
{
  "mode": "hard_moment",
  "situation_summary": "Leaving the park is triggering a big reaction because a fun activity is ending suddenly.",
  "parent_tone": "Low voice. Steady. Calm.",
  "regulate": {
    "parent_action": "Move closer and steady your tone.",
    "script": "You’re really upset that it’s time to leave."
  },
  "connect": {
    "parent_action": "Acknowledge the frustration and hold the boundary.",
    "script": "You wanted to stay longer, and that feels really hard. I’m not going to let you hit."
  },
  "guide": {
    "parent_action": "Give the next step clearly.",
    "script": "We’re leaving now. You can hold my hand, or I can help you get to the car."
  },
  "avoid": [
    "Stop this right now",
    "You’re embarrassing me"
  ],
  "notes": [
    "Keep the language calm and direct."
  ],
  "safety_escalation": false,
  "risk_level": "SAFE",
  "policy_route": "normal_parenting"
}
```

### Why store both `content` and `structured`

`content` is useful for:

- plain text export
- search
- simple transcript rendering

`structured` is useful for:

- app layout
- product consistency
- future analysis
- validation against the response contract

---

## `safety_events`

Represents safety-related events triggered during processing.

Purpose:

- log escalated cases
- support auditing
- support future safety review
- track which route was taken

Suggested fields:

- `id` uuid primary key
- `user_id` uuid not null references `auth.users(id)`
- `child_profile_id` uuid references `child_profiles(id)`
- `conversation_id` uuid references `conversations(id)`
- `message_id` uuid references `messages(id)`
- `message_excerpt` text nullable
- `risk_level` text not null
- `policy_route` text not null
- `classifier_version` text nullable
- `resolved_with` text nullable
- `created_at` timestamptz

### Allowed risk levels

- `SAFE`
- `ELEVATED_RISK`
- `CRISIS_RISK`
- `MEDICAL_EMERGENCY`

### Allowed policy routes

- `normal_parenting`
- `safety_support`
- `violence_escalation`
- `medical_emergency`
- `fallback_response`

### Privacy note

Safety events are sensitive. Store only the minimum excerpt needed for system review.

---

## `usage_events`

Represents lightweight usage tracking and product analytics.

Purpose:

- count script generations
- support future quota/subscription logic
- understand feature usage without overbuilding analytics infrastructure

Suggested fields:

- `id` uuid primary key
- `user_id` uuid not null references `auth.users(id)`
- `child_profile_id` uuid references `child_profiles(id)`
- `conversation_id` uuid references `conversations(id)`
- `event_type` text not null
- `event_meta` jsonb not null default `{}`
- `created_at` timestamptz

Examples:

- `script_generated`
- `safety_escalated`
- `conversation_started`

---

## Recommended MVP Relationships

```text
auth.users
   ↓
profiles
   ↓
child_profiles
   ↓
conversations
   ↓
messages
```

Safety and usage link back into the same ownership structure:

```text
users
 ├── child_profiles
 ├── conversations
 ├── safety_events
 └── usage_events
```

---

## Exact Age vs Derived Grouping

The database should store:

- `age_years`

The system may also derive a helper grouping internally if useful, but that grouping should not replace exact age.

Example internal helper grouping:
- 2–3
- 4–5
- 6–8
- 9–12
- 13–17

These can help prompt logic, but the stored source of truth should remain the child’s exact age.

---

## Why Age Bands Alone Are Not Enough

A single band like 2–4 is too coarse for final response generation.

Examples:

- a 2-year-old often needs very short, concrete wording
- a 4-year-old can handle fuller language and simple choices
- a 13-year-old requires respectful, non-babying phrasing
- a 17-year-old should not receive childlike wording

That is why Sturdy should move from:
- broad age-band output logic

to:
- exact-age output logic
---

## Human-Language Implication for Data

Because Sturdy aims to produce human-sounding, not choppy output, the system needs enough child context to make the language feel developmentally right.

That means the schema should support:

- exact age
- neurotype
- known trigger patterns
- preferred calming supports
- communication notes

Without good context, the model is more likely to fall back to generic or mechanically short language.

---

## Row-Level Security

All child and conversation data should be scoped to the authenticated user.
Enable RLS on all application tables.

Recommended ownership rules:

- a user can only read their own profile
- a user can only read/write their own child profiles
- a user can only read/write their own conversations
- a user can only read messages in their own conversations
- a user can only read their own safety and usage events

### Important ownership rule

A conversation must not reference a child profile owned by another user.
This should be enforced through:
- RLS
- insert/update checks
- an ownership trigger if needed

---

## Updated At Triggers

Use a shared `set_updated_at()` trigger function for:

- `profiles`
- `child_profiles`
- `conversations`

This keeps timestamps consistent without extra app logic.

---

## Auto Profile Creation

Create a trigger on `auth.users` insert to automatically create a row in `profiles`.
This keeps account creation simple and avoids missing profile rows.

---

## Indexing Recommendations

At minimum, index:

- `child_profiles.user_id`
- `conversations.user_id`
- `conversations.child_profile_id`
- `conversations.updated_at`
- `messages.conversation_id`
- `messages.created_at`
- `messages.risk_level`
- `safety_events.user_id`
- `safety_events.risk_level`
- `safety_events.created_at`
- `usage_events.user_id`
- `usage_events.event_type`
- `usage_events.created_at`

These are enough for MVP read patterns.

---

## MVP First, Future Later

The MVP should not yet require these tables:

- `saved_scripts`
- `subscriptions`
- `child_behavior_patterns`
- `prompt_versions`
- `prompt_runs`

Those can be added later after the first usable hard-moment loop is working.

---

## Future Expansion Tables

Later phases may add:

- `saved_scripts`
  - For keeping favorite or reusable responses.
- `subscriptions`
  - For premium gating and plan management.
- `child_behavior_patterns`
  - For tracking repeated triggers and response patterns over time.
- `prompt_versions`
  - For tracking prompt changes in production.
- `prompt_runs`
  - For debugging prompt quality and structured output behavior.

These are valuable later, but not required to prove MVP value.

---

## MVP Core Path Supported by This Schema

```text
child profile
→ parent enters hard moment
→ edge function classifies safety
→ prompt uses exact age + profile context
→ structured response is generated
→ conversation and messages are stored
```

This is the schema’s main job.

---

## Final Principle

The database should support one outcome above all:

when a parent describes a hard moment, Sturdy can return a calm, human, developmentally appropriate script that feels specific to their child.
