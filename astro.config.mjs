import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://c9ine.com',
  output: 'static',
  image: {
    domains: [],
  },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
