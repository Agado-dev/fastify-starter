import { ApiErrorCode, fooContract } from "@agado/api-starter-contract";
import { resolve } from "../../infrastructure/dependency-injection/di.resolver.js";
import type { TsRestFastifyServerType } from "../../infrastructure/ts-rest/ts-rest.plugin.js";

export function createFooRouter(tsRestServer: TsRestFastifyServerType) {
  const fooService = resolve("fooService");

  return tsRestServer.router(fooContract, {
    get: async ({ params: { name } }) => {
      const fooResult = await fooService.getFoo(name);

      const responseResult = fooResult
        .map((foo) => ({
          status: 200 as const,
          body: foo,
        }))
        .mapErr((err) => ({
          status: 404 as const,
          body: {
            statusCode: 404 as const,
            code: ApiErrorCode.DATA_NOT_FOUND,
            error: err.name,
            message: err.message,
          },
        }));

      return responseResult.isOk()
        ? responseResult.unwrap()
        : responseResult.unwrapErr();
    },
    create: async ({ body: { name } }) => {
      const fooResult = await fooService.createFoo(name);

      const responseResult = fooResult
        .map((foo) => ({
          status: 201 as const,
          body: foo,
        }))
        .mapErr((err) => ({
          status: 400 as const,
          body: {
            statusCode: 400 as const,
            code: ApiErrorCode.DATA_WRONG_REQUEST,
            error: err.name,
            message: err.message,
          },
        }));
      return responseResult.isOk()
        ? responseResult.unwrap()
        : responseResult.unwrapErr();
    },
  });
}
