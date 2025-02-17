import type { PrismaClient } from "@prisma/client";
import { withOptimize as withOptimizePlugin } from "@prisma/extension-optimize";
import { appConfig } from "../configuration/appConfig.js";

const dbConfig = appConfig.get("db");
export function withOptimize(prisma: PrismaClient) {
  if (!dbConfig.prismaOptimizeEnabled) {
    return prisma;
  }
  return prisma.$extends(
    withOptimizePlugin({ apiKey: dbConfig.prismaOptimizeApiKey }),
  );
}
