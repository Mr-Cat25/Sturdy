// supabase/functions/_shared/buildPrompt.ts
// The science lives here — in the instructions.
// The output sounds like a calm real parent — nothing else.
//
// Science sources baked into this prompt:
// - Parent self-regulation before child co-regulation
// - Emotion labeling reduces amygdala activity (name it to tame it)
// - Rational brain offline during meltdown — no logic mid-crisis
// - Age-specific discipline research: toddler→redirection, school→problem-solve, teen→coach
// - 4:1 positive ratio awareness for teens
// - Natural consequences over punishments
// - Connect before correct — always

type BuildPromptInput = {
  childName:  string;
  childAge:   number;
  message:    string;
  intensity?: number | null;
};

// ─────────────────────────────────────────────
// Age-specific science rules
// Hidden from output — shapes how scripts are written
// ─────────────────────────────────────────────

function getAgeInstructions(age: number): string {

  // Infants / early toddlers
  if (age <= 2) return `
Child is ${age}. Brain is almost entirely emotional — no reasoning capacity yet.
Regulation science: Distraction and redirection ONLY. No explanations. No "because".
Parent action: Physical closeness. Soft voice. Swap forbidden item for safe one.
Script style: 3-4 words max. Concrete nouns. "Come here." "Gentle hands." "Look at this."
Emotion labeling: One word. "Sad." "Mad." "Ouch." That's it.
Guide: One physical redirection. Never a choice — too complex at this age.
CRITICAL: Never ask questions. Never reason. Just name and redirect.`.trim();

  // Toddlers
  if (age <= 3) return `
Child is ${age}. Meltdowns are normal — prefrontal cortex barely online.
Regulation science: Redirection + simple binary choice gives them sense of control.
Parent action: Get low. Eye level. Soft voice. No big movements.
Script style: Short sentences. 4-6 words max. Simple emotional naming.
Connect: Name the feeling once. "You're really mad." Then the limit. No lecture.
Guide: Binary choice only. "Blue socks or red socks?" Both options must be fine.
CRITICAL: No explanations during meltdown. "No hitting" — not "Hitting hurts others because..."`.trim();

  // Preschool
  if (age <= 5) return `
Child is ${age}. Beginning to understand simple cause and effect.
Regulation science: Empathy + natural consequence. Brief time-in (stay with parent) over time-out.
Parent action: Get low. Name the emotion first. Then the limit. Short sentences.
Script style: Simple, warm, spoken language. Can handle 1-2 sentences. Still concrete.
Connect: Name the feeling AND the boundary in one breath. No long explanation.
Guide: Natural consequence stated simply, OR one clear next step with a real choice.
CRITICAL: Keep it short. A 4-year-old cannot process a paragraph mid-meltdown.
Example guide: "You can walk with me or I can carry you. You choose."`.trim();

  // Early school age
  if (age <= 8) return `
Child is ${age}. Rational brain developing — can process brief reasons when calm.
Regulation science: Brief explanation of WHY is okay now. Natural consequences land.
Parent action: Stay calm. Acknowledge the feeling first. Then the boundary. Then next step.
Script style: Conversational, direct, warm. Can be 2-3 sentences. Still not a lecture.
Connect: Name the feeling + explain the limit briefly. "You're frustrated AND hitting isn't okay."
Guide: Clear next step. Can offer a choice. Brief mention of what happens next.
CRITICAL: No lecturing mid-meltdown. Save problem-solving for when they're calm.`.trim();

  // Late school age
  if (age <= 12) return `
Child is ${age}. Capable of reasoning. Values fairness intensely. Needs respect.
Regulation science: Involve them in solutions. Loss of privilege works. Problem-solve together later.
Parent action: Calm, steady tone. Don't match their escalation. Acknowledge before correcting.
Script style: Respectful, adult-adjacent language. Clear expectations. Not babyish.
Connect: Empathize with their perspective even if you disagree with their behavior.
Guide: Clear consequence or next step. Can use "when-then" structure.
Example guide: "When you've calmed down, we'll talk about what happened."
CRITICAL: No sarcasm. No shame. No "you always" or "you never".`.trim();

  // Teens
  return `
Child is ${age}. Science shifts: discipline is now COACHING not controlling.
Goal is internal regulation and critical thinking — not just compliance.
Regulation science:
  - Collaborative limit setting — teens respect rules they helped create
  - Natural consequences over punishments (punishments cause resentment)
  - "When-then" formula: "When X is done, then Y happens"
  - Connection is the most powerful influence tool at this age
  - 4:1 ratio: four positive interactions for every correction
Parent action: Lower your voice. Don't pursue if they walk away — reconnect later.
Script style: Near-adult language. Respectful. Brief. No lecturing.
Connect: Empathize with their feeling even when you hold the limit firmly.
Guide: "When-then" where possible. Natural consequence. Or one clear expectation.
Example: "I hear you're frustrated. When you're ready to talk calmly, I'm here."
CRITICAL: Never threaten. Never compare to siblings. Never use guilt.
Non-negotiables only: safety, health, values. Let small things go.`.trim();
}

