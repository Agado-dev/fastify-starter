export const ENVS = ["LOCAL", "INTEG", "PROD"] as const;
export type EnvType = (typeof ENVS)[number];

export function isLocalEnv(env: EnvType): boolean {
  return env === "LOCAL";
}

export function isIntegEnv(env: EnvType): boolean {
  return env === "INTEG";
}

export const SERVICE_TO_SERVICE_MODE = ["default", "impersonated"] as const;
export type ServiceToServiceModeType = (typeof SERVICE_TO_SERVICE_MODE)[number];
