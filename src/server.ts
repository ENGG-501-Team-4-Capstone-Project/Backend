import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import { prismaPlugin } from './plugins/prisma.js';
import llm from './routes/llm.js';

const environmentToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  },
  production: true,
  test: false
};

const fastify = Fastify({
  logger: environmentToLogger[process.env.NODE_ENV as keyof typeof environmentToLogger] ?? true
});

await fastify.register(prismaPlugin);
await fastify.register(llm);

fastify.get('/test', async (_request, reply) => {
  return reply.code(200).send('Hello World');
});

fastify.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    await fastify.prisma.$queryRaw`SELECT 1`;
    return reply.code(200).send({ message: 'ok', db: 'connected' });
  } catch (error) {
    console.error('Prisma health check failed:', error);
    return reply.code(500).send({ message: 'error', db: 'disconnected', error: String(error) });
  }
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
