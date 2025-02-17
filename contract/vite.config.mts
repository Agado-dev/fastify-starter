import path from "node:path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  base: "./",
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/contract.ts"),
      name: "contract",
      fileName: "contract",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["@ts-rest/core", "zod"],
    },
  },
  plugins: [dts()],
});
