import { describe, expect, it } from "vitest";
import { getPgClientConfig } from "../appConfig.js";

describe("getPgClientConfig", () => {
  it("should parse correctly the provided database URL from env", () => {
    const pgConfigResult = getPgClientConfig(
      "postgresql://exampleuser:examplepassword@db:5366/exampledb?schema=myschema",
    );
    expect(pgConfigResult.isOk()).toBeTruthy();
    if (pgConfigResult.isErr()) {
      throw new Error("Unexpected error result");
    }
    expect(pgConfigResult.unwrap()).toEqual({
      host: "db",
      port: 5366,
      user: "exampleuser",
      password: "examplepassword",
      database: "exampledb",
      schema: "myschema",
    });
  });

  it("should return an error when the provided database URL is invalid", () => {
    const pgConfigResult = getPgClientConfig("postgresql:/user:password@db");

    expect(pgConfigResult.isErr()).toBeTruthy();
  });
});
