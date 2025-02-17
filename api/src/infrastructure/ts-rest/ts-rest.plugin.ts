import type { AppRouter } from "@ts-rest/core";
import { type RouterImplementation, initServer } from "@ts-rest/fastify";
import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

export type TsRestFastifyServerType = ReturnType<typeof initServer>;

interface TsRestPluginType<RouterType extends AppRouter> {
  routerFactory: (
    tsRestServer: TsRestFastifyServerType,
  ) => RouterImplementation<RouterType>;
  disableResponseValidation?: boolean;
}
export const tsRestPlugin = fastifyPlugin(
  async <RouterType extends AppRouter>(
    server: FastifyInstance,
    { routerFactory, disableResponseValidation }: TsRestPluginType<RouterType>,
  ) => {
    const tsRestServer = initServer();

    return server.register(tsRestServer.plugin(routerFactory(tsRestServer)), {
      responseValidation: !disableResponseValidation,
    });
  },
);
