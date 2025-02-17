import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

import type { PrismaClientType } from "./prisma.client";

interface PrismaPluginOptions {
  prismaClient: PrismaClientType;
}

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClientType;
  }
}

export const prismaPlugin = fastifyPlugin<PrismaPluginOptions>(
  async (server, { prismaClient }) => {
    if (!prismaClient) {
      throw new Error(
        `Prisma client is not provided in plugin options. Usage "await app.register(prismaPlugin, { prismaClient });"`,
      );
    }
    // Make Prisma Client available through the fastify server instance: server.prisma
    server.decorate("prisma", {
      getter() {
        return prismaClient;
      },
    });

    server.addHook("onClose", async (server) => {
      await server.prisma.$disconnect();
    });
  },
);
