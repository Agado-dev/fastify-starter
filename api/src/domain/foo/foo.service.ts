import type { Cradle } from "@fastify/awilix";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Result } from "result-in-ts";
import type { PrismaClientType } from "../../infrastructure/db/prisma.client.js";
import {
  ApiError,
  type FastifyApiError,
} from "../../infrastructure/error/errors.js";
import { FOO_FIELDS_TO_SELECT, type FooDbType } from "./foo.model.js";

export class FooService {
  private prisma: PrismaClientType;

  constructor({ prismaClient }: Cradle) {
    this.prisma = prismaClient;
  }

  async getFoo(name: string): Promise<Result<FooDbType, FastifyApiError>> {
    const foo = await this.prisma.foo.findUnique({
      select: FOO_FIELDS_TO_SELECT,
      where: { name },
    });
    if (!foo) {
      return Result.err(
        ApiError.notFoundError({ message: `foo with name ${name} not found` }),
      );
    }

    return Result.ok(foo);
  }

  async createFoo(name: string): Promise<Result<FooDbType, FastifyApiError>> {
    try {
      const foo = await this.prisma.foo.create({
        select: FOO_FIELDS_TO_SELECT,
        data: { name },
      });
      return Result.ok(foo);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return Result.err(
          ApiError.badRequestError({
            message: `foo with name ${name} already exists`,
          }),
        );
      }
      throw error;
    }
  }
}
