import { createRequire } from "node:module";
import path from "node:path";

import appRoot from "app-root-path";
import convict from "convict";
import convict_format_with_validator from "convict-format-with-validator";
import dotenv from "dotenv";
import { expand as dotenvExpand } from "dotenv-expand";

import { Result } from "result-in-ts";
import { ENVS, type EnvType } from "./configuration.model.js";

const require = createRequire(import.meta.url);
const packageJson = require(`${appRoot}/package.json`);

convict.addFormats(convict_format_with_validator);

const dotenvPath = process.env.CONFIG_PATH
  ? path.resolve(process.cwd(), process.env.CONFIG_PATH)
  : undefined;

if (dotenvPath) {
  console.log(`Loading env variables from "${dotenvPath}"`);
}
dotenvExpand(dotenv.config(dotenvPath ? { path: dotenvPath } : undefined));

export const appConfig = convict({
  environment: {
    env: {
      doc: "application environment",
      format: ENVS,
      default: "PROD" as EnvType,
      env: "APP_ENV",
    },
  },
  server: {
    port: {
      doc: "server port",
      format: "port",
      default: 8080,
      env: "SERVER_PORT",
    },
    timeout: {
      doc: "Request timeout (in ms)",
      format: "int",
      default: 3000,
      env: "SERVER_TIMEOUT",
    },
  },
  documentation: {
    enabled: {
      doc: "Enable documentation",
      format: "Boolean",
      default: false,
      env: "DOCUMENTATION_ENABLED",
    },
  },

  auth: {
    issuer: {
      doc: "Auth issuer",
      format: String,
      default: null as unknown as string,
      env: "AUTH_ISSUER",
    },
    managementApiClientId: {
      doc: "Auth management client id",
      format: String,
      default: null as unknown as string,
      env: "AUTH0_MANAGEMENT_API_CLIENT_ID",
    },
    managementApiClientSecret: {
      doc: "Auth management client secret",
      format: String,
      default: null as unknown as string,
      env: "AUTH0_MANAGEMENT_API_CLIENT_SECRET",
    },
  },
  log: {
    level: {
      doc: "Log level",
      format: ["fatal", "error", "warn", "info", "debug", "trace"],
      default: "info",
      env: "LOG_LEVEL",
    },
    format: {
      doc: "Log format",
      format: "*",
      default: "tiny",
      env: "LOG_FORMAT",
    },
  },
  db: {
    url: {
      doc: "Database URL",
      format: String,
      default: null as unknown as string,
      env: "DATABASE_URL",
    },
    prismaOptimizeEnabled: {
      doc: "Prisma optimize enabled",
      format: Boolean,
      default: false,
      env: "PRISMA_OPTIMIZE_ENABLED",
    },
    prismaOptimizeApiKey: {
      doc: "Prisma optimize key",
      format: String,
      default: null as unknown as string,
      env: "PRISMA_OPTIMIZE_API_KEY",
    },
  },

  monitoring: {
    sentryDsn: {
      doc: "Sentry DSN",
      format: "*",
      nullable: true,
      default: undefined as unknown as string | undefined,
      env: "MONITORING_SENTRY_DSN",
    },
  },
  debug: {
    sourcemap: {
      doc: "Enable source-map",
      format: "Boolean",
      default: false,
      env: "SOURCE_MAP",
    },
  },
});

appConfig.validate({ allowed: "strict" });

export function getAppVersion(): string {
  return `${packageJson.version}-${appConfig.get("environment").env}`;
}

interface PgConfigType {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  schema: string | null;
}
export function getPgClientConfig(
  dbUrlStr: string,
): Result<PgConfigType, { message: string }> {
  try {
    const dbUrl = new URL(dbUrlStr);

    const port = Number.parseInt(dbUrl.port, 10);
    if (Number.isNaN(port)) {
      return Result.err({
        message: `Invalid port number "${dbUrl.port}" in db connection string url "${dbUrlStr}".`,
      });
    }
    return Result.ok({
      host: dbUrl.hostname,
      port,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      schema: dbUrl.searchParams.get("schema"),
    });
  } catch (error) {
    return Result.err({
      message: `Unable to parse db connection string url "${dbUrlStr}". ${error instanceof Error ? error.message : ""}`,
    });
  }
}
