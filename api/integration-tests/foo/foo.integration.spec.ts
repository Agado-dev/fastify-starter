import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { FOO_DATUM } from "../../prisma/seeds/datum/foo.js";
import { IntegrationTestContext } from "../integrationTestContext.js";

describe("foo", () => {
  const integrationTestContext = new IntegrationTestContext();

  beforeAll(async () => {
    await integrationTestContext.start();
  });

  it("should reject an unauthenticated user", async () => {
    const response = await integrationTestContext.tsRestClient.foo.get({
      params: {
        name: "Test",
      },
    });

    expect(response.status).toBe(401);
  });

  it("should retreive a foo by it's name", async () => {
    const token = await integrationTestContext.getAuthToken();

    const fooName = FOO_DATUM[0].name;
    const response = await integrationTestContext.tsRestClient.foo.get({
      params: {
        name: fooName,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
    if (response.status !== 200) {
      throw new Error("Response status is not 200");
    }
    expect(response.body.name).toEqual(fooName);
  });

  afterAll(async () => {
    await integrationTestContext.dispose();
  });
});
