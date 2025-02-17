import type { PrismaClient } from "@prisma/client";
import { FOO_DATUM } from "./datum/foo.js";

export async function localPopulateFoo_20250217(prisma: PrismaClient) {
  const { count } = await prisma.foo.createMany({
    data: FOO_DATUM,
  });

  console.log(`[SEED] ${count} foo created`);
}

localPopulateFoo_20250217.SEED_NAME = "20250217-local-populate-foo";