// ─────────────────────────────────────────────
// Intensity rules
// High intensity = fewer words, more physical
// Low intensity = warmer, can be slightly fuller
// ─────────────────────────────────────────────

function getIntensityInstructions(intensity: number): string {
  if (intensity === 1) return `
Intensity is mild (1/5). Child is frustrated but manageable.
Scripts can be warm and slightly fuller. Parent has space and time.
Connect can include feeling AND a brief boundary in one sentence.
Guide can offer a genuine choice.`.trim();

  if (intensity === 2) return `
Intensity is building (2/5). Tension is rising.
Keep each script to 1-2 sentences maximum. No softeners.
Connect: feeling + limit in one sentence.
Guide: one clear option only.`.trim();

  if (intensity === 3) return `
Intensity is hard (3/5). Child is escalated. Parent needs immediate words.
One sentence per step. No preamble. No explanation.
Regulate: physical action first, then one short sentence.
Connect: feeling name + limit. Maximum 8 words.
Guide: one action. That's it.`.trim();

  if (intensity === 4) return `
Intensity is very hard (4/5). Parent may be dysregulated too.
Maximum 6 words per script line. Hard limit.
parent_action becomes more important than the script at this level.
Regulate script: 3-4 words only.
Connect script: 4-5 words only.
Guide script: 4 words only.
situation_summary: one short sentence.`.trim();

  return `
Intensity is overwhelming (5/5). Parent is in maximum crisis.
Scripts must be 3-4 words absolute maximum. Hard limit.
parent_action is the priority — the script is just a few words.
Regulate: "Breathe. Move closer."
Connect: "I see you."
Guide: "Come with me."
situation_summary: 5 words maximum. Nothing else.`.trim();
}

// ─────────────────────────────────────────────
// Main builder
// ─────────────────────────────────────────────

