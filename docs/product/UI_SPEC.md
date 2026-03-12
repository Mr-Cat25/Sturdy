UI_SPEC.md

Sturdy UI Specification
Purpose
This document defines the exact UI structure for the Sturdy mobile app.
It specifies:
• screen hierarchy
• component structure
• layout rules
• spacing
• typography
• color usage
• UI copy
The goal is to ensure designers and engineers build a consistent and calm experience optimized for parents in stressful moments.
Design Goals
The interface must feel:
• calm
• fast
• trustworthy
• readable under stress
The product should not feel like a chatbot.
Instead, it should feel like a structured parenting tool.
Layout System
All screens follow a consistent layout grid.
Base Grid
Mobile width: 390px Padding: 24px horizontal Vertical rhythm: 16px increments 
Spacing Scale
4px 8px 12px 16px 24px 32px 48px 
Spacing should use these values only.
Typography
Font hierarchy
Headline
Size: 28 Weight: Bold Line height: 34 
Section title
Size: 18 Weight: Semibold 
Body text
Size: 16 Weight: Regular 
Script text
Size: 18 Weight: Medium Line height: 26 
Scripts must be easy to read quickly.
Color System
Base
Background
#F7F3EC 
Card surface
#FFFDF9 
Primary text
#1E2430 
Secondary text
#4B5563 
Brand
Primary
#3C5A73 
Sage accent
#7C9A87 
Amber accent
#D9A441 
Clay accent
#C98B6B 
Danger
#B85C4B 
Component Library
These components should be reusable.
Button
Primary button
Height:
48px 
Border radius
12px 
Style
Background: Primary Text: White 
Label example
Get Script Continue Save Script 
Action Chip
Used for quick situations.
Height
36px 
Example chips
Leaving Bedtime Hitting Sibling conflict 
Style
Background: light gray Border radius: 18px Padding: 12px horizontal 
Script Card
Used for Regulate / Connect / Guide sections.
Layout
Padding: 20px Border radius: 16px Background: card surface Shadow: subtle 
Structure
Section title Action Say 
Feedback Bar
Displayed after script.
Layout
Did this help? 👍 Yes 👎 Not really 
Spacing
16px between buttons 
Screen Specifications
Screen 1 — Welcome
Purpose: introduce the product.
Layout
Logo Headline Support for hard parenting moments Primary button Get Started Secondary link Sign In 
Spacing
Top padding: 120px Elements spaced by 24px 
Screen 2 — Child Profile Setup
Fields
Child Name Age Range 2–4 5–7 8–12 Neurotype ADHD Autism Anxiety Sensory 
Primary action
Continue 
Screen 3 — Home (Now)
Top section
Greeting What’s hard right now? 
Primary input
Describe what’s happening 
Quick situations
Leaving Bedtime Hitting Sibling conflict Refusing to listen 
Recent conversations
Leaving the park Bedtime meltdown Morning refusal 
Screen 4 — Hard Moment Input
Header
Alex · Age 6 
Prompt
What’s happening right now? 
Input field
Multiline text input.
Button
Get Script 
Screen 5 — Script Result
This is the most important screen.
Structure
Situation summary Parent tone Regulate Action Script Connect Action Script Guide Action Script 
Example script
"I'm here. I won’t let you hit." 
Below sections
Avoid saying Notes 
Actions
Save script Shorter version Public place version 
Footer
Did this help? 👍 Yes 👎 Not really 
Screen 6 — Conversation History
Grouped by time.
Today Yesterday Last week 
List item structure
Conversation title Timestamp Child name 
Screen 7 — Saved Scripts
List structure
Script title Trigger Child name 
Example
Bedtime script Leaving the house Morning routine 
Screen 8 — Child Profile
Header
Child name Age band Neurotype 
Sections
Common triggers What works Things to avoid 
Screen 9 — Child Insights
Example card
Most common trigger Transitions What helped Countdown warnings Suggestion Try a five minute warning before leaving activities 
Navigation
Bottom navigation bar.
Tabs
Now History Saved Child 
Icons should be simple line icons.
UX Rules
To preserve product clarity:
Do not:
• show long paragraphs
• display large chat walls
• overload screens
• use bright colors excessively
Always:
• highlight scripts clearly
• prioritize readability
• minimize typing
• keep decisions simple
Product Principle
The UI must always reinforce this idea:
Sturdy helps you know what to say next.
That is the core product experience.