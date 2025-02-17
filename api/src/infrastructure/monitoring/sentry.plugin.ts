import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import type { FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";
import type { EnvType } from "../configuration/configuration.model.js";

declare module "fastify" {
  interface FastifyRequest {
    transactionId?: string;
    handleSentryError?: (error: Error, request: FastifyRequest) => void;
    finishSentryTransaction?: (response: FastifyReply) => void;
  }
}

interface SentryPluginOpts {
  sentryDsn: string;
  appEnv: EnvType;
  appVersion: string;
  sampleRates?: {
    // We recommend adjusting this value in production, or using tracesSampler
    tracesSampleRate?: number;
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate?: number;
  };
}
export const sentryPlugin = fastifyPlugin<SentryPluginOpts>(
  async (server, { appEnv, appVersion, sentryDsn, sampleRates }) => {
    if (!sampleRates) {
      console.log(
        "[WARN] Sentry: sampleRates not provided, using default values. It may create events spikes and affect your quota!!!",
      );
    }

    Sentry.init({
      dsn: sentryDsn,
      environment: appEnv,
      release: appVersion,
      integrations: [nodeProfilingIntegration()],

      tracesSampleRate: sampleRates?.tracesSampleRate ?? 1.0,
      profilesSampleRate: sampleRates?.profilesSampleRate ?? 1.0,
    });
    Sentry.setupFastifyErrorHandler(server);
  },
);
