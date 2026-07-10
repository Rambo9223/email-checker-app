import { defineConfig } from "vitest/config";
//import 'vitest-browser-react'

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "src/tests/setupTests.ts",
  },
  
});
// ./setup-file.ts
// add an import at the top of your setup file so TypeScript can pick up types

