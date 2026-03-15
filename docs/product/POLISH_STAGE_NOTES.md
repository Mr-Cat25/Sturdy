# Sturdy — Polish Stage Notes

## Save for Later

When we reach the stage where we make the app feel polished and production-quality, prioritize this structural upgrade first:

### Structural Upgrade: Persistent Child Context + Frictionless Repeat Flow

This is the small change that will make Sturdy feel like a real product instead of a prototype.

#### What it means

Once a parent enters child information, the app should remember it and make repeat use effortless.

The parent should be able to:

- enter child info once
- generate a script
- tap "Try Another"
- immediately enter a new situation
- keep the same child context
- avoid re-entering age and neurotype repeatedly

#### Why it matters

This makes Sturdy feel:

- fast
- practical
- smart
- trustworthy
- built for real stressful moments

Without this, the app feels like a demo.
With this, it starts to feel like a real parenting tool.

#### Real Product Flow

Welcome  
→ Child setup  
→ Now  
→ Result  
→ Try Another  
→ Now again with child context preserved

#### Future enhancement

Later, child context should persist beyond the current session using saved child profiles.

---

## Also save for later

### Feature: Speak This Script

Add a button that reads the generated script aloud.

Example:

[ 🔊 Speak This ]

Why this matters:
Parents in stressful moments may not be able to calmly read and process text.
Hearing the script out loud can help them regulate and respond more confidently.

This could become a signature Sturdy feature.

---

## Also save for later

### Responsive / Accessibility Polish

Before launch, do a dedicated layout pass for:

- small phones
- large phones
- increased system font sizes
- increased display size
- safe areas
- scroll behavior

Core rules:

- use flexible layouts
- avoid fixed heights
- allow text wrapping
- use ScrollView on long screens
- keep buttons reachable
