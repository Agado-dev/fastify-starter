import type { Resolver } from "awilix";

export type DiNamePairAndKeys<T> = { [U in keyof T]: Resolver<T[U]> };
