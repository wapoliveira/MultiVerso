
<script setup>
const props = defineProps({
    newsData: Object,
    category: Object
})
</script>
<template>
  <div v-if="newsData">
    <NuxtLink :to="`/${newsData?.id}`">
      <div class="w-full bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:bg-gray-50">
        <a>
          <img class="rounded-t-lg w-full h-80 object-cover" :src="newsData?.image" alt="Notícia" />
        </a>
        <div class="p-5">
          <a>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{{ newsData?.title }}</h5>
          </a>
          <div class="flex justify-between">
            <span class="text-white text-xs font-medium me-2 px-3 py-1 rounded-md mb-2 bg-green-500 font-bold">
              {{category ? category?.name : newsData?.category?.name }}
            </span>
            <div class="flex justify-end text-xs items-center">
              <span>Postado {{ $dayjs(newsData?.createdAt).fromNow() }} • {{ $dayjs(newsData?.createdAt).format('DD/MM/YYYY') }}</span>
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
