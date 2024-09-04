import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

import tailwind from "@astrojs/tailwind";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), alpinejs()],
  adapter: node({
    mode: "standalone"
  })
});