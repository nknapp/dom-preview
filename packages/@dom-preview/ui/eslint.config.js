import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  { ignores: ["dist/"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      // parser: require('vue-eslint-parser'),
      parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module",
      },
      sourceType: "module",
      globals: globals.browser,
    },
  },
];
