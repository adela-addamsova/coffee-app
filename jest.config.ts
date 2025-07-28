import type { Config } from "jest";

const config: Config = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  projects: [
    {
      displayName: "backend",
      testEnvironment: "node",
      testMatch: ["<rootDir>/server/**/*.(test|spec).ts"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/server/$1",
        "^@db/(.*)$": "<rootDir>/server/db/$1",
        "^@routes/(.*)$": "<rootDir>/server/routes/$1",
        "^@shared/(.*)$": "<rootDir>/shared/$1",
      },
      transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "./server/tsconfig.json" }],
      },
    },
  ],
};

export default config;
