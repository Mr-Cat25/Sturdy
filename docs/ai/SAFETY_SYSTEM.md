SAFETY_SYSTEM.md

Sturdy Safety System
Purpose
Sturdy provides AI guidance during difficult parenting moments.
Because these moments may involve stress, anger, injury, or crisis, the system must include strong safety protections.
This document defines the safety architecture used to:
• detect dangerous situations
• prevent harmful AI responses
• route conversations to the correct safety flow
• ensure calm and responsible guidance
• protect both parents and children
The safety system must operate before, during, and after AI generation.
Safety Design Principles
Sturdy safety responses must always be:
• calm
• non-judgmental
• brief
• supportive
• focused on immediate safety
The system must never accuse or shame the parent.
Example to avoid:
"You are being abusive."
Correct tone example:
"This sounds like a very intense moment. Let's focus on safety first."
Safety Architecture Overview
Sturdy uses a multi-layer safety pipeline.
Parent message ↓ Rules filter ↓ Risk classifier ↓ Policy router ↓ Response generation ↓ Output safety check ↓ Safe fallback if needed ↓ Response returned ↓ Safety event logging 
Each stage prevents unsafe or inappropriate responses.
Layer 1 — Rules Filter
The first layer performs a fast keyword scan to detect obvious danger signals.
Examples of trigger phrases:
hit my child hurt my child kill stab knife bleeding can't breathe not breathing suicide hurt myself hurt themselves weapon choking 
The rules filter is designed to:
• run instantly
• catch obvious emergencies
• reduce unnecessary AI calls
This layer alone is not sufficient; it only catches direct language.
Layer 2 — Risk Classification
After the rules filter, the system performs a deeper classification of the parent message.
The classifier determines the risk level.
Possible classifications:
SAFE ELEVATED_RISK CRISIS_RISK MEDICAL_EMERGENCY 
Example classification cases:
SAFE
"My child won't go to bed."
ELEVATED_RISK
"My child keeps hitting his sister."
CRISIS_RISK
"I feel like I might hit my kid."
MEDICAL_EMERGENCY
"My toddler hit his head and won't wake up."
This classification step allows the system to respond differently depending on severity.
Layer 3 — Policy Router
The router determines which response flow should handle the message.
Available flows:
Normal parenting guidance Safety support guidance Violence escalation support Medical emergency response Refusal / redirect 
Example routing:
Normal parenting guidance
Used for typical parenting struggles.
Safety support guidance
Used when parents express extreme stress or anger.
Violence escalation support
Used when a child may be harming others.
Medical emergency response
Used when a child may be injured or unconscious.
Response Modes
Normal Parenting Mode
Standard Sturdy script.
Structure:
Regulate Connect Guide Avoid saying Notes 
Used when the message is classified SAFE.
Safety Support Mode
Used when a parent may feel overwhelmed or out of control.
Example message:
"I feel like I'm going to lose it."
Example response:
"It sounds like this moment feels overwhelming.
If you feel like you might lose control, try stepping away briefly if your child is safe.
Take a slow breath and give yourself a moment. When you're ready, we can talk through what just happened."
No parenting script is generated in this mode.
Violence Escalation Mode
Used when a child may be harming others.
Example:
"My child keeps choking the baby."
Example response:
"This situation may involve immediate safety risk.
If anyone is in danger, focus first on separating the children and ensuring everyone is safe.
Once the immediate situation is stable, we can talk about ways to handle moments like this."
Medical Emergency Mode
Used when the message suggests serious injury or life-threatening situations.
Examples:
• child not breathing
• unconscious child
• seizure
• severe injury
Example response:
"If your child is not breathing, unconscious, or seriously injured, please contact emergency services immediately.
Medical professionals are best equipped to help in this situation."
AI coaching should not be attempted in these cases.
Layer 4 — Constrained Generation
When a message is safe enough for normal coaching, the AI must still follow strict output rules.
The model must:
• produce short responses
• avoid diagnosis
• avoid medical advice
• avoid legal advice
• avoid blaming language
• avoid therapy-style lectures
• provide practical scripts parents can say
This constraint ensures consistent tone and safety.
Layer 5 — Output Safety Check
After the AI generates a response, it must be validated.
Checks include:
• response structure validity
• prohibited advice
• medical overreach
• harmful parenting advice
• excessive length
• missing required sections
If the response fails validation, it must not be shown to the user.
Layer 6 — Safe Fallback Response
If any stage fails or returns uncertain results, Sturdy must use a safe fallback message.
Example fallback:
"It looks like this situation may involve strong emotions or possible safety concerns.
If anyone may be in immediate danger, please seek emergency assistance.
If you'd like, you can describe what is happening and we can focus on next steps."
Fallback responses protect the system when:
• AI generation fails
• risk classification is uncertain
• responses fail validation
• infrastructure errors occur
Safety Event Logging
Safety-related interactions should be logged for monitoring and improvement.
Suggested database table:
safety_events 
Example schema:
id user_id child_profile_id message_excerpt risk_level policy_route timestamp 
Logs help the team:
• audit system behavior
• identify missed risks
• improve classifiers
• detect recurring crisis situations
Logs must follow privacy and data protection standards.
UI Safety Indicators
When a safety flow activates, the UI should subtly indicate this.
Example header:
⚠ Safety Support
Design guidelines:
• calm visual tone
• avoid flashing or alarming visuals
• avoid bright red panic colors
• maintain readability and trust
Parents using Sturdy may already be stressed; the UI should not increase anxiety.
Rate Limiting and Abuse Prevention
The system should include protections against misuse.
Examples:
• repeated crisis prompts
• automated abuse attempts
• API flooding
• prompt injection attempts
Controls may include:
• request throttling
• abuse detection
• temporary cooldowns
Continuous Safety Improvement
Safety systems should evolve over time.
Future improvements may include:
• improved classifiers
• better escalation language
• localized emergency guidance
• clinician review processes
• expanded safety categories
The system must be regularly reviewed and updated to maintain reliability.
Summary
The Sturdy Safety System includes multiple protection layers:
• rules filter
• risk classification
• policy routing
• constrained generation
• output safety validation
• safe fallback responses
• safety event logging
• UI safety indicators
• abuse protection
This layered architecture ensures Sturdy remains a trustworthy and responsible parenting support tool.