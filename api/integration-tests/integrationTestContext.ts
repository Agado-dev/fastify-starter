import { exec } from "node:child_process";
import { promisify } from "node:util";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { createApp } from "../src/app.js";
import type { UserService } from "../src/domain/user/user.service.js";
import {
  appConfig,
  getPgClientConfig,
} from "../src/infrastructure/configuration/appConfig.js";
import { resolve } from "../src/infrastructure/dependency-injection/di.resolver.js";
import {
  type TestTsRestClient,
  createTestTsRestClient,
} from "./fastifyInjectTsRestClient.js";

const execAsync = promisify(exec);

type AppInstanceType = Awaited<ReturnType<typeof createApp>>;

export class IntegrationTestContext {
  private _app: Readonly<AppInstanceType>;
  private _tsRestClient: Readonly<TestTsRestClient>;

  private _dbContainer: StartedPostgreSqlContainer;

  private _userService: UserService;

  async start() {
    const dbUrl = await await this.createDatabase();

    appConfig.set("db.url", dbUrl);

    this._app = await createApp();
    this._userService = resolve("userService");
    this._tsRestClient = createTestTsRestClient(this._app);
  }

  async getAuthToken() {
    const token = await this._userService.getAuthToken();
    return token;
  }

  private async createDatabase() {
    const dbSettingsResult = getPgClientConfig(appConfig.get("db.url"));
    if (dbSettingsResult.isErr()) {
      throw new Error(dbSettingsResult.unwrapErr().message);
    }
    const dbSettings = dbSettingsResult.unwrap();

    this._dbContainer = await new PostgreSqlContainer("postgres:16")
      .withUsername(dbSettings.user)
      .withPassword(dbSettings.password)
      .withDatabase(dbSettings.database)
      .withExposedPorts(5432)
      .start();

    const dbPort = this._dbContainer.getMappedPort(5432);
    const dbHost = this._dbContainer.getHost();

    // Configure Prisma to use the test container database
    const dbUrl = `postgresql://${dbSettings.user}:${dbSettings.password}@${dbHost}:${dbPort}/${dbSettings.database}`;

    const { stdout, stderr } = await execAsync(
      `pnpm prisma:generate && DATABASE_URL=${dbUrl} pnpm prisma:migrate`,
    );
    console.log(stdout);
    if (stderr?.length) {
      console.warn(stderr);
    }
    return dbUrl;
  }

  async dispose() {
    if (this._app) {
      await this._app.close();
    }
    if (this._dbContainer) {
      await this._dbContainer.stop();
    }
  }

  get app() {
    if (!this._app) {
      throw new Error(
        "App not initialized. Ensure to call start() before accessing the app instance.",
      );
    }
    return this._app;
  }

  get tsRestClient() {
    if (!this._app) {
      throw new Error(
        "TsRestClient not initialized. Ensure to call start() before accessing the tsRestClient instance.",
      );
    }
    return this._tsRestClient;
  }
}
