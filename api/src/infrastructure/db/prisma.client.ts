import { PrismaClient } from "@prisma/client";

import { appConfig } from "../configuration/appConfig.js";
import { isLocalEnv } from "../configuration/configuration.model.js";
import { withOptimize } from "./optimize.plugin.js";

const environmentConfig = appConfig.get("environment");

export type PrismaClientType = Awaited<ReturnType<typeof createPrismaClient>>;

export async function createPrismaClient(dbUrl: string) {
  const prisma = new PrismaClient({
    log: isLocalEnv(environmentConfig.env)
      ? ["query", "info", "warn"]
      : ["info", "warn"],
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  const extendedPrismaClient = withOptimize(prisma);
  await extendedPrismaClient.$connect();
  return extendedPrismaClient;
}
