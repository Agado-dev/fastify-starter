export const ENVS = ["LOCAL", "INTEG", "PROD"] as const;
export type EnvType = (typeof ENVS)[number];

export function isLocalEnv(env: EnvType): boolean {
  return env === "LOCAL";
}

export function isIntegEnv(env: EnvType): boolean {
  return env === "INTEG";
}
