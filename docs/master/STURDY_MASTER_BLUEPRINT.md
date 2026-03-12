STURDY_MASTER_BLUEPRINT.md
# Sturdy Master Product Blueprint

## Purpose
This document is the master blueprint for the Sturdy product. It consolidates the core concepts behind:

- Product vision
- AI system
- Safety architecture
- User experience
- Data model
- Backend system
- Monetization
- Growth strategy

If other documentation is lost, this file should still contain enough information to rebuild the full product architecture.

## Product Vision
Sturdy is an AI-powered parenting support tool designed for high-stress parenting moments. It provides calm, practical scripts that parents can use immediately when a situation becomes difficult.

Core question Sturdy answers:

> "What should I say right now?"

Common high-stress moments include:

- Tantrums
- Sibling conflict
- Transitions
- Bedtime resistance
- Public meltdowns

Instead of searching the internet or reading long articles, Sturdy delivers short, practical guidance instantly.

## Core Product Principles

### 1) Crisis First
- The product must work quickly in stressful moments.
- Parents should receive helpful guidance within seconds.
- The system should avoid long explanations and focus on actionable scripts.

### 2) Calm and Non-Judgmental
Parents using Sturdy may already feel overwhelmed. The system must:

- Avoid blame
- Avoid therapy jargon
- Avoid lectures
- Maintain a calm tone

### 3) Structured Guidance
Every response follows the same structure:

1. Regulate
2. Connect
3. Guide

This predictable format helps parents quickly understand what to do.

### 4) Personalization
Over time, Sturdy learns patterns about a child:

- Common triggers
- Strategies that work
- Strategies that escalate conflict

This enables gradually improved personalization.

## AI Interaction Model
Sturdy is not designed as a general chatbot. Instead, it generates structured parenting scripts.

Typical interaction flow:

1. Parent describes situation
2. System evaluates safety risk
3. AI generates structured script
4. Parent tries script
5. Parent provides feedback
6. System learns from the interaction

## Response Structure
All AI responses follow the same format:

1. Situation
2. Parent tone
3. Regulate
	 - Action
	 - Script
4. Connect
	 - Action
	 - Script
5. Guide
	 - Action
	 - Script
6. Avoid saying
7. Notes

Example:

- **Situation:** Leaving the park can be overwhelming because a fun activity is ending.
- **Parent tone:** Low voice. Few words.
- **Regulate**
	- **Action:** Take a slow breath and move closer.
	- **Script:** "I'm here. I won't let you kick."
- **Connect**
	- **Action:** Name the feeling briefly.
	- **Script:** "You really wanted to stay."
- **Guide**
	- **Action:** Set the limit and next step.
	- **Script:** "We are leaving now. Hold my hand or I will carry you."

## Safety Architecture
Because the app handles children and difficult situations, safety routing is required. Incoming messages are classified before AI generation.

Classifications:

- `SAFE`
- `ELEVATED_RISK`
- `CRISIS_RISK`
- `MEDICAL_EMERGENCY`

Routing behavior:

- `SAFE` -> normal parenting script
- `ELEVATED_RISK` -> safety support language
- `CRISIS_RISK` -> de-escalation guidance
- `MEDICAL_EMERGENCY` -> emergency recommendation

Emergency example:

> "My child is not breathing."

In this case, the response must direct the user to emergency services rather than generating coaching advice.

## Personalization and Learning
Sturdy learns patterns about each child over time, including:

- Triggers
- Time of day
- Strategies used
- Success ratings

Example pattern:

- Child: Alex
- Age: 6
- Common trigger: transitions
- Effective strategies: countdown warnings, offering choices

Future scripts may reference these patterns.

Example:

> "Last time, countdown warnings helped during transitions."

## Predictive Insights
Instead of claiming to predict behavior, Sturdy provides pattern-based insights.

Examples:

- "Transitions have been difficult recently."
- "Countdown warnings have helped in several recent situations."

These insights help parents prepare for difficult moments.

## Core Product Features

### Hard Moment Mode
Primary feature. Parent describes a current problem and receives a script.

### Saved Scripts
Parents can save scripts that worked well, creating a personal library of helpful phrases.

### Child Profiles
Each child profile contains:

- Age band
- Neurotype tags
- Preferences
- Behavior patterns

### Conversation History
Parents can review previous interactions.

### Feedback System
After each script, parents can indicate whether the script helped. This feedback powers personalization.

### Child Insights
Over time, the system generates insights about:

- Common triggers
- Effective strategies
- Patterns in behavior

## Data Model Overview
Core entities:

- Users
- Child Profiles
- Conversations
- Messages
- Saved Scripts
- Behavior Patterns
- Safety Events
- Subscriptions

Relationships:

- User -> multiple children
- Child -> multiple conversations
- Conversation -> multiple messages

## Backend Architecture
The backend uses Supabase.

Components:

- PostgreSQL database
- Supabase authentication
- Edge Functions for API logic

AI generation occurs within edge functions.

Key function:

- `chat-parenting-assistant`

Responsibilities:

- Validate authentication
- Check safety risk
- Load child context
- Generate AI script
- Store conversation
- Return structured response

## AI Prompt System
The AI system follows strict prompting rules. The prompt includes:

- System identity
- Response structure instructions
- Child profile context
- Conversation context
- Safety restrictions

The AI must generate short, practical scripts.

Avoid:

- Therapy language
- Diagnoses
- Long explanations
- Blame

## User Experience Philosophy
The app should feel calm and supportive.

Design goals:

- Minimal friction
- Fast responses
- Clear scripts
- Minimal text overload

Primary navigation:

- Now
- History
- Saved
- Child

The **Now** screen is the most important. Parents should be able to describe a situation and receive help quickly.

## Visual Design Theme
Sturdy should use calming design elements.

Color palette:

- Primary blue
- Soft neutral background
- Gentle green for positive feedback
- Soft amber for safety alerts

Animations should be subtle. Avoid loud or distracting visuals.

## Monetization Strategy
Sturdy follows a freemium model.

Free plan:

- Limited number of scripts per day
- One child profile
- Basic support features

Premium plan:

- Unlimited scripts
- Multiple child profiles
- Saved scripts library
- Child insights
- Predictive insights

Suggested price range: $8-$12 per month.

Annual plans can provide discounted pricing.

## Landing Page Strategy
The landing page should explain the product clearly.

Suggested sections:

- Hero section
- How it works
- Example script
- Why parents love it
- Download links

Hero message should communicate value instantly.

Example headline:

> "What should I say right now?"

## Growth Strategy
Early growth channels may include:

- Parenting TikTok creators
- Instagram parenting communities
- Reddit parenting forums
- Parenting newsletters
- Word-of-mouth sharing

Shareable scripts can encourage organic growth.

## Long-Term Vision
Over time, Sturdy becomes more than a script generator. It becomes a parenting support system that:

- Learns about each child
- Helps parents recognize patterns
- Suggests strategies proactively
- Provides emotional support during stressful moments

Long-term goal: help parents feel more confident and supported in difficult situations.

## Summary
Sturdy combines several systems:

- AI parenting guidance
- Safety-aware response routing
- Child-specific personalization
- Pattern-based insights
- Calm, supportive user experience

Together, these create a product designed to help parents navigate difficult moments with their children more confidently.
