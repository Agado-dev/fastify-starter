import fastifyUnderPressure from "@fastify/under-pressure";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

import { appConfig } from "../configuration/appConfig.js";
import { isLocalEnv } from "../configuration/configuration.model.js";

const environmentConfig = appConfig.get("environment");

export const healthcheckPlugin: FastifyPluginAsync = fastifyPlugin(
  async (server) => {
    server.register(fastifyUnderPressure, {
      healthCheckInterval: isLocalEnv(environmentConfig.env) ? 20000 : 1000,
      healthCheck: async (server) => {
        const dbRes = await dbHealthcheck(server);
        if (!dbRes) {
          return false;
        }
        return {
          serverTimestamp: new Date(),
          status: "ok",
          db: dbRes,
        };
      },
      exposeStatusRoute: {
        url: "/health",
        routeOpts: {},
        routeResponseSchemaOpts: {
          serverTimestamp: { type: "string" },
          status: { type: "string" },
          db: { type: "boolean" },
        },
      },
    });
  },
);

async function dbHealthcheck(server: FastifyInstance) {
  try {
    await server.prisma.$queryRaw`SELECT 1;`;
    return true;
  } catch (error) {
    server.log.error("[healthcheck] db unreachable", error);
    return false;
  }
}
