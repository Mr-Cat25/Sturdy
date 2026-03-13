# Sturdy

**What should I say right now?**

Sturdy is a crisis-first parenting response tool for hard moments.

It helps parents get calm, practical words they can actually use when things escalate — fast.

Sturdy is **not** a generic chatbot.
It is a structured parenting tool built for real-life moments like:

- leaving the park
- bedtime resistance
- sibling conflict
- hitting
- transitions
- refusal

Every response is designed to be:

- calm
- firm
- practical
- easy to say out loud
- human-sounding
- matched to the child’s age and needs

---

## Core Product

Sturdy exists to answer one question:

**What should I say right now?**

The core experience is simple:

1. Parent describes the hard moment
2. Sturdy checks for safety risk
3. Sturdy uses the child’s profile and the situation context
4. Sturdy returns a structured response
5. Parent gets words they can use immediately

The response format is:

- **Regulate**
- **Connect**
- **Guide**

This keeps the product predictable, fast, and usable under stress.

---

## Product Philosophy

Sturdy is built around a few core principles:

### Crisis-first
The product is optimized for high-stress parenting moments.
It should load fast, ask very little, and return useful output quickly.

### Literal reflection
Sturdy should reflect the parent’s actual struggle in plain language.
No therapy jargon.
No judgment.
No robotic parenting language.

### Human, not choppy
Sturdy responses should sound like something a calm, capable parent would actually say out loud.

They should feel:
- natural
- spoken
- emotionally aware
- grounded
- situation-matched

They should not feel:
- clipped by default
- robotic
- emotionally flat
- blog-like
- overly clinical

The goal is not just short output.
The goal is **usable human language**.

### Structured, not open-ended
Sturdy is not meant to behave like a broad AI assistant.
It should return focused, usable scripts instead of long conversations or essays.

### Exact-age and neurotype aware
Responses should adapt to the child’s actual profile.

That includes:
- exact age
- neurotype
- preferences
- communication needs

### Safety-aware
If a message suggests immediate danger, medical urgency, or loss of control, Sturdy should stop normal script generation and switch to a safety-first response.

---

## Current MVP Scope

The current MVP is focused on **Hard Moment Mode**.

### MVP goals

- parent can sign up
- parent can create a child profile
- parent can describe a situation
- parent receives a useful structured script
- response feels calm, clear, human, and practical
- data is stored safely

### MVP features

- authentication
- child profiles
- exact age support
- neurotype support
- structured AI script generation
- hard moment mode
- safety escalation path
- conversation persistence
- mobile script display

---

## Surfaces

Sturdy has two surfaces:

### 1. Mobile app
This is the actual product.

The mobile app is where parents will:

- sign in
- create child profiles
- describe hard moments
- get scripts
- review previous conversations
- save useful scripts later

### 2. Web landing page
This is the marketing and conversion surface.

The web app is used to:

- explain the product clearly
- show the value fast
- convert visitors
- support Google Play install traffic

The web experience may feel chat-like, but the product itself is still a structured response tool — not a generic chatbot.

---

## How Sturdy Works

```text
Parent describes the moment
        ↓
Safety check
        ↓
Child context lookup
        ↓
Prompt assembly
        ↓
AI generates structured JSON
        ↓
Response validation
        ↓
Return script:
Regulate → Connect → Guide

Example Output Shape
JSON

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
    "Keep the language calm and direct.",
    "Do not over-explain during escalation."
  ],
  "safety_escalation": false
}
Tech Stack
Product stack
React Native / Expo mobile app
Supabase Auth
Supabase Postgres
Supabase Edge Functions
OpenAI for structured generation
Current repo direction
apps/web → marketing / landing page
apps/mobile → planned mobile app surface
supabase/ → schema, functions, backend logic
docs/ → product, UX, architecture, safety, prompts
Architecture Principles
Edge Functions are the orchestration layer
Sturdy does not send raw user input directly to the model and return whatever comes back.
Instead, the backend should:
validate the user
load child context
classify safety risk
build the prompt
call OpenAI
validate the output
store the result
return structured JSON
The model does not own product logic
AI generation happens inside a controlled pipeline. That is what keeps Sturdy consistent and reliable.
Human quality is a system requirement
The prompt system should not optimize for short output alone.
It should optimize for:
natural spoken language
emotional completeness
literal reflection of the situation
concise but human responses
Short is useful. Choppy is not.
Child Context Principle
Sturdy should adapt responses using the child’s actual profile, not only broad age bands.
The child profile should support:
exact age
neurotype
preferences
optional notes
The system should support individual ages from:
2 to 17
This matters because a script for a 2-year-old should not sound like a script for a 4-year-old, and a script for a 15-year-old should not sound like a script for a preschooler.
Broad developmental groupings can still help internally, but the final response should be shaped by the child’s exact age.
Safety Principles
Sturdy must always prioritize safety over normal script generation.
If a message suggests:
medical emergency
immediate danger
a parent may lose control
a child may be seriously hurting others
self-harm or severe crisis language
then the system should return a safety-first response instead of a normal parenting script.
The safety pipeline includes:
rules filter
risk classification
policy routing
constrained generation
output validation
safe fallback response
safety event logging
Product Positioning
Sturdy is best described as:
a crisis-first parenting response tool for hard moments
Not:
a generic AI chatbot
a parenting blog
a therapy app
a long-form coaching platform
The product promise is:
fast, grounded, practical support for hard moments
Roadmap Direction
Phase 1
Hard moment MVP:
auth
child profiles
script generation
safety flow
storage
response validation
Phase 2
Better usability:
conversation history
saved scripts
retry / regenerate
improved loading and error states
premium path beginnings
Phase 3+
Longer-term value:
lightweight follow-up chat
child behavior memory
saved script library
insights
voice and accessibility improvements
future reflection / coach mode
Repository Structure
Plain text
Copy code
apps/
  web/                  # marketing / landing page

supabase/
  migrations/           # database schema
  functions/            # edge functions

docs/
  ARCHITECTURE.md
  DATABASE_SCHEMA.md
  DESIGN.md
  PROMPT_SYSTEM.md
  RESPONSIVE_UX.md
  ROADMAP.md
  SAFETY_SYSTEM.md
  STURDY_MASTER_BLUEPRINT.md
  UI_SPEC.md
Current Priority
The current priority is to build the first usable MVP path:
child profile
→ parent enters hard moment
→ edge function runs
→ structured script returns
→ conversation is stored
This is the core milestone that proves the product.
What Not To Build Too Early
To keep Sturdy strong, avoid drifting into:
generic open-ended chatbot behavior
overly long responses
emotionally flat scripts
clipped, robotic wording
heavy dashboards
too much customization before usefulness is proven
deep reflection mode before hard-moment speed is working
The strongest version of Sturdy stays focused on the immediate moment.
Status
This repo is currently in early build stage.
Current focus:
locking product positioning
tightening docs
improving the prompt system
moving from broad age bands toward exact age adaptation
building the first Supabase schema
wiring the chat-parenting-assistant Edge Function
evolving the web landing page into a clear conversion surface
preparing the mobile app flow
Guiding Standard
If a stressed parent opens Sturdy in a hard moment, the product should feel:
fast
calm
clear
grounded
human
useful within seconds
That is the standard the rest of the build should serve.
