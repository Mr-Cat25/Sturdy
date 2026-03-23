# Sturdy Dashboard Spec v2

## Purpose
The Dashboard is Sturdy’s main landing surface after onboarding and sign-in. It must do two jobs at once:

1. help parents get support fast in a hard moment
2. convert skeptical parents by showing that Sturdy is personal, practical, and worth paying for

This is **not** a business-style dashboard.  
This is a **conversion-first support hub**.

---

## Product Goal
When a parent lands on Dashboard, they should immediately feel:

- this is built for real parenting moments
- this is fast and easy to use
- this feels personal to my child
- this is more useful than a generic chatbot
- I can trust this enough to try it now

---

## Core Dashboard Jobs
The Dashboard must:

- orient the parent
- make the main action obvious
- show active child context
- show free trial usage clearly
- reduce friction into SOS support
- hint at deeper value inside Profile and paid features

---

## Positioning Standard
The Dashboard should feel:

- calm
- premium
- warm
- structured
- emotionally safe
- useful within seconds

It should **not** feel:

- corporate
- analytics-heavy
- cluttered
- like a generic AI chat app
- childish
- overly clinical

---

## New Top-Level Tab Structure
Use 3 tabs:

- Dashboard
- Profile
- Account

### Dashboard
Help me now.

### Profile
My child, saved scripts, and history.

### Account
Settings, legal, plan, sign out.

---

## Dashboard Content Hierarchy
Top to bottom:

1. Greeting
2. Free support / script allowance card
3. Active child summary or Add child state
4. SOS hero card
5. Quick situations
6. Optional small continuity preview

This order is intentional.  
The top half of the screen should build trust and drive action.

---

## Section 1 — Dynamic Greeting
### Purpose
Make the product feel human and personal immediately.

### Content
Dynamic by time of day:

- Good morning, Olivia’s parent
- Good afternoon, Olivia’s parent
- Good evening, Olivia’s parent

Fallback if no active child:

- Good evening
- Ready for support?

### Supporting line
Use a short line under the greeting:

- How can Sturdy support you today?

or

- Calm, practical support for hard moments.

### Design notes
- Large, warm heading
- Strong but readable typography
- This should feel like an emotional welcome, not marketing copy

---

## Section 2 — Free Support Card
### Purpose
Show trial value clearly and reduce purchase skepticism.

### Why it matters
A skeptical parent is more likely to try Sturdy if the free support is visible and feels generous.

### Content
For free users:

- Your free support
- 3 of 5 scripts remaining

Alternative label:

- Free scripts
- 3 of 5 remaining

### Optional secondary action
Later, small link only:

- Unlock unlimited

### Design notes
- Compact premium card or pill-card
- Must feel supportive, not restrictive
- Avoid making it look like a paywall warning

### Product rule
Frame this as included support, not scarcity first.

---

## Section 3 — Active Child Summary / Add Child
### Purpose
Make personalization visible and actionable.

### If child exists
Show:

- Olivia · Age 4
- small helper: Active child
- action: Manage in Profile

### If no child exists
Show:

- No child added yet
- helper: Add a child so Sturdy can tailor support to the right age.
- CTA: Add child

### Why it matters
Parents need to feel that Sturdy is tailored to their child, not producing generic advice.

### Design notes
- Compact card or elevated row
- Keep it visible high on the screen
- Do not make this section too large

---

## Section 4 — SOS Hero Card
### Purpose
This is the main action and emotional anchor of the Dashboard.

### Content
**Title**  
SOS

**Subtitle**  
For hard moments right now

**Body**  
Get calm, practical words you can use right away.

**Primary CTA**  
Start SOS

### Why this matters
This section must convert hesitation into action.  
It should feel immediate, trustworthy, and useful.

### Design notes
- Largest and strongest element on the screen
- Strong contrast while staying warm and premium
- Rounded, confident card
- CTA should feel obvious and high-trust
- This should be the first thing a stressed parent wants to tap

### UX notes
Tapping the card or CTA should go straight into the SOS / hard-moment flow.

---

## Section 5 — Quick Situations
### Purpose
Reduce thinking and help parents start fast.

### Suggested chips
- Bedtime
- Leaving the park
- Sibling conflict
- Public meltdown

