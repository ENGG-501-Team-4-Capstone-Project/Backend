import { READ_TAG_SYSTEM_PROMPT } from '../prompts/read-tag.js';
import { toDataUrl } from '../utils/image.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
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

export async function requestTagTranscription(apiKey: string, image: string, imageUrl: string): Promise<string> {
  const response = await fetch(OPENROUTER_URL, {
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
        { role: 'system', content: READ_TAG_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Transcribe this tag.' },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new OpenRouterError('LLM request failed', response.status, await response.text());
  }

  const responseData = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const transcriptionContent = responseData.choices?.[0]?.message?.content;
  if (!transcriptionContent) throw new OpenRouterError('Empty response from model');

  return transcriptionContent;
}
