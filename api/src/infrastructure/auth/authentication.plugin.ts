import { fastifyRequestContext } from "@fastify/request-context";
import fastifyPlugin from "fastify-plugin";

import { ApiError } from "../error/errors.js";
import type { AuthenticatedUserType } from "./auth.model";
import { AuthClient } from "./auth.utilities.js";

declare module "@fastify/request-context" {
  interface RequestContextData {
    authToken: string | null;
    user: AuthenticatedUserType | null;
  }
}

interface AuthenticationPluginOpts {
  publicPaths?: string[];
  authIssuer: string;
  onAuthenticationSuccess?:
    | ((user: AuthenticatedUserType) => void)
    | ((user: AuthenticatedUserType) => Promise<void>);
}

export const authenticationPlugin = fastifyPlugin<AuthenticationPluginOpts>(
  (server, { publicPaths, authIssuer, onAuthenticationSuccess }) => {
    const authClient = new AuthClient(authIssuer);

    server.register(fastifyRequestContext, {
      hook: "preValidation",
      defaultStoreValues: { authToken: null, user: null },
    });

    server.addHook("preValidation", async (request, reply) => {
      try {
        if (
          publicPaths &&
          authClient.isPublicUrl({ url: request.url, publicPaths })
        ) {
          return;
        }
        try {
          const authToken = authClient.getTokenFromHeader(
            request.headers.authorization,
          );
          if (!authToken) {
            throw new Error("No auth token found");
          }

          const authenticatedUser = (await authClient.verifyAuthToken(
            authToken,
          )) as AuthenticatedUserType;

          if (!authenticatedUser) {
            throw new Error("No user found in token");
          }

          request.requestContext.set("authToken", authToken);
          request.requestContext.set("user", authenticatedUser);

          if (onAuthenticationSuccess) {
            await onAuthenticationSuccess(authenticatedUser);
          }
        } catch (err) {
          throw ApiError.unauthenticatedError({
            message: (err as Error).message,
          });
        }
      } catch (err) {
        reply.send(err);
      }
    });
  },
);
