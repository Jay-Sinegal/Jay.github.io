import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://jaylensinegal.com",
  output: "static",
  compressHTML: true,
  build: {
    assets: "_astro",
  },
  integrations: [tailwind({ applyBaseStyles: false })],
});