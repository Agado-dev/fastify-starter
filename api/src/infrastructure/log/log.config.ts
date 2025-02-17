import type { PinoLoggerOptions } from "fastify/types/logger";

import { appConfig } from "../configuration/appConfig.js";
import type { EnvType } from "../configuration/configuration.model.js";

const logConfig = appConfig.get("log");

type LogOptsType = PinoLoggerOptions;

export const ENV_TO_LOGGER_OPTS: Record<EnvType, LogOptsType> = {
  LOCAL: {
    level: logConfig.level,
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  INTEG: {
    level: logConfig.level,
  },
  PROD: {
    level: logConfig.level,
  },
};
