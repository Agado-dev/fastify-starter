import path, { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: resolve(__dirname),
    environment: "node",

    include: ["./integration-tests/**/*.integration.spec.ts"],
    hookTimeout: 20_000,

    coverage: {
      clean: false,
      provider: "istanbul",
      include: ["**/src/**/*.ts"],
      exclude: [
        "**/__tests__/**",
        "**/*.d.ts",
        "**/*.spec.ts",
        "**/*.model.ts",
      ],
      reporter: ["text", "json-summary"],
      reportsDirectory: "coverage-integration",
    },
  },
});
