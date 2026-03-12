# Sturdy Responsive UX Specification

## Purpose

This document defines how Sturdy should behave across device sizes, orientations, accessibility settings, and interaction states.

`UI_SPEC.md` defines what screens contain.  
`RESPONSIVE_UX.md` defines how those screens adapt and feel in real use.

The goal is to ensure Sturdy is:

- fast under stress
- easy to read
- easy to tap
- consistent across devices
- calm and responsive

---

# Core UX Principle

Sturdy is a crisis-first product.

That means responsive behavior is not only about screen size. It is also about:

- reducing friction
- reducing delay
- reducing visual overload
- preserving clarity under stress

A responsive Sturdy experience should always answer:

**Can a stressed parent use this quickly, clearly, and comfortably on this device?**

---

# Supported Device Classes

Sturdy should be designed mobile-first, then expanded for larger layouts.

## Device Tiers

### Tier 1 — Small Phones
Examples:
- older iPhones
- smaller Android phones

Approx width:

```text
320–374px
Priority:
compact spacing
larger tap targets
shorter visible content chunks
fewer side-by-side layouts
Tier 2 — Standard Phones
Examples:
most modern iPhones
most modern Android phones
Approx width:
Text
Copy code
375–428px
Priority:
default design target
full primary layout
full-size script cards
comfortable reading width
Tier 3 — Large Phones / Foldables
Approx width:
Text
Copy code
429–600px
Priority:
preserve readability
avoid stretching content too wide
allow larger cards without increasing text density
Tier 4 — Tablets
Approx width:
Text
Copy code
601px+
Priority:
use centered content columns
do not simply scale phone layouts
maintain calm reading width
optionally use split layouts where helpful
Layout Rules by Device Size
Small Phones
Layout Behavior
use single column only
keep horizontal padding tighter
reduce decorative spacing before reducing text size
stack all actions vertically if needed
Padding
Text
Copy code
Horizontal: 16px
Vertical screen padding: 20px
Card padding: 16px
Typography Rule
Do not shrink scripts too aggressively. Script readability matters more than fitting everything above the fold.
Button Rule
Buttons should remain full width.
Standard Phones
Layout Behavior
single column
default app layout
script cards use full available width
Padding
Text
Copy code
Horizontal: 24px
Vertical screen padding: 24px
Card padding: 20px
Large Phones
Layout Behavior
still primarily single column
increase breathing room slightly
keep max readable content width constrained
Max Content Width
Text
Copy code
560px
If the screen is wider, content should be centered rather than stretched edge to edge.
Tablets
Layout Behavior
Tablet layouts should not look like enlarged phones.
Use one of these patterns:
Pattern A — Centered Single Column
Best for:
onboarding
child profile setup
script result view
Text
Copy code
Max content width: 640px
Centered horizontally
Pattern B — Split Layout
Best for:
conversation history + conversation detail
child profile + insights
saved scripts + preview
Example:
Text
Copy code
Left rail: 280–320px
Right content: flexible
Gap: 24px
Tablet Rules
avoid ultra-wide lines of text
preserve script readability
keep action buttons visible without crowding content
Safe Area Rules
All screens must respect:
top notches
bottom home indicators
Android navigation bars
foldable insets where applicable
Rules
use safe-area-aware containers on every full screen
bottom CTA buttons should never sit flush against the screen edge
sticky bottom actions must include safe area padding
top headers must not collide with notches
Vertical Flow Rules
Sturdy is text-heavy in critical moments, so vertical rhythm matters.
Screen Rhythm
Use consistent vertical spacing increments:
Text
Copy code
4px
8px
12px
16px
24px
32px
48px
Preferred Defaults
between page sections: 24px
between card title and body: 8px
between body text and script text: 12px
between stacked cards: 16px
Reading Width Rules
Readable width matters more than maximizing screen fill.
Text Width Limits
For body and script content:
Text
Copy code
Ideal readable width: 36–42 characters per line for script-heavy sections
Maximum comfortable width: ~65 characters per line
On wide devices, cards should be centered with width constraints.
Scroll Behavior
Scrolling should feel predictable and calm.
General Rules
every content-heavy screen must scroll vertically
no nested vertical scroll areas unless absolutely necessary
avoid horizontal scroll except for chips
the main action area should appear early in the scroll
Script Result Screen
The script result screen must:
show the situation and first script section quickly
keep the parent from feeling “lost in content”
avoid large blank spaces before the response begins
History Screens
use lazy loading / pagination for long lists
preserve scroll position when returning to a conversation list
Interaction Design
Sturdy should feel responsive without feeling flashy.
Button Feedback
All tappable components should provide:
pressed-state opacity or color shift
optional haptic feedback on key actions
clear disabled states
Recommended Haptics
Use subtle haptics for:
successful save
script generated
feedback submitted
switching tabs
Do not use strong or frequent haptics in a crisis flow.
Motion Guidelines
Motion should reassure, not distract.
Principles
short and subtle
never playful
never bouncy
never slow down urgent flows
Recommended Motion
fade in script cards
subtle slide-up for bottom sheets
soft loading shimmer or skeletons
instant chip selection feedback
Avoid
long transitions
excessive animation chaining
distracting hero animations
delayed CTA appearance
Reduced Motion
If reduced motion is enabled:
remove non-essential animations
shorten transition durations
prefer simple opacity changes
Input UX Rules
Parents may be stressed, rushed, or using one hand.
Text Inputs
use large multiline fields for hard-moment input
keep placeholder copy practical
preserve typed input during accidental navigation if possible
Keyboard Handling
input fields must stay visible above the keyboard
primary CTA must remain reachable
use keyboard-safe layouts for small phones
scroll to focused field when needed
Suggested Placeholder Copy
Examples:
“My child is screaming because we have to leave the park.”
“My daughter is hitting because I said no more TV.”
Action Density Rules
Never show too many actions at once.
Primary Rule
Each screen should have:
one main action
up to three supporting actions
optional secondary links below
On the Script Screen
Recommended priority:
Save Script
Shorter Version
Public Place Version
Any additional actions should go behind a menu or secondary surface.
Quick Chip Behavior
Quick chips reduce typing and improve engagement.
Chip Rules
chips can scroll horizontally
chips should wrap on larger screens if appropriate
selected chips should have strong contrast
chips should always be tappable with one thumb
Minimum Touch Target
Text
Copy code
44x44px
This applies to chips, buttons, icons, and tabs.
Bottom Navigation Rules
Bottom nav is the main app anchor.
Tabs:
Text
Copy code
Now
History
Saved
Child
Rules
always visible on core app screens
use clear labels, not icon-only tabs
keep tab count at four
active tab must have high contrast
support safe area padding on bottom devices
Tablet Note
On tablet, bottom nav may become a side rail if needed later.
Loading State Guidelines
Loading states strongly affect perceived quality.
General Rule
Never leave the user looking at a blank screen without context.
Preferred Loading Patterns
App startup
simple calm splash
no spinner-only dead space if avoidable
Script generation
Show:
parent message
“Sturdy is building your script...”
subtle loading treatment
Lists
Use:
skeleton cards
shimmer placeholders
or labeled loading blocks
Avoid tiny indefinite spinners as the only signal.
Empty State Guidelines
Every empty state should tell the user what to do next.
History Empty State
Example:
“No conversations yet.”
“Start with what’s hard right now.”
Saved Scripts Empty State
Example:
“No saved scripts yet.”
“Save helpful scripts so they’re easy to reuse.”
Child Insights Empty State
Example:
“Insights will appear after a few conversations.”
Error State Guidelines
Errors must be calm and actionable.
Rules
explain what happened in plain language
provide one recovery action
do not dump technical jargon into the UI
Example
Bad:
“Function invocation failed.”
Good:
“We couldn’t generate a script right now.”
“Try again.”
Accessibility Standards
Sturdy must be highly accessible.
Text
support dynamic type / larger text sizes
avoid hard-coded clipped layouts
preserve readability under font scaling
Contrast
body text should meet accessible contrast standards
script text should have especially strong contrast
avoid low-contrast muted text for key guidance
Touch Targets
Minimum:
Text
Copy code
44x44px
Screen Readers
All key elements need labels:
buttons
tabs
chips
save actions
feedback controls
Focus Order
Focus order should match visual hierarchy.
Large Text Behavior
When accessibility font scaling is enabled:
Rules
cards should expand vertically
buttons may wrap text if needed
avoid truncating scripts
tabs may shorten only as a last resort
keep core action readable without overlap
One-Handed Use Rules
Many users will use Sturdy one-handed while managing a child.
Design Implications
keep primary actions low enough to reach
avoid tiny controls in far top corners for critical actions
key actions should not depend on two-handed precision
Best Practice
Use sticky bottom action areas for critical actions on longer screens if needed.
Script Screen Optimization
This is the most important screen in the product.
Priority Order
Situation summary
Parent tone
Regulate
Connect
Guide
Avoid saying
Notes
Feedback
Secondary actions
Why
The parent should reach the useful language immediately.
Responsive Behavior
cards stack vertically on all phones
on tablets, actions may appear in a right-side utility column
keep “Say” text visually stronger than “Do” text
History Screen Optimization
Phones
simple grouped list
open conversation on tap
Tablets
Use split view:
left: conversation list
right: selected conversation detail
This reduces friction and improves browsing.
Saved Scripts Optimization
Phones
stacked cards
optional search at top
filters in a horizontal chip row
Tablets
list on left
selected script preview on right
Child Screen Optimization
This screen becomes more valuable over time.
Layout Priority
Child identity
common triggers
what works
things to avoid
insights
Device Rule
On tablets, “what works” and “things to avoid” can sit side by side.
Performance Guidelines
Responsiveness is also performance.
Rules
keep first screen lightweight
defer non-critical data loads
paginate long histories
cache recent child data
minimize large image use
avoid unnecessary re-renders in chat/history flows
Perceived Performance
The product should feel fast even when generation takes a moment.
Use:
visible progress states
message echo before AI completion
skeleton content instead of blank waiting
Offline / Weak Network Behavior
Hard-moment tools should degrade gracefully.
Rules
detect offline state
show a clear offline message
allow access to saved scripts offline if possible
never silently fail on send
Ideal Future Behavior
If offline:
open saved scripts
show cached recent scripts
preserve unsent user text
Device Testing Matrix
At minimum, Sturdy should be tested on:
Small Phone
Text
Copy code
iPhone SE size / small Android
Standard Phone
Text
Copy code
iPhone 13/14/15 class
Pixel / Samsung standard phone
Large Phone
Text
Copy code
Pro Max / Plus class
Tablet
Text
Copy code
iPad portrait and landscape
Android tablet
Key States to Test
keyboard open
large text enabled
reduced motion enabled
dark environment visibility
poor network
long script output
long child names
multiple neurotype tags
Quality Checklist
A screen is not ready unless it passes these checks:
Is the main action obvious?
Is the text readable under stress?
Can the screen handle smaller phones?
Can it handle larger text?
Are touch targets large enough?
Does it avoid visual clutter?
Does it feel fast?
Is the next step clear?
Final Principle
Responsive UX in Sturdy is not about making layouts merely “fit.”
It is about preserving the product promise on every device:
fast, calm, practical parenting support in hard moments
Copy code