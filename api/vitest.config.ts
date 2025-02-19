import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: resolve(__dirname),
    globals: true,
    include: ["**/__tests__/*.spec.ts"],

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
      reportsDirectory: "coverage-unit",
    },
  },
});
