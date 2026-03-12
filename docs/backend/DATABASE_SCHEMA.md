DATABASE_SCHEMA.md

# Sturdy Database Schema

## Purpose

This document defines the database structure for Sturdy.

The schema is designed to support:

- user accounts
- child profiles
- structured AI conversations
- saved scripts
- safety logging
- subscriptions
- long-term child behavior memory

The database should support both the current MVP and the future personalization system that makes Sturdy more valuable over time.

---

# Design Principles

The database should be built around these principles:

- one parent can have multiple children
- each child can have many conversations
- each conversation can contain many messages
- AI responses should be stored in both raw and structured form
- safety events must be auditable
- subscriptions should be enforced server-side
- behavior learning should improve future responses

---

# Core Entity Relationships

```text
auth.users
   │
   └── profiles
         │
         ├── child_profiles
         │      │
         │      ├── conversations
         │      │      └── messages
         │      │
         │      ├── saved_scripts
         │      │
         │      ├── child_behavior_patterns
         │      │
         │      └── safety_events
         │
         └── subscriptions
1. profiles
Purpose
Stores app-level user metadata linked to Supabase auth.
Table
Sql
Copy code
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
Notes
id must match auth.users.id
this table exists mainly for application metadata
every authenticated user should automatically receive a profile row
2. child_profiles
Purpose
Stores child-specific context used for personalization.
Table
Sql
Copy code
create table public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  age_band text not null check (age_band in ('2-4', '5-7', '8-12')),
  neurotype text[] not null default '{}',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
Field Notes
name
Optional. Some parents may not want to store a real name.
age_band
Used for script tone and developmental adaptation.
neurotype
Examples:
ADHD
Autism
Anxiety
Sensory
preferences
Flexible JSON for future additions such as:
preferred calming strategies
routine context
school-related notes
sensory environment preferences
Example:
Json
Copy code
{
  "preferred_transition_warning_minutes": 5,
  "likes_choice_based_prompts": true
}
3. conversations
Purpose
Represents a single chat or support session.
Table
Sql
Copy code
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_profile_id uuid references public.child_profiles(id) on delete set null,
  mode text not null check (mode in ('hard_moment', 'reflection', 'coach')),
  title text,
  summary text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
Field Notes
mode
Supported conversation types:
hard_moment
reflection
coach
title
Usually based on the first user message or generated summary.
summary
Optional compact summary used for future history previews and context compression.
archived
Allows soft-hiding older threads without deleting them.
4. messages
Purpose
Stores every user and assistant turn within a conversation.
Table
Sql
Copy code
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  structured jsonb,
  risk_level text,
  policy_route text,
  created_at timestamptz not null default now()
);
Field Notes
role
user
assistant
system for internal generated summaries or policy events if needed later
content
Raw text of the message
structured
Structured AI response JSON for render-friendly UI
risk_level
Optional safety classification captured at message level
Examples:
SAFE
ELEVATED_RISK
CRISIS_RISK
MEDICAL_EMERGENCY
policy_route
Which path handled the request
Examples:
normal_parenting
safety_support
violence_escalation
medical_emergency
fallback_response
5. saved_scripts
Purpose
Stores scripts the parent wants to keep and reuse.
Table
Sql
Copy code
create table public.saved_scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_profile_id uuid references public.child_profiles(id) on delete set null,
  source_conversation_id uuid references public.conversations(id) on delete set null,
  source_message_id uuid references public.messages(id) on delete set null,
  title text not null,
  trigger_label text,
  structured jsonb not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
Field Notes
trigger_label
Examples:
bedtime
leaving park
sibling conflict
hitting
school refusal
structured
Stored in the same structured format used by the UI so scripts can render consistently later.
6. child_behavior_patterns
Purpose
This is the foundation of Sturdy’s long-term moat.
It stores what tends to trigger hard moments and what strategies helped.
Table
Sql
Copy code
create table public.child_behavior_patterns (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  trigger_label text not null,
  strategy_label text not null,
  strategy_detail text,
  success_rating integer check (success_rating between 1 and 5),
  feedback_source text check (feedback_source in ('explicit', 'implicit', 'manual')),
  source_conversation_id uuid references public.conversations(id) on delete set null,
  source_message_id uuid references public.messages(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
Field Notes
trigger_label
Examples:
leaving activities
bedtime
sibling conflict
transitions
screen time ending
strategy_label
Examples:
countdown warning
offer two choices
fewer words
movement break
hand-holding transition
success_rating
This can come from explicit parent feedback.
feedback_source
explicit = parent tapped “this helped”
implicit = inferred from later behavior
manual = parent entered it directly
Why It Matters
This table enables Sturdy to say:
“Last time, countdown warnings helped.”
That is a major product differentiator.
7. safety_events
Purpose
Stores safety-related events for auditability and product improvement.
Table
Sql
Copy code
create table public.safety_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_profile_id uuid references public.child_profiles(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  message_excerpt text,
  risk_level text not null,
  policy_route text not null,
  classifier_version text,
  resolved_with text,
  created_at timestamptz not null default now()
);
Field Notes
resolved_with
Examples:
safety_response
medical_redirect
fallback_response
normal_flow_blocked
classifier_version
Useful for auditing changes to risk detection logic over time
8. subscriptions
Purpose
Stores the current subscription state mirrored from RevenueCat or another billing source.
Table
Sql
Copy code
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'revenuecat',
  customer_id text,
  entitlement text,
  product_id text,
  status text not null check (status in ('active', 'inactive', 'trialing', 'grace_period', 'cancelled')),
  current_period_ends_at timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);
Why Server-Side Subscription Storage Matters
It prevents the app from relying only on client-side billing state.
The backend can enforce:
usage limits
premium access
grace periods
trial handling
9. usage_events
Purpose
Tracks feature usage for analytics, limits, and billing controls.
Table
Sql
Copy code
create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_profile_id uuid references public.child_profiles(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
Example event_type values
chat_message_sent
script_generated
saved_script_created
feedback_submitted
safety_escalation_triggered
subscription_checked
10. prompt_versions
Purpose
Tracks which prompt system version produced a response.
This is useful for auditing and experimentation.
Table
Sql
Copy code
create table public.prompt_versions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  version text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);
Example rows
hard_moment_base
reflection_base
safety_classifier
fallback_response
11. prompt_runs
Purpose
Stores metadata about model executions without necessarily storing every full prompt forever.
Table
Sql
Copy code
create table public.prompt_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  child_profile_id uuid references public.child_profiles(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  prompt_key text,
  prompt_version text,
  model text,
  policy_route text,
  latency_ms integer,
  success boolean not null default true,
  error_code text,
  created_at timestamptz not null default now()
);
Why This Table Helps
It supports:
debugging
latency monitoring
prompt evaluation
model change auditing
Recommended Indexes
Indexes should support the most common access patterns.
Child Profiles
Sql
Copy code
create index idx_child_profiles_user_id on public.child_profiles(user_id);
Conversations
Sql
Copy code
create index idx_conversations_user_id on public.conversations(user_id);
create index idx_conversations_child_profile_id on public.conversations(child_profile_id);
create index idx_conversations_updated_at on public.conversations(updated_at desc);
Messages
Sql
Copy code
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_messages_created_at on public.messages(created_at);
create index idx_messages_risk_level on public.messages(risk_level);
Saved Scripts
Sql
Copy code
create index idx_saved_scripts_user_id on public.saved_scripts(user_id);
create index idx_saved_scripts_child_profile_id on public.saved_scripts(child_profile_id);
create index idx_saved_scripts_trigger_label on public.saved_scripts(trigger_label);
Behavior Patterns
Sql
Copy code
create index idx_child_behavior_patterns_child_profile_id on public.child_behavior_patterns(child_profile_id);
create index idx_child_behavior_patterns_trigger_label on public.child_behavior_patterns(trigger_label);
create index idx_child_behavior_patterns_strategy_label on public.child_behavior_patterns(strategy_label);
Safety Events
Sql
Copy code
create index idx_safety_events_user_id on public.safety_events(user_id);
create index idx_safety_events_risk_level on public.safety_events(risk_level);
create index idx_safety_events_created_at on public.safety_events(created_at desc);
Usage Events
Sql
Copy code
create index idx_usage_events_user_id on public.usage_events(user_id);
create index idx_usage_events_event_type on public.usage_events(event_type);
create index idx_usage_events_created_at on public.usage_events(created_at desc);
Row-Level Security Strategy
Because Sturdy stores sensitive family information, row-level security is mandatory.
General Rules
users can read only their own data
users can write only their own data
child-related records must belong to the authenticated user through ownership checks
service-role operations should be limited to backend functions only
Example Ownership Logic
child_profiles
A user can only access rows where:
Sql
Copy code
auth.uid() = user_id
conversations
A user can only access rows where:
Sql
Copy code
auth.uid() = user_id
messages
A user can only access messages where the related conversation belongs to them.
saved_scripts
A user can only access rows where:
Sql
Copy code
auth.uid() = user_id
subscriptions
A user can only access rows where:
Sql
Copy code
auth.uid() = user_id
Triggers and Automation
1. Auto-create profile on signup
When a new auth user is created, create a matching row in profiles.
2. Auto-update updated_at
Use a shared trigger function on tables with mutable data:
profiles
child_profiles
conversations
saved_scripts
child_behavior_patterns
subscriptions
Example Trigger Function
Sql
Copy code
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
Structured Message Format
For assistant responses, messages.structured should store a JSON object shaped like this:
Json
Copy code
{
  "mode": "hard_moment",
  "situation_summary": "Leaving the park is overwhelming because a fun activity is ending.",
  "parent_tone": "Low voice. Few words.",
  "regulate": {
    "parent_action": "Take one breath and move closer.",
    "script": "I’m here. I won’t let you kick."
  },
  "connect": {
    "parent_action": "Name the feeling simply.",
    "script": "You really wanted to stay."
  },
  "guide": {
    "parent_action": "Set the boundary and next step.",
    "script": "We are leaving now. Hold my hand or I will carry you."
  },
  "avoid": [
    "Stop this right now",
    "You’re embarrassing me"
  ],
  "notes": [
    "Keep talking minimal."
  ],
  "safety_escalation": false
}
This allows the mobile app to render content consistently.
Suggested Future Extensions
The schema is designed to allow future additions such as:
localized emergency guidance
clinician or coach notes
household-level family accounts
multiple caregivers per child
school/daycare context
attachment of audio input summaries
push notification preferences
weekly insights summaries
experimentation by prompt version
MVP Minimum Required Tables
If building the first working version, the minimum set is:
profiles
child_profiles
conversations
messages
safety_events
subscriptions
usage_events
This is enough to support:
auth
child profile setup
AI conversations
safety routing
basic premium enforcement
Recommended Launch Schema
For a stronger first production version, include:
profiles
child_profiles
conversations
messages
saved_scripts
child_behavior_patterns
safety_events
subscriptions
usage_events
prompt_versions
prompt_runs
This gives Sturdy both product functionality and an early data moat.
Data Retention Considerations
Because the data is sensitive, retention policy matters.
Suggested principles:
store only what is needed
avoid saving full prompts when not necessary
log safety events with limited excerpts
allow deletion of conversations and child profiles
support future export and deletion requests
Summary
The Sturdy schema is built to support three product layers:
1. Immediate Support
child profiles
conversations
messages
2. Reusable Value
saved scripts
conversation history
3. Compounding Personalization
child behavior patterns
safety events
prompt tracking
usage events
This schema is what allows Sturdy to evolve from:
an AI script generator
into:
a parenting support system that learns what works for each child
