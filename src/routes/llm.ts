import type { FastifyInstance } from 'fastify';
import type { ReadTagBody } from '../types/tag.js';
import { normalizeReading, parseModelJson } from '../utils/tag.js';
import { OpenRouterError, promptLLM } from '../services/openrouter.js';
import { toDataUrl } from '../utils/image.js';
import type { EvaluateBody } from '../types/evaluate.js';
import { READ_TAG_INSTRUCTIONS } from '../prompts/read-tag.js';
import type { PromptPayloadContent } from '../types/llm.js';

export default function (server: FastifyInstance) {
  server.post<{ Body: ReadTagBody }>(
    '/read-tag',
    {
      bodyLimit: 15 * 1024 * 1024,
      schema: {
        body: {
          type: 'object',
          required: ['image']
        }
      }
    },
    async (request, reply) => {
      const apiKey = process.env.OPEN_ROUTER_API_KEY;
      if (!apiKey) {
        return reply.code(500).send({ error: 'OPEN_ROUTER_API_KEY is not set' });
      }

      const imageUrl = toDataUrl(request.body.image);
      if (!imageUrl) {
        return reply.code(400).send({ error: 'image is not valid base64' });
      }

      try {
        const payload: PromptPayloadContent = {
          imageUrls: [imageUrl]
        };
        const transcriptionContent = await promptLLM(apiKey, payload, READ_TAG_INSTRUCTIONS);
        return normalizeReading(parseModelJson(transcriptionContent));
      } catch (error) {
        if (error instanceof OpenRouterError) {
          request.log.error({ status: error.status, detail: error.detail }, error.message);
          return reply.code(502).send({ error: error.message, status: error.status });
        }
        request.log.error({ error }, 'Model returned invalid output');
        return reply.code(502).send({ error: 'Model returned invalid output' });
      }
    }
  );

  server.post<{ Body: EvaluateBody }>('evaluate-rig', async (request, reply) => {
    const apiKey = process.env.OPEN_ROUTER_API_KEY;
    if (!apiKey) {
      return reply.code(500).send({ error: 'OPEN_ROUTER_API_KEY is not set' });
    }
  });
}
