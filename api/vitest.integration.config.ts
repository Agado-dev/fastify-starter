import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: resolve(__dirname),
    environment: "node",
    include: ["./integration-tests/**/*.integration.spec.ts"],
    hookTimeout: 20_000,
  },
});
