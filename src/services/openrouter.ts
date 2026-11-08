import type { PromptInstructions, PromptPayloadContent, UserContent } from '../types/llm.js';

const OPEN_ROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'anthropic/claude-haiku-5.5';

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly detail?: string
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

function buildContent({ text, data, imageUrls = [] }: PromptPayloadContent): UserContent[] {
  const parts: UserContent[] = [];
  if (text) parts.push({ type: 'text', text });
  if (data !== undefined) parts.push({ type: 'text', text: JSON.stringify(data, null, 2) });
  for (const url of imageUrls) parts.push({ type: 'image_url', image_url: { url } });
  return parts;
}

export async function promptLLM(apiKey: string, promptContent: PromptPayloadContent, promptInstructions: PromptInstructions): Promise<string> {
  const response = await fetch(OPEN_ROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: promptInstructions.systemLevel },
        { role: 'user', content: [{ type: 'text', text: promptInstructions.userLevel }, ...buildContent(promptContent)] }
      ]
    })
  });

  if (!response.ok) {
    throw new OpenRouterError('LLM request failed', response.status, await response.text());
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const result = data.choices?.[0]?.message?.content;
  if (!result) throw new OpenRouterError('Empty response from model');

  return result;
}
