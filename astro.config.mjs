import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://inversax.com',
  integrations: [tailwind()],
  output: 'server',
  adapter: cloudflare(),
  trailingSlash: "never",
  build: {
    format: 'file'
  }
});

