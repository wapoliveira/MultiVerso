import { Cloudinary } from '@cloudinary/url-gen'

export default defineNuxtPlugin(() => {
  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: useRuntimeConfig().public.cloudinaryCloudName
    },
    url: {
      secure: true // Usar URLs seguras por HTTPS
    }
  })

  return {
    provide: {
      cloudinary
    }
  }
})
