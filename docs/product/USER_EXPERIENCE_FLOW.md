Sturdy — User Experience Flow

Overview

Sturdy is designed for high-stress parenting moments.
The experience must be fast, calming, and require minimal thinking from the parent.

Parents should be able to open the app and receive useful guidance in under 10 seconds.

The core question Sturdy answers:

“What should I say right now?”

---

Primary User Flow

This is the most important flow in the product.

Parent experiences a difficult moment
↓
Parent opens Sturdy
↓
Parent describes the situation
↓
Sturdy generates a calm script
↓
Parent uses the script
↓
Parent optionally gives feedback
↓
Sturdy learns what worked

---

Core Screens

The app should remain simple and focused.

Primary navigation includes four main areas:

Now
History
Saved
Child

---

1. Now Screen (Primary Screen)

The Now screen is the main entry point for parents.

Goal: allow the parent to quickly describe the situation.

UI Elements:

- text input
- optional quick tags
- submit button

Example prompt:

«What’s happening right now?»

Example input:

«My child is screaming because we have to leave the park.»

After submission, the request is sent to the backend AI function.

---

2. Script Response Screen

The system generates a structured script.

Every script follows the same format.

Regulate

Short action for the parent.

Example:

«Take one slow breath and move closer.»

Script:

«“I’m here. I won’t let you kick.”»

---

Connect

Name the feeling.

Script:

«“You really wanted to stay.”»

---

Guide

Set the boundary and next step.

Script:

«“We are leaving now. Hold my hand.”»

---

Additional elements on this screen:

- Save script button
- Feedback buttons
- Share option

---

3. Feedback Interaction

After trying the script, parents can respond with:

✓ That helped
✗ That didn’t help

Feedback helps Sturdy learn patterns about the child.

Data recorded:

- situation type
- script used
- parent rating
- timestamp

---

4. Saved Scripts Screen

Parents can save scripts that worked well.

Purpose:

Create a personal library of helpful responses.

Example saved scripts:

- Leaving the park
- Bedtime
- Hitting sibling

Parents can reuse these scripts later.

---

5. Child Profile Screen

Parents create a profile for each child.

Child data may include:

- name
- age range
- neurotype tags
- preferences
- common triggers

Example triggers:

- transitions
- bedtime
- sharing toys

This information helps personalize scripts.

---

6. Conversation History

Parents can revisit previous interactions.

History includes:

- situation description
- script provided
- feedback rating
- timestamp

This allows parents to reflect on past moments.

---

Example Real Usage

Parent at park:

Child refuses to leave.

Parent opens Sturdy and types:

«My child is screaming because we have to leave the park.»

Sturdy responds with a script:

Regulate
“I’m here. I won’t let you hit.”

Connect
“You really wanted to stay.”

Guide
“We are leaving now. Hold my hand.”

Parent uses the script.

Later the parent taps:

✓ That helped

Sturdy records the event and learns.

---

Design Principles

The UX should follow these rules.

Fast

Parents must get help quickly.

Target response time: under 5 seconds.

---

Calm

Language and visuals should feel supportive and steady.

Avoid:

- loud colors
- flashing animations
- long explanations

---

Clear

Scripts should be:

- short
- practical
- easy to say aloud

---

Minimal

Parents should not navigate through complex menus during stressful moments.

Most interactions happen through the Now screen.

---

Long-Term UX Vision

Over time Sturdy evolves from a script generator into a parenting support system.

Future capabilities may include:

- pattern insights
- weekly child behavior summaries
- proactive suggestions
- routine building support

These features should appear gradually without complicating the core experience.