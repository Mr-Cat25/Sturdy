DESIGN.md

Sturdy Design System
Design Philosophy
Sturdy is designed to support parents during high-stress moments.
The interface must feel:
• calm
• clear
• supportive
• fast to use
The UI should never feel like a chatbot.
Instead it should feel like a structured parenting tool that gives clear guidance.
Primary design principles:
• Speed over complexity
• One clear action per screen
• Large readable text
• Minimal visual noise
• Practical language over explanations
The product experience should feel like:
“A calm guide that tells you what to say next.”
Product Navigation
Bottom navigation structure:
Now | History | Saved | Child 
Now
Immediate help for current parenting moments.
History
Past conversations and scripts.
Saved
Reusable scripts parents found helpful.
Child
Child profile and behavioral insights.
Core Screens
1. Welcome Screen
Purpose: introduce the product simply.
Layout:
STURDY Support for hard parenting moments [ Get Started ] Already have an account? Sign in 
2. Child Profile Setup
Child profile data personalizes AI responses.
Fields:
Child Name Age Range 2–4 5–7 8–12 Neurotype (optional) ADHD Autism Anxiety Sensory 
3. Home Screen (Now)
This is the main entry point.
Example layout:
Good evening What’s hard right now? [ Describe what’s happening ] Quick situations Leaving Bedtime Hitting Sibling conflict Refusing to listen Recent conversations Leaving the park Bedtime meltdown 
Goals:
• reduce typing
• allow immediate support
• show past usage
4. Hard Moment Input
Simple message input.
Alex • Age 6 What’s happening right now? [ My child won't leave the park ] 
5. Script Result Screen
This is the core product screen.
Layout:
Situation Leaving the park is overwhelming because the activity suddenly stops. Parent tone Low voice. Few words. REGULATE Do Take one breath and move closer. Say "I’m here. I won’t let you hit." CONNECT Do Name the feeling. Say "You really wanted to stay." GUIDE Do Set the limit and next step. Say "We are leaving now. Hold my hand." Avoid saying • Stop this right now • You're embarrassing me 
Footer actions:
Did this help? 👍 Yes 👎 Not really Save script Shorter version Public place version 
6. Conversation History
Today Leaving the park Bedtime meltdown Yesterday Morning refusal Last week Sibling conflict 
Purpose:
• review past scripts
• continue conversations
7. Saved Scripts
Reusable scripts parents rely on frequently.
Example:
Saved Scripts ⭐ Bedtime script ⭐ Leaving the house ⭐ Morning routine 
8. Child Profile Screen
This screen stores learning about the child.
Example:
Alex Age 5–7 ADHD Common hard moments Leaving activities Bedtime transitions What has helped Countdown warnings Two clear choices Things to avoid Long explanations during escalation Sudden transitions 
9. Child Insights (Future)
Insights are generated from past interactions.
Example:
Insights for Alex Most common trigger Transitions Strategies that worked Countdown warnings Offering two choices Suggestion Give a five minute warning before leaving the park. 
Design System
Colors
Primary palette:
Background
#F7F3EC
Paper
#FFFDF9
Primary
#3C5A73
Text
#1E2430
Secondary text
#4B5563
Accent colors:
Sage
#7C9A87
Amber
#D9A441
Clay
#C98B6B
Danger / Safety
#B85C4B
Typography
Typography must prioritize readability.
Headline
large and calm
Body
medium weight
Script text
slightly larger than body
Parents must be able to read scripts quickly during stressful moments.
Component System
Core components used throughout the app:
Script Card
Displays Regulate / Connect / Guide content.
Action Chips
Used for quick situations like:
Leaving
Bedtime
Hitting
Feedback Bar
Captures whether a script helped.
Pattern Card
Displays known child triggers and strategies.
Safety Banner
Displayed when safety escalation occurs.
UX Rules
The interface must follow these rules:
• never overwhelm the user
• prioritize large readable scripts
• keep explanations minimal
• always show a clear next step
• minimize typing
• make scripts easy to read aloud
Long-Term UX Goal
Over time Sturdy should feel like it knows the child.
Parents should feel:
“This app understands my kid.”
This happens through:
• saved scripts
• conversation history
• behavioral pattern memory
• personalized insights