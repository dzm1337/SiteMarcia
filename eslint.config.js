// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default defineConfig([
  globalIgnores(["dist/", ".astro/", "node_modules/"]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    // Os ficheiros de configuração correm em Node, não no browser.
    files: ["**/*.config.{js,mjs,ts}"],
    languageOptions: {
      globals: { process: "readonly" },
    },
  },
]);
