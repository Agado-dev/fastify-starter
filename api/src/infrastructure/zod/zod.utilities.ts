import { z } from "zod";

export function prismaEnumToZodEnum<T extends string>(
  values: Record<T, string>,
) {
  return z.enum(Object.keys(values) as [T, ...T[]]);
}

export function toOptionalFields<Schema extends z.AnyZodObject>(
  schema: Schema,
) {
  const entries = Object.entries(schema.shape) as [
    keyof Schema["shape"],
    z.ZodTypeAny,
  ][];
  const newProps = entries.reduce(
    (acc, [key, value]) => {
      acc[key] = value.optional();
      return acc;
    },
    {} as {
      [key in keyof Schema["shape"]]: z.ZodOptional<Schema["shape"][key]>;
    },
  );
  return z.object(newProps);
}

/**
 * Infer the type of a zod schema but return never if it can't be inferred.
 *
 * @template T The zod schema
 * @returns The inferred type or `never`
 */
type InferSchemaType<T> = T extends z.ZodObject<infer U> ? U : never;

/**
 * Combine multiple zod schemas into one.
 *
 * @template T The zod schemas
 * @returns The combined zod schema
 */
type CombinedSchemaType<T extends z.ZodObject<z.ZodRawShape>[]> = {
  [K in keyof T]: InferSchemaType<T[K]>;
};
