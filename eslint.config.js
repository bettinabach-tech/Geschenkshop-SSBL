// ESLint: findet Programmierfehler in .ts/.js/.astro-Dateien.
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/", ".astro/", "node_modules/"] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
