import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/unit/**", "test/integration/**"],
    exclude: ["node_modules/", "dist/", "test/performance/**"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: ["node_modules/", "dist/", "tests/"],
    },
  },
});