export function buildPrompt({
  childName,
  childAge,
  message,
  intensity,
}: BuildPromptInput): string {

  const ageInstructions       = getAgeInstructions(childAge);
  const intensityInstructions = intensity ? getIntensityGuidance(intensity) : '';

  return [
    '== YOUR JOB ==',
    'You are writing three short things a parent can say OUT LOUD in a hard moment with their child.',
    'These are not lessons. Not coaching scripts. Not therapy language.',
    'They are the actual words a calm, loving parent says in real life.',
    '',
    '== THE MOMENT ==',
    `Child: ${childName}, age ${childAge}`,
    `What is happening: ${message.trim()}`,
    intensity ? `How intense: ${intensity} out of 5` : '',
    '',
    '== AGE SCIENCE — shapes how you write, never appears in output ==',
    ageInstructions,
    '',
    intensity ? `== INTENSITY — shapes length and directness ==` : '',
    intensity ? intensityInstructions : '',
    intensity ? '' : '',
    '== THE THREE OUTPUTS ==',
    '',
    'REGULATE',
    'Purpose: Help the parent settle themselves and the moment — before anything else.',
    'Science: A dysregulated parent cannot regulate a child. Parent breathes first.',
    'parent_action: What the parent does with their body before speaking.',
    '  Examples: "Take one breath. Get low." / "Move closer. Slow down." / "Breathe. Soft voice."',
    'script: What the parent says first. Names the situation or the feeling — nothing more.',
    '  The script is NOT a command. It is acknowledgment.',
    '  Good: "You\'re really upset about leaving."',
    '  Good: "That felt really unfair."',
    '  Bad: "I know you\'re having big feelings right now." — too clinical',
    '  Bad: "Take a deep breath with me." — makes parent sound like a yoga teacher',
    '',
    'CONNECT',
    'Purpose: Show the child they are understood. Then — and only then — hold the limit.',
    'Science: Name the emotion to reduce amygdala activity. Connect before you correct.',
    'RULE: Connect must ALWAYS have both — the feeling AND the boundary.',
    'RULE: No logic mid-meltdown for ages under 10. No "because" explanations during high intensity.',
    'parent_action: What the parent does during this step.',
    '  Examples: "Stay close. Hold the limit." / "Keep voice calm. Don\'t negotiate."',
    'script: Name the feeling + hold the limit in natural spoken language.',
    '  Good: "You wanted to stay longer, and it\'s really hard to leave. We\'re still going."',
    '  Good: "I know you\'re angry. Hitting isn\'t something I\'ll let happen."',
    '  Bad: "I understand your frustration and validate your feelings." — therapy speak',
    '  Bad: "I\'m here. I won\'t let you hit." — no feeling named, robotic',
    '  Bad: "It\'s okay to feel mad but it\'s not okay to..." — lecture tone',
    '',
    'GUIDE',
    'Purpose: Move the situation forward. One clear next step.',
    'Science: Natural consequence > punishment. Choice gives sense of control. "When-then" for older kids.',
    'parent_action: What the parent does to move things forward.',
    '  Examples: "Start walking. One clear option." / "Wait. Give them a moment." / "Offer the choice calmly."',
    'script: What happens next — stated simply.',
    '  Good: "We\'re leaving now. You can walk or I\'ll help you."',
    '  Good: "When you\'re ready, come find me."',
    '  Good: "Put the tablet down. We\'ll try again tomorrow."',
    '  Bad: "Promise me this won\'t happen again." — fake promise',
    '  Bad: "Let\'s think about how we can make better choices." — coaching language',
    '  Bad: "Do you understand why that wasn\'t okay?" — mid-meltdown question',
    '',
    'AVOID',
    'List 2-3 phrases the parent should NOT say in this specific moment.',
    'These are real things parents say that make this type of situation worse.',
    'Be specific to the situation — not generic.',
    '  Examples: "Stop it right now" / "You\'re embarrassing me" / "Why can\'t you just listen?"',
    '  For teens add: "Because I said so" / "When I was your age..." / "You\'re being so dramatic"',
    '  Keep each one short — 2-6 words. These are phrases, not sentences.',
    '',
    '== NON-NEGOTIABLE WRITING RULES ==',
    '1. Every word must sound like a real calm parent — not a book, not a therapist, not a teacher.',
    '2. BANNED WORDS: "validate", "co-regulate", "big feelings", "inside voice", "processing",',
    '   "behavior", "appropriate", "boundary" (say "limit" instead), "mindful", "intentional".',
    '3. BANNED PHRASES: "Let\'s use our words." "I understand how you feel." "That\'s not okay behavior."',
    '   "Can you tell me why you did that?" "How does that make you feel?"',
    '4. NEVER start Guide with "Let\'s" unless it is a direct physical invitation like "Let\'s walk."',
    '5. NEVER invent details not in the parent\'s message.',
    '6. NEVER repeat the same phrase between Regulate and Connect scripts.',
    '7. Scripts must be easy to say out loud while stressed — no stumbling.',
    '8. situation_summary describes what is happening — factual, not prescriptive.',
    '9. Do not mention age groups, brain science, or parenting strategies in output.',
    '',
    '== QUALITY CHECK BEFORE RETURNING ==',
    `Does regulate sound like something a real parent says — not a script?`,
    `Does connect name a specific emotion AND hold a specific limit?`,
    `Does guide give ONE real next step — not a lesson?`,
    `Is every word appropriate for a ${childAge}-year-old?`,
    `Would a stressed parent actually say this out loud?`,
    `Is there any therapy/coaching language hiding in here? Remove it.`,
    '',
    '== OUTPUT — JSON ONLY ==',
    'No markdown. No explanation. No preamble.',
    '{',
    '  "situation_summary": "one sentence describing what is happening",',
    '  "regulate": {',
    '    "parent_action": "what the parent does first",',
    '    "script": "what the parent says"',
    '  },',
    '  "connect": {',
    '    "parent_action": "what the parent does during connect",',
    '    "script": "what the parent says — feeling + limit"',
    '  },',
    '  "guide": {',
    '    "parent_action": "what the parent does to move forward",',
    '    "script": "what the parent says — one next step"',
    '  },',
    '  "avoid": ["phrase one", "phrase two", "phrase three"]',
    '}',
  ].filter(Boolean).join('\n');
}

function getIntensityGuidance(intensity: number): string {
  return getIntensityInstructions(intensity);
}

