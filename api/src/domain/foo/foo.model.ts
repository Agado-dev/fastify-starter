import type { Prisma } from "@prisma/client";

export const FOO_FIELDS_TO_SELECT = {
  id: true,
  name: true,
} satisfies Partial<Prisma.FooSelect>;

export type FooDbType = Prisma.FooGetPayload<{
  select: typeof FOO_FIELDS_TO_SELECT;
}>;
