import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { IntegrationTestContext } from "../integrationTestContext.js";

describe("authentication", () => {
  const integrationTestContext = new IntegrationTestContext();

  beforeAll(async () => {
    await integrationTestContext.start();
  });

  it("should accept a public endpoint", async () => {
    const response = await integrationTestContext.tsRestClient.assets.list({
      query: { limit: 10_000 },
    });

    expect(response.status).toBe(200);
  });

  it("should reject an authenticated endpoint ", async () => {
    const response = await integrationTestContext.tsRestClient.foo.create({
      body: {
        name: "Test",
      },
    });
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await integrationTestContext.dispose();
  });
});
