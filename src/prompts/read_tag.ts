import type { PromptInstructions } from '../types/llm.js';

const READ_TAG_SYSTEM_PROMPT = `You transcribe photos of equipment identification tags (e.g. wire rope slings).
Return ONLY a JSON object of this shape:
{
  "fields": [ { "label": string, "value": string | null, "units": string | null, "confidence": "high" | "low" } ],
}

Rules:
- Create one entry per piece of information on the tag. Do not assume which fields
  a tag has: include whatever is actually printed or stamped, and nothing else.
- "label" is the tag's own wording (e.g. "VERTICAL", "SN", "DATE"). If a value has
  no printed label, such as a brand name, make a short descriptive label.
- "value" is copied exactly as printed, not including units and symbols (e.g. 3/8, 1.2).
- Use null when a value is present but unreadable. NEVER guess or fill in plausible values.
- If some characters of a value are uncertain, write them as "?" (e.g. "3?-P3?61-9-6?4").
- "units" are the units of the value. If the field is not a measurement, this field is null.
- Use full names of units (e.g. inches, feet, meters).
- "confidence" is "low" if any part of the value is uncertain or faint, otherwise "high".`;

const READ_TAG_USER_PROMPT = `Transcribe this tag.`;

export const READ_TAG_INSTRUCTIONS: PromptInstructions = {
  systemLevel: READ_TAG_SYSTEM_PROMPT,
  userLevel: READ_TAG_USER_PROMPT
};
