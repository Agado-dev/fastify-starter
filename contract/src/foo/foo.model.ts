import { z } from "zod";

export const FooSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nonempty(),
});
export type FooType = z.infer<typeof FooSchema>;
