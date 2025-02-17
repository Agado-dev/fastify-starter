import { appConfig } from "../infrastructure/configuration/appConfig.js";
import { createPrismaClient } from "../infrastructure/db/prisma.client.js";
import type { AppLoggerType } from "../infrastructure/log/logger.model.js";

import { configureDiContext } from "./di.context.js";

export async function defaultDiContextConfiguration(logger: AppLoggerType) {
  const dbConfig = appConfig.get("db");

  const prismaClient = await createPrismaClient(dbConfig.url);

  const defaultContextValues = {
    logger,
    prismaClient,
  };

  await configureDiContext(defaultContextValues);
  return defaultContextValues;
}
