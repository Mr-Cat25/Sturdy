const requiredFields = [
	"situation_summary",
	"regulate",
	"connect",
	"guide",
] as const;

export function validateResponse(value: unknown): boolean {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	for (const field of requiredFields) {
		if (typeof candidate[field] !== "string" || candidate[field].trim().length === 0) {
			return false;
		}
	}

	return true;
}
