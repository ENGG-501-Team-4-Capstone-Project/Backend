import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import fastifyPlugin from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const prismaPlugin = fastifyPlugin(async (server: FastifyInstance) => {
  const prismaAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prismaClient = new PrismaClient({ adapter: prismaAdapter });

  await prismaClient.$connect();
  server.decorate('prisma', prismaClient);

  server.addHook('onClose', async (serverInstance) => {
    await serverInstance.prisma.$disconnect();
  });
});
