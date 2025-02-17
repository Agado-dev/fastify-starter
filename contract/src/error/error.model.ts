import type { HTTPStatusCode } from "@ts-rest/core";
import { z } from "zod";

function unionOfNumbers<T extends readonly number[]>(values: T) {
  const literals = values.map((value) => z.literal(value)) as [
    z.ZodLiteral<T[number]>,
    z.ZodLiteral<T[number]>,
    ...z.ZodLiteral<T[number]>[],
  ];
  return z.union(literals);
}

/**
 * HTTP status codes
 *
 * Equivalent to {@link HTTPStatusCode} at runtime
 */
const HTTP_STATUS_CODES = [
  100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 300, 301, 302, 303,
  304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410,
  411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 428,
  429, 431, 451, 500, 501, 502, 503, 504, 505, 507, 511,
] as const satisfies HTTPStatusCode[];

export const ApiErrorCode = {
  API_ERROR: "@API/ERROR",

  DATA_WRONG_REQUEST: "@DATA/WRONG_REQUEST",
  DATA_NOT_FOUND: "@DATA/NOT_FOUND",

  AUTHENT_UNAUTHENTICATED: "@AUTHENT/UNAUTHENTICATED",
  AUTHENT_UNAUTHORIZED: "@AUTHENT/UNAUTHORIZED",
} as const;

export type ApiErrorType = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export const ApiErrorSchema = z.object({
  statusCode: unionOfNumbers(HTTP_STATUS_CODES),
  code: z.enum(
    Object.values(ApiErrorCode) as [ApiErrorType, ...ApiErrorType[]],
  ),
  error: z.string(),
  message: z.string(),
});

export const NotFoundApiErrorSchema = z.object({
  statusCode: z.literal(404),
  code: z.literal(ApiErrorCode.DATA_NOT_FOUND),
  error: z.string(),
  message: z.string(),
});

export const UnauthenticatedApiErrorSchema = z.object({
  statusCode: z.literal(401),
  code: z.literal(ApiErrorCode.AUTHENT_UNAUTHENTICATED),
  error: z.string(),
  message: z.string(),
});

export const UnauthorizedApiErrorSchema = z.object({
  statusCode: z.literal(403),
  code: z.literal(ApiErrorCode.AUTHENT_UNAUTHORIZED),
  error: z.string(),
  message: z.string(),
});

export const BadRequestApiErrorSchema = z.object({
  statusCode: z.literal(400),
  code: z.literal(ApiErrorCode.DATA_WRONG_REQUEST),
  error: z.string(),
  message: z.string(),
});
