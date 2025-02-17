import * as Sentry from "@sentry/node";
import fastify from "fastify";

import multipart from "@fastify/multipart";
import { defaultDiContextConfiguration } from "./dependency-injection/default-di-context.configuration.js";
import { createAppRouter } from "./domain/router.js";
import {
  appConfig,
  getAppVersion,
} from "./infrastructure/configuration/appConfig.js";
import { awilixPlugin } from "./infrastructure/dependency-injection/awilix.plugin.js";
import { healthcheckPlugin } from "./infrastructure/health/healthcheck.plugin.js";
import { ENV_TO_LOGGER_OPTS } from "./infrastructure/log/log.config.js";
import { sentryPlugin } from "./infrastructure/monitoring/sentry.plugin.js";

import { appApiContract } from "@agado/api-starter-contract";
import { authenticationPlugin } from "./infrastructure/auth/authentication.plugin.js";
import { prismaPlugin } from "./infrastructure/db/prisma.plugin.js";
import { openApiPlugin } from "./infrastructure/openapi/openapi.plugin.js";
import shutdownPlugin from "./infrastructure/shutdown/shutdown.plugin.js";
import { tsRestPlugin } from "./infrastructure/ts-rest/ts-rest.plugin.js";

const serverConfig = appConfig.get("server");
const environmentConfig = appConfig.get("environment");
const documentationConfig = appConfig.get("documentation");
const authConfig = appConfig.get("auth");
const monitoringConfig = appConfig.get("monitoring");

export async function createApp() {
  const app = fastify({
    logger: ENV_TO_LOGGER_OPTS[environmentConfig.env],
    requestTimeout: serverConfig.timeout,
  });
  if (monitoringConfig.sentryDsn) {
    app.register(sentryPlugin, {
      appEnv: environmentConfig.env,
      appVersion: getAppVersion(),
      sentryDsn: monitoringConfig.sentryDsn,
    });
  }
  app.register(multipart, {
    attachFieldsToBody: true,
  });

  // Configure DI context
  app.register(awilixPlugin);
  const { prismaClient } = await defaultDiContextConfiguration(app.log);
  await app.register(prismaPlugin, { prismaClient });

  app.register(shutdownPlugin);
  app.register(healthcheckPlugin);

  app.register(authenticationPlugin, {
    publicPaths: ["/health", "/doc", "/assets"],
    authIssuer: authConfig.issuer,
    onAuthenticationSuccess: (user) => {
      Sentry.setUser({
        id: user.sub,
      });
    },
  });

  app.register(tsRestPlugin, { routerFactory: createAppRouter });
  app.register(openApiPlugin, {
    enabled: documentationConfig.enabled,
    contract: appApiContract,
    path: "doc",
  });

  return app;
}
