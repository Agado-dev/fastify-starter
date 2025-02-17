import type { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import jwt, { type JwtPayload } from "jsonwebtoken";
import JwksClient from "jwks-rsa";

const TOKEN_RE = /^Bearer (.+)$/i;

// create a class for this authentication function with a better name than AuthUtilities
export class AuthClient {
  jwksClient: JwksClient.JwksClient;

  constructor(issuer: string) {
    this.jwksClient = JwksClient({
      jwksUri: `${issuer}.well-known/jwks.json`,
    });
  }

  public getTokenFromHeader(
    authorizationHeader: string | undefined,
  ): string | null {
    if (!authorizationHeader) {
      return null;
    }
    const match = authorizationHeader.match(TOKEN_RE);
    if (!match || !match[1]) {
      return null;
    }
    return match[1] ?? null;
  }

  public verifyAuthToken(authToken: string): Promise<string | JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        authToken,
        this.getAuthKey.bind(this),
        {
          algorithms: ["RS256"],
        },
        (err, decoded) => {
          if (err) {
            return reject(err);
          }
          if (!decoded) {
            return reject(new Error("No decoded token found"));
          }
          return resolve(decoded);
        },
      );
    });
  }

  public isPublicUrl({
    url,
    publicPaths,
  }: {
    url: string;
    publicPaths: string[];
  }) {
    return publicPaths.some((path) => url.startsWith(path));
  }

  private getAuthKey(header: JwtHeader, cb: SigningKeyCallback) {
    this.jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return cb(err);
      }

      if (!key) {
        return cb(new Error("No key found"));
      }

      const signingKey = key.getPublicKey();
      return cb(null, signingKey);
    });
  }
}
