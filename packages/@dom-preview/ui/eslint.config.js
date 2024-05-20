import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: ["dist/**"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      // Allow TypeScript in script sections
      // https://www.npmjs.com/package/vue-eslint-parser#parseroptionsparser
      parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module",
      },
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "vue/comment-directive": "error",
      "vue/jsx-uses-vars": "error",
    },
    processor: "vue/vue",
  },
  {
    rules: {
      "no-console": ["warn"],
    },
  },
];
