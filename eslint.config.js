import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["ui/dist/**", "dist/**", "packages/**"],
  },
  {
    files: ["server/**", "src/**"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["playground/**", "ui/src/**"],
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["playground/**/*.test.js"],
    languageOptions: { globals: globals.jest },
  },
];
