# Sturdy Roadmap

## Product Direction

Sturdy is being built as a crisis-first AI parenting tool for real-life hard moments.

The roadmap is designed around one central idea:

**help parents faster, more clearly, and more personally in the moments that matter most**

The product will grow in stages, starting with the most useful core experience and expanding into memory, personalization, and long-term guidance.

---

## Guiding Priorities

Every roadmap decision should support at least one of these:

- faster support in high-stress moments
- more practical scripts
- stronger trust and safety
- better child-specific personalization
- higher parent retention through usefulness over time

---

## Phase 1 — Core MVP

### Goal
Deliver the first usable version of Sturdy that solves the core problem:

**a parent enters a hard moment and gets a calm, practical script immediately**

### Product Features
- user authentication
- child profile creation
- age band support
- neurotype support
- structured AI script generation
- hard moment mode
- safety escalation path
- conversation persistence
- mobile script display

### AI Capabilities
- constrained JSON response
- calm, firm, practical tone
- Regulate → Connect → Guide format
- basic safety detection
- brief “avoid saying” guidance
- brief “notes” section

### Technical Scope
- React Native app with Expo
- Supabase auth
- Postgres schema for child profiles, conversations, and messages
- one Edge Function for AI generation
- OpenAI integration
- row-level security

### Success Criteria
- parent can sign up
- parent can create a child profile
- parent can describe a situation
- parent receives a useful structured script
- response feels calm, clear, and practical
- data is stored safely

---

## Phase 2 — Better Product Usability

### Goal
Make the product feel like a real tool, not just a demo.

### Product Features
- conversation history screen
- conversation detail screen
- saved scripts
- retry / regenerate response
- copy script action
- short script version
- reflection mode
- basic subscription gating
- restore purchases flow
- onboarding improvements

### UX Improvements
- faster flow into hard moment mode
- cleaner script rendering
- better child switching
- improved empty states
- better loading and error states
- reduced typing friction
- quick prompt chips such as:
  - bedtime
  - leaving park
  - sibling conflict
  - hitting
  - refusing to leave
  - school refusal

### AI Improvements
- more consistent response formatting
- reflection mode prompts
- stronger neurotype-specific adjustments
- shorter emergency response flow
- better prompt versioning

### Technical Scope
- new Edge Functions:
  - list conversations
  - get conversation
  - save script
  - sync subscription
- RevenueCat integration
- improved client-side state handling
- response schema validation

### Success Criteria
- parents can revisit past conversations
- useful scripts can be saved
- app feels stable and repeatable
- first premium path exists
- parents can use Sturdy more than once a day without friction

---

## Phase 3 — Full Chat Experience

### Goal
Turn single-turn script generation into a lightweight ongoing conversation system without losing speed and structure.

### Product Features
- multi-message conversations
- follow-up messages inside a chat
- context-aware follow-up scripts
- separate chat modes:
  - hard moment
  - reflection
  - future coach mode
- message history loading
- conversation titles
- archive / delete conversation
- in-thread retry

### UX Improvements
- continuous chat thread
- typing state
- better follow-up prompts
- “shorter version” button
- “public place version” button
- “bedtime version” button
- “say this in fewer words” action

### AI Improvements
- recent-message context inclusion
- conversation summarization for long threads
- better follow-up continuity
- contextual adaptation based on earlier turns

### Technical Scope
- message fetch APIs
- message pagination
- prompt context management
- summarization layer for older messages
- cost controls for longer conversations

### Success Criteria
- parents can continue a conversation after the first script
- AI responds coherently to follow-up messages
- the product still feels fast and focused
- long conversations remain affordable to serve

---

## Phase 4 — Saved Script Library

### Goal
Create reusable value even when the parent is not currently in crisis.

### Product Features
- saved scripts screen
- categorized scripts
- favorite scripts
- recently used scripts
- script search
- manual save and auto-save options
- custom script titles
- share / export scripts

### UX Improvements
- parents can keep the most useful scripts handy
- one-tap access to routines like:
  - bedtime
  - transitions
  - leaving the house
  - car seat
  - sibling conflict
  - screen time

### AI Improvements
- script condensation
- reusable templates
- script tagging by trigger type

### Technical Scope
- `saved_scripts` table
- save / delete / list script APIs
- search index or simple text search
- analytics on saved script usage

### Success Criteria
- parents come back to previously helpful scripts
- saved scripts improve retention
- parents use Sturdy proactively, not only reactively

---

## Phase 5 — Child Behavior Memory System

### Goal
Make Sturdy feel like it actually knows the child.

This is the single most important long-term differentiator.

### Product Features
- “Did this help?” feedback after scripts
- success tracking
- pattern memory by child
- repeated trigger tracking
- strategy history
- lightweight child insights

