import type { Cradle } from "@fastify/awilix";
import type { GetUsers200ResponseOneOfInner, UserIdentity } from "auth0";
import jwt from "jsonwebtoken";
import { appConfig } from "../../infrastructure/configuration/appConfig.js";
import type { AppLoggerType } from "../../infrastructure/log/logger.model";

const authConfig = appConfig.get("auth");

export class UserService {
  private _logger: AppLoggerType;
  private _accessToken?: string;

  constructor({ logger }: Cradle) {
    this._logger = logger;
  }

  async getUserProfile(userId: string) {
    const token = await this.getToken();

    const response = await fetch(`${authConfig.issuer}api/v2/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = (await response.json()) as GetUsers200ResponseOneOfInner;
    return user;
  }

  async getAuthToken() {
    const response = await fetch(`${authConfig.issuer}oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: authConfig.managementApiClientId,
        client_secret: authConfig.managementApiClientSecret,
        audience: `${authConfig.issuer}api/v2/`,
        grant_type: "client_credentials",
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`, {
        cause: response,
      });
    }

    const data = (await response.json()) as {
      access_token: string;
      token_type: "Bearer";
    };

    return data.access_token;
  }

  private async getToken() {
    const exp = this._accessToken
      ? (jwt.decode(this._accessToken, { json: true })?.exp ?? 0)
      : 0;
    const willExpire = exp - Date.now() / 1000 < 60;

    if (!this._accessToken || willExpire) {
      this._logger.info("Fetching new access token");
      this._accessToken = await this.getAuthToken();
      return this._accessToken;
    }
    return this._accessToken;
  }
}
