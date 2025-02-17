import { ApiErrorCode, type ApiErrorType } from "@agado/api-starter-contract";
import createError, { type FastifyError } from "@fastify/error";

export type FastifyApiError = FastifyError & {
  code: ApiErrorType;
  statusCode: number;
};
interface ApiErrorOpts {
  apiErrorCode?: ApiErrorType;
  httpStatus?: number;
  message?: string;
}
function apiError(opts?: ApiErrorOpts) {
  return createError(
    opts?.apiErrorCode ?? ApiErrorCode.API_ERROR,
    opts?.message ?? "Api error",
    opts?.httpStatus ?? 500,
  )();
}
function unauthenticatedError(opts?: ApiErrorOpts) {
  return createError(
    opts?.apiErrorCode ?? ApiErrorCode.AUTHENT_UNAUTHENTICATED,
    opts?.message ?? "Unauthenticated",
    opts?.httpStatus ?? 401,
  )();
}
function unauthorizedError(opts?: ApiErrorOpts) {
  return createError(
    opts?.apiErrorCode ?? ApiErrorCode.AUTHENT_UNAUTHORIZED,
    opts?.message ?? "Unauthorized",
    opts?.httpStatus ?? 403,
  )();
}

function badRequestError(opts?: ApiErrorOpts) {
  return createError(
    opts?.apiErrorCode ?? ApiErrorCode.DATA_WRONG_REQUEST,
    opts?.message ?? "Bad request",
    opts?.httpStatus ?? 400,
  )();
}

function notFoundError(opts?: ApiErrorOpts) {
  return createError(
    opts?.apiErrorCode ?? ApiErrorCode.DATA_NOT_FOUND,
    opts?.message ?? "Not found",
    opts?.httpStatus ?? 404,
  )();
}

export const ApiError = {
  apiError,
  unauthenticatedError,
  unauthorizedError,
  badRequestError,
  notFoundError,
};

export function isApiError(error: unknown): error is FastifyApiError {
  return (
    error instanceof Error &&
    "code" in error &&
    Object.values(ApiErrorCode).includes(
      (error as FastifyError).code as ApiErrorType,
    )
  );
}

export function isApiErrorOfType(error: unknown, code: ApiErrorType) {
  if (isApiError(error)) {
    return error.code === code;
  }

  return false;
}
