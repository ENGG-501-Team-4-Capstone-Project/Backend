import Fastify from 'fastify';

const envToLogger = {
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
  logger: envToLogger[process.env.NODE_ENV as keyof typeof envToLogger] ?? true
});

fastify.get('/test', async (_request, reply) => {
  return reply.code(200).send('Hello World');
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
