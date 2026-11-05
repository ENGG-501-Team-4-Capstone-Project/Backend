import type { FastifyInstance } from 'fastify';
import type { ReadTagBody } from '../types/tag.js';
import { normalizeReading, parseModelJson } from '../utils/tag.js';
import { OpenRouterError, promptLLM } from '../services/openrouter.js';
import { toDataUrl } from '../utils/image.js';
import type { EvaluateBody, EvaluationVerdict } from '../types/evaluate.js';
import { READ_TAG_INSTRUCTIONS } from '../prompts/read_tag.js';
import type { PromptPayloadContent } from '../types/llm.js';
import { EVALUATE_RIG_INSTRUCTIONS } from '../prompts/evaluate_rig.js';

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
        return reply.code(502).send({ error: error });
      }
    }
  );

  server.post<{ Body: EvaluateBody }>('/evaluate-rig', async (request, reply) => {
    const apiKey = process.env.OPEN_ROUTER_API_KEY;
    if (!apiKey) {
      return reply.code(500).send({ error: 'OPEN_ROUTER_API_KEY is not set' });
    }

    const imageUrls = request.body.images.map(toDataUrl);
    if (!imageUrls.every((url): url is string => url !== null)) {
      return reply.code(400).send({ error: 'image is not valid base64' });
    }

    const tagInformation = request.body.tagInformation;
    if (!tagInformation) {
      return reply.code(400).send({ error: 'no tag information provided' });
    }

    try {
      const payload: PromptPayloadContent = {
        data: tagInformation,
        imageUrls: imageUrls
      };
      const rigEvaluation = await promptLLM(apiKey, payload, EVALUATE_RIG_INSTRUCTIONS);
      return parseModelJson(rigEvaluation) as EvaluationVerdict;
    } catch (error) {
      if (error instanceof OpenRouterError) {
        request.log.error({ status: error.status, detail: error.detail }, error.message);
        return reply.code(502).send({ error: error.message, status: error.status });
      }
      request.log.error({ error }, 'Model returned invalid output');
      return reply.code(502).send({ error: 'Model returned invalid output' });
    }
  });
}
