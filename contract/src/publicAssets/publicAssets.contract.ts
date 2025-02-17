import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { AssetSchema } from "./publicAssets.model.js";

const tsRestContract = initContract();

export const publicAssetContract = tsRestContract.router({
  list: {
    summary: "List public assets",
    method: "GET",
    path: "/assets",
    query: z.object({
      limit: z.coerce.number().int().positive(),
    }),
    responses: {
      200: AssetSchema.array(),
    },
  },
});
