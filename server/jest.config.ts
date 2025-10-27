import type { Config } from "jest";

const config: Config = {
  rootDir: ".",
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "./reports/test-report.html",
      },
    ],
  ],
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.ts",
    "<rootDir>/tests/integration/*.test.ts",
  ],
  moduleNameMapper: {
    "^@server/(.*)$": "<rootDir>/$1",
    "^@db/(.*)$": "<rootDir>/db/$1",
    "^@routes/(.*)$": "<rootDir>/routes/$1",
    "^@shared/(.*)$": "<rootDir>/../shared/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: "./tsconfig.json", useESM: true },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
};

export default config;
