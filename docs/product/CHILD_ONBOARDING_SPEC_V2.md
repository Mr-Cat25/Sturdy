# Child Onboarding Spec v2.1

## Purpose
Child Onboarding is the first personalization step after onboarding or account creation.

Its job is to make Sturdy feel:
- tailored
- thoughtful
- worth trusting

without making the parent feel like they are filling out admin forms.

This screen should help the parent understand:

**“A little context helps Sturdy give me better support for my child.”**

---

## Product Goal
The child onboarding screen should:

- collect only what is needed for MVP personalization
- feel quick and calm
- reduce friction
- support skeptical parents who want proof before effort
- connect clearly to the value of SOS and the Dashboard

---

## MVP Data Rule
For now, child onboarding should collect only:

### Required
- child name
- exact age

### Do not include
- neurotype
- long preferences
- behavior surveys
- parenting style questions
- long notes
- too many setup steps

---

## Positioning Standard
The screen should feel:

- calm
- supportive
- premium
- easy
- parent-friendly
- purpose-driven

It should **not** feel:

- like account admin
- like a medical form
- like school registration
- like too much work before value
- cluttered

---

## Screen Role in the Flow
This screen should be used for:

### First-time child setup
After onboarding or account creation, when the user has no child yet.

### It should not be the same as:
- adding another child later from Profile
- editing an existing child

Long term ownership should be:

- `child-setup.tsx` → first-time onboarding child setup
- `child/new.tsx` → add another child later
- `child/[id].tsx` → edit existing child

---

## Core Message
This screen should communicate:

**“This helps Sturdy tailor support to your child and their age.”**

That is the main reason the screen exists.

---

## Layout Structure
Top to bottom:

1. Progress / orientation
2. Warm title
3. Support line
4. Main setup card
5. Child name field
6. Exact age selector
7. Primary CTA
8. Small reassurance note

---

## Section 1 — Orientation
### Purpose
Reduce uncertainty and show that this is a quick step.

### Options
Simple top label such as:
- Step 3 of 3
- One quick detail before you start
- Personalize your support

### Recommendation
Keep this very light.  
Do not make the screen feel like a long funnel.

---

## Section 2 — Title
### Purpose
Make the screen feel human and direct.

### Recommended title
**Tell us about your child**

Alternative:
**Let’s tailor support for your child**

### Recommendation
Use:
**Tell us about your child**

It is warmer and clearer.

---

## Section 3 — Support Line
### Purpose
Explain why the question matters.

### Recommended copy
**This helps Sturdy tailor support to your child and their age.**

Alternative:
**A few details help Sturdy give you more useful words in hard moments.**

### Recommendation
Use the simpler one first.

---

## Section 4 — Main Setup Card
### Purpose
Keep the form visually focused and easy.

### Card style
- soft elevated card
- rounded corners
- light background
- enough spacing between fields
- should feel like one calm setup step, not many disconnected inputs

---

## Section 5 — Child Name Field
### Purpose
Capture the child identity that makes the product feel personal.

### Field label
**Child name**

### Placeholder
- Olivia
- Your child’s name

### Product rule
This field is required.

### Why
You decided Sturdy should feel personal and directly shaped around the real child, not generic.

---

## Section 6 — Exact Age Selector
### Purpose
Capture the most important personalization input.

### Field label
**Exact age**

### Requirement
This is required.

### Supported range
- 2 to 17

### UX recommendation
Use a control that feels quick and mobile-friendly:
- stepper
- wheel picker
- compact selector
- or a clean horizontal/vertical picker

Do **not** make it feel like a complicated form dropdown if you can avoid it.

### Why exact age matters
This is the core context that changes how scripts should sound.

---

## Section 7 — Primary CTA
### Purpose
Move the parent into the main product quickly.

### Recommended CTA
**Continue**

Alternative:
**Start Dashboard**
**Save and Continue**

### Recommendation
Use:
**Continue**

It is simple and low-pressure.

---

## Section 8 — Reassurance Note
### Purpose
Reduce pressure and increase completion.

### Recommended copy
**You can update this later in Profile.**

This is a strong line because it tells the parent:
- they do not need to get this perfect
- the app is flexible
- setup is not high-stakes

---

## Validation Rules

### If child name is blank
- disable CTA
- show calm inline guidance only when needed

### If age is missing
- disable CTA
- avoid harsh validation too early

### If both are missing
- keep screen calm
- avoid noisy error styling until needed

### CTA rule
Continue is enabled only when:
- child name is provided
- exact age is selected

---

## UX Rules
- child name is required
- exact age is required
- one main card
- one main CTA
- no extra sections
- no secondary setup burden
- no premium upsell here
- no saved/history references here
- no legal/account clutter

---

## Visual Hierarchy
### Most important
- title
- child name field
- age selector
- Continue button

### Secondary
- support line
- card container

### Tertiary
- reassurance note

This should feel effortless at a glance.

---

## Conversion Strategy
This screen should support conversion indirectly by making Sturdy feel more personal.

A skeptical parent is more likely to continue if they understand:
- why this question matters
- that it is quick
- that it improves support quality
- that they do not have to fill out too much

So this screen should answer:

### “Why are you asking this?”
Because it helps tailor support to your child and their age.

### “Do I have to do a lot here?”
No. Just two important details.

### “Can I fix this later?”
Yes.

---

## Recommended Copy Set

### Top orientation
One quick detail before you start

### Title
Tell us about your child

### Support line
This helps Sturdy tailor support to your child and their age.

### Field labels
Child name  
Exact age

### CTA
Continue

### Reassurance note
You can update this later in Profile.

---

## What Not To Include
Do not include:

- neurotype
- diagnosis questions
- saved scripts
- history previews
- account setup details
- extra profile fields
- long explanations
- more than one major CTA
- multiple pages inside this step

---

## Relationship to Dashboard
This screen exists to make Dashboard and SOS feel more personal.

After successful completion, the user should land on:
- Dashboard

And the Dashboard should then feel stronger because it can reflect:
- active child
- exact age
- child-based support context

---

## Relationship to Profile
Profile should later allow:
- editing this child
- adding another child
- switching active child

But Child Onboarding should stay focused on:
- first-time setup only

---

## Recommended MVP Flow
For a new user:

1. Welcome
2. Why Sturdy
3. Account creation / sign-up
4. Child onboarding
5. Dashboard

For a returning user with no child yet:
1. Sign in
2. Child onboarding
3. Dashboard

---

## Final Standard
If the parent lands on this screen, it should feel like:

- one quick, helpful step
- clearly connected to better support
- personal, not generic
- easy to finish
- not like setup busywork

