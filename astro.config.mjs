// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://fake-site.qed", // TODO: change when deploying
  integrations: [tailwind()],
  server: {
    port: 3000,
  },
});
