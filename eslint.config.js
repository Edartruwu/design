// ESLint is intentionally minimal — Biome covers formatting, imports, most lint rules.
// ESLint is kept only for what Biome does not:
// 1. eslint-plugin-react-hooks v7+ flat config — ships the React Compiler 1.0 rule set
//    (use-memo, preserve-manual-memoization, immutability, refs, set-state-in-effect,
//    purity, set-state-in-render, static-components, error-boundaries, gating, config,
//    globals, void-use-memo, incompatible-library, unsupported-syntax).
//    As of React Compiler 1.0 these rules ship inside eslint-plugin-react-hooks.
//    There is no separate eslint-plugin-react-compiler.
// 2. eslint-plugin-jsx-a11y.
//
// Critical: exhaustive-deps is elevated to "error" so silent compiler opt-outs fail CI.

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/node_modules/**",
    "**/.changeset/**",
    "**/*.min.js",
    "apps/playground/src/**", // playground linted through its own stage
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // React Compiler: bump from warn to error so opt-outs fail CI.
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/incompatible-library": "error",
      "react-hooks/unsupported-syntax": "error",

      // TS hygiene that Biome doesn't enforce.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Type-test files: variables exist only to assert types; disable unused-var
  // rules AND react-hooks rules (we're not actually running React here).
  // MUST come AFTER the main config to override its rules.
  {
    files: ["**/tests/type/**/*.ts", "**/*.test-d.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/static-components": "off",
      "react-hooks/use-memo": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-render": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/globals": "off",
    },
  },
]);
