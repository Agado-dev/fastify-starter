import { z } from "zod";

export const AssetSchema = z.object({
  url: z.string().url(),
});
export type AssetType = z.infer<typeof AssetSchema>;
