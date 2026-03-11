// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  components: [
    { path: '~/components', ignore: ['**/ui/**'] }
  ],
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/icon'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT || '3306',
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
  },
  devtools: { enabled: true },
})