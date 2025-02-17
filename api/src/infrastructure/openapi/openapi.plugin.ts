import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { AppRouter } from "@ts-rest/core";
import { generateOpenApi } from "@ts-rest/open-api";
import fastifyPlugin from "fastify-plugin";
import { getAppVersion } from "../configuration/appConfig.js";

interface OpenApiPluginOptsType {
  contract: AppRouter;
  path: string;
  enabled?: boolean;
}
export const openApiPlugin = fastifyPlugin<OpenApiPluginOptsType>(
  async (server, { contract, path, enabled }) => {
    if (!enabled) {
      server.log.info("OpenAPI plugin is disabled");
      return;
    }
    const openApiDocument = generateOpenApi(
      contract,
      {
        info: {
          title: "Starter API",
          version: getAppVersion(),
        },
      },
      { setOperationId: true },
    );

    server
      .register(fastifySwagger, {
        transformObject: () => openApiDocument,
      })
      .register(fastifySwaggerUI, {
        routePrefix: path,
      });
  },
);
