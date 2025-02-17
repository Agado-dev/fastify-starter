import { type Cradle, diContainer } from "@fastify/awilix";

export function resolve<TService extends keyof Cradle>(
  service: TService,
): Cradle[TService] {
  return diContainer.resolve(service);
}
