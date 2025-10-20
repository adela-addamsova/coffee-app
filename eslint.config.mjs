import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import vitest from "eslint-plugin-vitest";

// Base rules and plugins
const baseLanguageOptions = {
  parser: tsParser,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};

const basePlugins = {
  "unused-imports": unusedImports,
  import: importPlugin,
  "@typescript-eslint": tsPlugin,
};

const baseRules = {
  ...js.configs.recommended.rules,
  ...tsPlugin.configs.recommended.rules,
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^[A-Z_]" },
  ],
  "unused-imports/no-unused-imports": "warn",
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "no-debugger": "warn",
  "import/no-unused-modules": ["warn", { unusedExports: true }],
};

export default [
  // Client config
  {
    files: ["client/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ...baseLanguageOptions,
      parserOptions: {
        ...baseLanguageOptions.parserOptions,
        project: "./client/tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
    },
    plugins: {
      ...basePlugins,
      vitest,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...baseRules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // Server config
  {
    files: ["server/**/*.{ts,tsx}"],
    languageOptions: {
      ...baseLanguageOptions,
      parserOptions: {
        ...baseLanguageOptions.parserOptions,
        project: [
          "./server/tsconfig.json",
          "./server/tsconfig.test.json"
        ],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      ...basePlugins,
    },
    rules: {
      ...baseRules,
    },
  },
];
