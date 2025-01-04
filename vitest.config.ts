import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // Adjust if you're using a different environment
    coverage: {
      provider: "istanbul", // Set the coverage provider to 'istanbul'
      reporter: ["text", "json", "html", "lcov"], // Add 'lcov' for external tools like SonarQube
      reportsDirectory: "./coverage", // Specify the output directory
      include: ["src/**/*.ts"], // Only include source files
      exclude: ["node_modules/", "dist/", "tests/"], // Exclude unnecessary files
    },
  },
});
