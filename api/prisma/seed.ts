import { PrismaClient } from "@prisma/client";

import { appConfig } from "../src/infrastructure/configuration/appConfig.js";
import { isLocalEnv } from "../src/infrastructure/configuration/configuration.model.js";
import { localPopulateFoo_20250217 } from "./seeds/20250217-local-populate-foo.js";

const environmentConfig = appConfig.get("environment");
const dbConfig = appConfig.get("db");

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbConfig.url,
    },
  },
});

async function executeSeed(
  seedName: string,
  seedFn: (prisma: PrismaClient) => Promise<void>,
) {
  const executedSeed = await prisma.app_seeds.findFirst({
    where: {
      seed_name: seedName,
      finishedAt: { not: null },
    },
  });

  if (executedSeed) {
    console.log(
      `[SEED] ${seedName} already applied at ${executedSeed.finishedAt}`,
    );

    return;
  }
  const seed = await prisma.app_seeds.upsert({
    create: { seed_name: seedName },
    update: { seed_name: seedName, startedAt: new Date() },
    where: { seed_name: seedName },
  });

  await seedFn(prisma);
  await prisma.app_seeds.update({
    data: {
      finishedAt: new Date(),
    },
    where: { id: seed.id },
  });

  console.log(`[SEED] ${seedName} executed :)`);
}

async function main() {
  const isLocal = isLocalEnv(environmentConfig.env);
  if (isLocal) {
    await executeSeed(
      localPopulateFoo_20250217.SEED_NAME,
      localPopulateFoo_20250217,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
