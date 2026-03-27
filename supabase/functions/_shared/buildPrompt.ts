// supabase/functions/_shared/buildPrompt.ts
// Phase B — Neurotype prompt blocks prepended before standard prompt.
// Model reads neurotype block FIRST — it becomes the lens for the whole script.
// When no neurotype is set, standard prompt runs unchanged.
// NEVER mention the neurotype label in the output — scripts just feel right.

type BuildPromptInput = {
  childName:   string;
  childAge:    number;
  message:     string;
  neurotype?:  string | null;
};

// ─────────────────────────────────────────────
// Neurotype blocks — each is a self-contained
// instruction set that overrides the standard
// prompt rules where they conflict.
// ─────────────────────────────────────────────

const NEUROTYPE_BLOCKS: Record<string, string> = {

  ADHD: `
[NEUROTYPE CONTEXT — read this first, it overrides all other rules]
This child has ADHD. These rules override the standard writing rules below:
- Every sentence must be under 10 words. Short. Direct. One idea only.
- Regulate: Lead with body language before words. Example: "Move closer. Get low."
- Connect: Name one feeling only. No explanations. No "because".
- Guide: Always include a movement or physical option. Example: "Jump twice. Then walk with me."
- Never use "because", "since", or multi-clause sentences.
- Never lecture. Never reason. Just name and move.
- Urgency and energy are normal for this child — do not pathologize them.
[END NEUROTYPE CONTEXT]
`.trim(),

  Autism: `
[NEUROTYPE CONTEXT — read this first, it overrides all other rules]
This child has Autism. These rules override the standard writing rules below:
- Use literal, concrete language. No metaphors. No idioms. No abstract concepts.
- Regulate: Acknowledge the situation plainly. Example: "It is time to leave now."
- Connect: State what happens next — not how to feel about it. Sequence is calming.
- Guide: Give an explicit step-by-step sequence. Example: "First shoes. Then car. Then home."
- Never say "I know this is hard" or imply the child should understand your feelings.
- Predictability and precision reduce distress — be exact, not approximate.
- Tone must be steady and flat. No exaggerated warmth or big emotional language.
[END NEUROTYPE CONTEXT]
`.trim(),

  Anxiety: `
[NEUROTYPE CONTEXT — read this first, it overrides all other rules]
This child has Anxiety. These rules override the standard writing rules below:
- Regulate: Lead with reassurance and physical safety. "I'm here. You're safe."
- Connect: Validate the worry directly. Never dismiss it. Never say "there's nothing to worry about."
- Guide: Give one predictable next step only. Never leave the sequence open-ended.
- Include the parent's presence as a constant. "I'll be with you. I won't leave."
- Avoid urgency or time pressure language — it escalates anxiety.
- Calm, slow, warm — match the tone to what a regulated nervous system sounds like.
[END NEUROTYPE CONTEXT]
`.trim(),

  Sensory: `
[NEUROTYPE CONTEXT — read this first, it overrides all other rules]
This child has Sensory Processing differences. These rules override the standard writing rules below:
- Regulate: Acknowledge the sensory experience first. "I know this feels like too much right now."
- Connect: Do not push connection — offer presence without demand. "I'm right here."
- Guide: Reduce demands to the absolute minimum. One step only. Offer an exit option.
- Never touch without consent. Never add more stimulation — keep your voice low and slow.
- The environment may be the problem, not the behaviour — acknowledge that first.
- Avoid saying "calm down" — it does not help and may escalate.
[END NEUROTYPE CONTEXT]
`.trim(),

  PDA: `
[NEUROTYPE CONTEXT — read this first, it overrides all other rules]
This child has PDA (Pathological Demand Avoidance). These rules override the standard writing rules below:
- Regulate: Remove the demand entirely from this step. No instructions. Pure presence.
- Connect: Use collaborative, non-directive language. "I wonder if..." or "Maybe we could..."
- Guide: Offer genuine choices — not fake choices. Both options must be real.
  Example: "Do you want to walk out, or should I carry you?" — never "Do you want to walk, or do you want trouble?"
- Never issue direct commands. Demands trigger avoidance — even well-intentioned ones.
- Depersonalise the requirement. "The rule is we leave at 5" not "You need to leave."
- Autonomy and control are the child's core need — build every sentence around offering some.
[END NEUROTYPE CONTEXT]
`.trim(),

  '2e': `
[NEUROTYPE CONTEXT — read this first, it overrides all other rules]
This child is Twice Exceptional (2e) — high intellectual ability alongside learning or developmental differences.
These rules override the standard writing rules below:
- Never talk down. Match their intellectual level in language — they will notice if you don't.
- Regulate: Acknowledge the gap between what they understand and what they feel. Both are real.
  Example: "You know exactly what's happening, and it still feels overwhelming. That makes sense."
- Connect: Logical framing with emotional acknowledgment together. Not either/or.
- Guide: Give the reasoning AND the next step. They need to understand why to cooperate.
- Never simplify language — simplify the demand, not the words.
- Asynchronous development is real — a child who reasons like an adult may feel like a toddler. Hold both.
[END NEUROTYPE CONTEXT]
`.trim(),

};

// ─────────────────────────────────────────────
// Main prompt builder
// ─────────────────────────────────────────────

export function buildPrompt({
  childName,
  childAge,
  message,
  neurotype,
}: BuildPromptInput): string {

  const neurotypePart = neurotype && NEUROTYPE_BLOCKS[neurotype]
    ? [NEUROTYPE_BLOCKS[neurotype], '']
    : [];

  return [
    ...neurotypePart,
    'Sturdy writes calm, practical parenting scripts for real-life moments.',
    '',
    'The goal is to help a parent know what to say next in a hard moment with their child.',
    '',
    'Context:',
    `- Child name: ${childName}`,
    `- Child age: ${childAge}`,
    `- Situation: ${message.trim()}`,
    '',
    'Output must be strict JSON with:',
    '- situation_summary',
    '- regulate',
    '- connect',
    '- guide',
    '',
    'Writing rules:',
    '- Sound calm, clear, and human.',
    '- Never sound clinical or diagnostic.',
    '- Adapt language to the child\'s exact age.',
    '- Make it specific to the situation.',
    '- Prioritize real words a parent can say out loud.',
    '- Keep it concise and practical.',
    '- Do not mention disorders, labels, or neurotypes in your output.',
    '- Do not reference the neurotype context block in your output.',
    '',
    'Reasoning:',
    '- Identify the child\'s likely emotion.',
    '- Help the parent regulate first.',
    '- Validate the child\'s feeling.',
    '- Guide toward action.',
    '',
    'Return JSON ONLY in this exact shape:',
    '{',
    '  "situation_summary": "...",',
    '  "regulate": "...",',
    '  "connect": "...",',
    '  "guide": "..."',
    '}',
    'Do not include markdown or extra text.',
  ].join('\n');
}
