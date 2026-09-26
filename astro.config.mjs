import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://jaylensinegal.com",
  output: "static",
  compressHTML: true,
  build: {
    assets: "_astro",
    inlineStylesheets: "always",
  },
});