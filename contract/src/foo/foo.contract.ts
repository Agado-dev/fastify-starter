import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ApiErrorSchema,
  BadRequestApiErrorSchema,
  NotFoundApiErrorSchema,
  UnauthenticatedApiErrorSchema,
} from "../error/error.model.js";
import { FooSchema } from "./foo.model";

const tsRestContract = initContract();

export const fooContract = tsRestContract.router({
  get: {
    summary: "Get an foo",
    method: "GET",
    path: "/foo/:name",
    pathParams: z.object({
      name: z.string().nonempty(),
    }),
    responses: {
      200: FooSchema,
      404: NotFoundApiErrorSchema,
      401: UnauthenticatedApiErrorSchema,
    },
  },
  create: {
    summary: "Create a new foo",
    method: "POST",
    path: "/foo",
    body: z.object({
      name: z.string().nonempty(),
    }),
    responses: {
      201: z.object({
        id: z.string(),
        name: z.string(),
      }),
      400: BadRequestApiErrorSchema,
      401: UnauthenticatedApiErrorSchema,
    },
  },
});