### What Sturdy Learns Over Time
- common triggers
- strategies that helped
- strategies that failed
- useful phrasing for that child
- common transition challenges
- recurring conflict patterns

### Example
Instead of saying:

> Here is a general script for leaving the park.

Sturdy can say:

> Leaving the park has been hard before. Last time, countdown warnings and a hand-holding choice helped.

### Technical Scope
- `child_behavior_patterns` table
- success feedback capture
- retrieval of prior successful strategies
- prompt enrichment with known patterns
- feedback-weighted strategy ranking

### AI Improvements
- child-specific strategy injection
- repeated-trigger awareness
- “what worked last time” support
- higher personalization quality

### Success Criteria
- responses improve for repeat situations
- parents feel the app understands their child
- retention increases because advice becomes more personal
- Sturdy becomes more defensible than generic AI apps

---

## Phase 6 — Parenting Insights

### Goal
Help parents understand patterns over time, not just survive individual moments.

### Product Features
- weekly parenting insight summaries
- trigger trend reports
- behavior pattern summaries
- script effectiveness trends
- routine-specific coaching suggestions

### Example Insights
- transitions are the biggest trigger this week
- bedtime scripts work better when kept under two sentences
- countdown warnings appear to reduce escalation
- sibling conflict increases in the evening

### Technical Scope
- analytics aggregation
- summary generation jobs
- insight cards in app
- optional notifications

### Success Criteria
- parents gain proactive support
- Sturdy moves from reactive tool to trusted parenting companion
- insights become a premium retention feature

---

## Phase 7 — Voice and Accessibility

### Goal
Reduce parent effort and make Sturdy usable in even more stressful moments.

### Product Features
- voice input
- read-aloud scripts
- larger text mode
- simplified display mode
- hands-free quick actions
- improved accessibility support

### Why It Matters
During high-stress parenting moments, typing is often too slow.
Voice and low-friction UI make the product much more practical.

### Success Criteria
- fewer taps required to get help
- better use in motion or public settings
- broader accessibility support

---

## Phase 8 — Coach Mode

### Goal
Add a second, deeper layer of value for non-crisis use.

### Product Features
- longer-form parenting guidance
- pattern discussion
- planning for tomorrow
- routine building
- debrief after hard moments
- prep scripts before predictable challenges

### Difference from Hard Moment Mode
Hard Moment Mode is:

- short
- immediate
- directive

Coach Mode is:

- reflective
- explanatory
- planning-oriented

### Success Criteria
- parents use Sturdy outside crises
- premium value increases
- app becomes part of everyday parenting workflow

---

## Business Roadmap

### Early Monetization
- free tier with limited script generations
- premium tier with unlimited use
- premium includes saved scripts and deeper chat

### Later Monetization
- premium insights
- coach mode
- family plan
- clinician / educator partnerships
- enterprise or B2B2C channels

---

## Technical Roadmap

### Immediate Priorities
- auth
- child profiles
- script generation
- safety flow
- storage
- response validation

### Next Technical Priorities
- conversations API
- saved script API
- subscription sync
- schema validation with Zod
- better error handling
- analytics events

### Later Technical Priorities
- summarization pipeline
- retrieval for child behavior memory
- streaming
- background jobs
- admin tools
- experiment framework for prompt versions

---

## Design Roadmap

### Immediate
- calm and sturdy visual style
- readable scripts
- minimal typing
- low-friction navigation

### Next
- polished onboarding
- better chat UI
- child-switching flow
- premium paywall polish
- empty state improvements

### Later
- visual pattern summaries
- insight cards
- proactive suggestions
- voice-first interaction design

---

## Safety Roadmap

### Current
- keyword-based safety detection
- emergency-first response path

### Next
- stronger classifier-based safety detection
- better self-harm / violence detection
- improved urgent-care routing

### Later
- escalation policy review
- safety auditing
- specialized safety prompts
- support resource localization

---

## What Not to Build Too Early

To keep Sturdy strong, avoid shipping these too early:

- open-ended general chatbot behavior
- overly long responses
- too many educational paragraphs
- complex dashboards before script usefulness is proven
- too much customization before core retention is visible

The product should stay focused on its strongest promise:

**fast, grounded, practical support for hard moments**

---

## Milestone Summary

### Milestone 1
Parent can sign up, create a child profile, and get a useful script.

### Milestone 2
Parent can return, review conversations, and save scripts.

### Milestone 3
Parent can have lightweight follow-up chat.

### Milestone 4
Parent gets better support because Sturdy remembers what works for their child.

### Milestone 5
Parent receives insights and proactive guidance.

---

## North Star

The long-term goal is not just to answer parenting questions.

The long-term goal is to make parents feel:

- calmer
- more capable
- less alone
- more prepared

Sturdy succeeds when it becomes the first tool a parent reaches for in a hard moment — because it is fast, trustworthy, and feels like it understands their child.