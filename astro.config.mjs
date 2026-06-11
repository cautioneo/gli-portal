// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cautioneo-gli.com',
  outDir: './dist',
  build: { format: 'directory' },
  trailingSlash: 'never',
});
