import type { Config } from "jest";

const config: Config = {
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
  projects: [
    {
      displayName: "backend",
      testEnvironment: "node",
      testMatch: ["<rootDir>/server/**/*.(test|spec).ts"],
      moduleNameMapper: {
        "^@server/(.*)$": "<rootDir>/server/$1",
        "^@db/(.*)$": "<rootDir>/server/db/$1",
        "^@routes/(.*)$": "<rootDir>/server/routes/$1",
        "^shared/(.*)$": "<rootDir>/shared/$1",
      },
      transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "./server/tsconfig.json" }],
      },
    },
  ],
};

export default config;
