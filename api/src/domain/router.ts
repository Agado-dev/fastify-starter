import { appApiContract } from "@agado/api-starter-contract";
import type { RouterImplementation } from "@ts-rest/fastify";
import type { TsRestFastifyServerType } from "../infrastructure/ts-rest/ts-rest.plugin.js";
import { createAssetsRouter } from "./assets/assets.router.js";
import { createFooRouter } from "./foo/foo.router.js";

export function createAppRouter(
  tsRestServer: TsRestFastifyServerType,
): RouterImplementation<typeof appApiContract> {
  return tsRestServer.router(appApiContract, {
    foo: createFooRouter(tsRestServer),
    assets: createAssetsRouter(tsRestServer),
  });
}
