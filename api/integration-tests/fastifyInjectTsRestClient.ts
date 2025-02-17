import type { OutgoingHttpHeaders } from "node:http";
import { appApiContract } from "@agado/api-starter-contract";
import { initClient } from "@ts-rest/core";
import type { FastifyInstance } from "fastify";

export type TestTsRestClient = ReturnType<typeof createTestTsRestClient>;

export function createTestTsRestClient(fastify: FastifyInstance) {
  return initClient(appApiContract, {
    baseUrl: "", // Since we're using inject, leave this empty

    api: async ({ path, method, headers, body }) => {
      if (!isAValidMethod(method)) {
        throw new Error(`Invalid method: ${method}`);
      }
      // Custom fetch to mimic how inject works
      const injectResponse = await fastify.inject({
        method,
        url: path,
        headers,
        payload: body ?? undefined,
      });

      return {
        status: injectResponse.statusCode,
        body: JSON.parse(injectResponse.body),
        headers: convertOutgoingHttpHeadersToHeaders(injectResponse.headers),
      };
    },
  });
}

function isAValidMethod(
  method: string,
): method is "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD" {
  return ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"].includes(
    method,
  );
}

function convertOutgoingHttpHeadersToHeaders(
  outgoingHeaders: OutgoingHttpHeaders,
): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(outgoingHeaders)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        for (const v of value) {
          headers.append(key, v);
        }
      } else {
        headers.set(key, `${value}`);
      }
    }
  }

  return headers;
}
