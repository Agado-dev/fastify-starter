import { publicAssetContract } from "@agado/api-starter-contract";
import type { TsRestFastifyServerType } from "../../infrastructure/ts-rest/ts-rest.plugin.js";

export function createAssetsRouter(tsRestServer: TsRestFastifyServerType) {
  return tsRestServer.router(publicAssetContract, {
    list: async () => {
      return {
        status: 200 as const,
        body: [
          {
            url: "https://agado.dev/asset1",
          },
          {
            url: "https://agado.dev/asset2",
          },
          {
            url: "https://agado.dev/asset3",
          },
        ],
      };
    },
  });
}
