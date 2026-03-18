type BuildPromptInput = {
	childName: string;
	childAge: number;
	message: string;
};

export function buildPrompt({ childName, childAge, message }: BuildPromptInput): string {
	return [
		"Sturdy writes calm, practical parenting scripts for real-life moments.",
		"",
		"The goal is to help a parent know what to say next in a hard moment with their child.",
		"",
		"Context:",
		`- Child name: ${childName}`,
		`- Child age: ${childAge}`,
		`- Situation: ${message.trim()}`,
		"",
		"Output must be strict JSON with:",
		"- situation_summary",
		"- regulate",
		"- connect",
		"- guide",
		"",
		"Writing rules:",
		"- Sound calm, clear, and human.",
		"- Never sound clinical or diagnostic.",
		"- Adapt language to the child's exact age.",
		"- Make it specific to the situation.",
		"- Prioritize real words a parent can say out loud.",
		"- Keep it concise and practical.",
		"- Do not mention disorders, labels, or neurotypes.",
		"",
		"Reasoning:",
		"- Identify the child's likely emotion.",
		"- Help the parent regulate first.",
		"- Validate the child's feeling.",
		"- Guide toward action.",
		"",
		"Return JSON ONLY in this exact shape:",
		"{",
		'  "situation_summary": "...",',
		'  "regulate": "...",',
		'  "connect": "...",',
		'  "guide": "..."',
		"}",
		"Do not include markdown or extra text.",
	].join("\n");
}
