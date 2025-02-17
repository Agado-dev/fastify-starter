import { fastifyAwilixPlugin } from "@fastify/awilix";
import type { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

export const awilixPlugin = fastifyPlugin(async (server) => {
  server.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
  });
});
