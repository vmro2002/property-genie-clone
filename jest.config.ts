import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mock Next.js router for hook tests
    "^next/router$": "<rootDir>/node_modules/next-router-mock",
    "^next/navigation$":
      "<rootDir>/node_modules/next-router-mock/dist/navigation",
    // Match the MUI styled-engine alias in next.config.ts
    "^@mui/styled-engine$": "<rootDir>/node_modules/@mui/styled-engine-sc",
  },
  testMatch: ["<rootDir>/src/__tests__/**/*.(test|spec).(ts|tsx)"],
  // Exclude e2e tests from jest
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/e2e/"],
};

export default createJestConfig(config);
