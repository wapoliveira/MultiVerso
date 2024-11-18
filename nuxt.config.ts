// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    [
      '@pinia/nuxt',{
        autoImports: [
          'defineStore',
          'usePinia'
        ],
      },
    ], 
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
  ],
  css: [
    '@/assets/css/main.css',
  ],
  imports: {
    dirs: ['stores'],
  },
  runtimeConfig: {
    public: {
      ENV: process.env.ENV,
      apiBase: process.env.API_BASE,
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

      whatsapp: process.env.SOCIAL_WHATSAPP,
      instagram: process.env.SOCIAL_INSTAGRAM,
      facebook: process.env.SOCIAL_FACEBOOK,
      x: process.env.SOCIAL_X,
    },
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
})