Optional later additions:
- Morning rush
- Homework refusal
- Screen time battle

### Why it matters
In stressful moments, typing from scratch is harder.  
Quick chips reduce friction and make the app feel practical.

### Design notes
- Short row or wrapped chip layout
- Clear, large tap targets
- Calm styling, not noisy

### UX notes
Tapping a chip should route into SOS with the situation prefilled later.  
For now, it can route into the SOS flow entry.

---

## Section 6 — Optional Continuity Preview
### Purpose
Show that Sturdy is more than one-time help.

### Recommended approach
Keep this small for now.  
Only one small preview area should appear below the main action zone.

Possible content:
- 1–2 recent supports
- or a small “For Olivia” support preview
- or a light “Saved support in Profile” teaser

### Why it matters
This helps skeptical parents see that the product has depth and continuity.

### Design notes
- Do not let this compete with SOS
- Keep it subtle and secondary
- This is a trust/retention signal, not a main action

---

## Visual Hierarchy
### Most important
- SOS hero card

### Second most important
- greeting
- free support card

### Third
- active child / add child state
- quick situations

### Fourth
- continuity preview

This hierarchy should feel obvious at a glance.

---

## Conversion Strategy Built Into the Dashboard
The Dashboard should answer skeptical-parent objections without long explanations.

### Objection 1
Is this actually useful?

**Answer through design:**  
SOS is clear, immediate, and specific.

### Objection 2
Is this generic AI fluff?

**Answer through design:**  
Child context is visible. The product feels structured and personal.

### Objection 3
Why would I pay for this?

**Answer through design:**  
Free support is visible, and continuity hints suggest deeper value beyond one script.

### Objection 4
Will this help in a real hard moment?

**Answer through design:**  
Quick situations and SOS framing make the app feel practical, not theoretical.

---

## Dashboard Copy Set
### Greeting fallback
Good evening

### Greeting with child
Good evening, Olivia’s parent

### Support line
How can Sturdy support you today?

### Free card
Your free support  
3 of 5 scripts remaining

### Child state
Olivia · Age 4  
Manage in Profile

### Empty child state
No child added yet  
Add a child so Sturdy can tailor support to the right age.  
Add child

### SOS hero
SOS  
For hard moments right now  
Get calm, practical words you can use right away.  
Start SOS

### Quick situations title
Quick situations

---

## UX Rules
- The Dashboard must work well under stress
- One main action should always dominate
- No dense utility grids
- No analytics widgets
- No script monitor on Dashboard
- No long explanations
- Child personalization must be visible
- Free trial must feel supportive, not punishing

---

## What Not To Put on Dashboard
Do not include:

- usage charts
- analytics
- script monitor
- legal links
- dense settings
- too many secondary cards
- long marketing paragraphs
- too many equal-weight buttons

These weaken clarity and reduce conversion.

---

## Relationship to Other Tabs
### Profile
Profile should hold:
- child list / switcher
- add child
- saved scripts by child
- history by child

### Account
Account should hold:
- email/account info
- plan status
- legal
- sign out
- settings later

Dashboard should not try to absorb those responsibilities.  
It should stay focused on trust + action.

---

## Recommended MVP Dashboard Version
For the first implementation, build:

1. dynamic greeting
2. free support card
3. active child or add child card
4. SOS hero card
5. quick situations chips

Optional for slightly later:
6. small continuity preview

This keeps the Dashboard engaging without becoming cluttered.

---

## Why This Version Converts Better
This dashboard design works because it combines:

- personalization
- low-friction trial framing
- urgency support
- visible structure
- product depth hints

It helps skeptical parents feel:
- understood
- safe trying the product
- clear on what to do next
- curious about the paid value later

---

## Future Premium Hooks Worth Supporting Later
The Dashboard can later hint at premium value through:

- unlimited SOS support
- saved support library
- child-specific memory
- script variations
- follow-up guidance after the moment
- co-parent sharing
- voice/read-aloud support

These should be hinted at lightly, not overloaded into the first Dashboard build.

---

## Final Standard
If a skeptical parent opens Sturdy, the Dashboard should feel:

- personal
- calm
- useful
- trustworthy
- clearly built for real parenting moments

And the next action should be obvious within seconds.
