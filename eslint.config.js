import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: ["**/dist/"],
  },
  {
    rules: {
      "no-restricted-syntax": [
        "warn",
        "CallExpression[callee.name='debugInPlayMode']",
      ],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module",
      },
      sourceType: "module",
      globals: globals.browser,
    },
  },
  {
    files: [
      "**/*.test.ts",
      "**/*.test.js",
      "**/test-utils/",
      "**/*.test-helper.ts",
      "**/setupTests.ts",
      "**/setupTests.js",
    ],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    files: ["scripts/*"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ["packages/@dom-preview/server"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["packages/@dom-preview/ui"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: { globals: globals.commonjs },
  },
  prettier,
  {
    rules: {
      "no-console": "error",
    },
  },
  {
    files: ["**/examples/*.ts", "scripts/"],
    rules: {
      "no-console": "off",
    },
  },
];
