<script setup>
const props = defineProps({
    newsData: Object,
    category: Object
})
</script>
<template>
    <NuxtLink :to="`/${newsData?.id}`">
        <div class="w-full bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:bg-gray-50">
            <a href="#">
                <img class="rounded-t-lg w-full h-20 object-cover" :src="newsData?.image" alt="" />
            </a>
            <div class="px-3 pt-1">
                <a href="#">
                    <h5 class="mb-2 text-sm font-bold tracking-tight text-gray-900">{{ newsData?.title }}</h5>
                </a>
                <p class="mb-3 font-normal text-sm text-gray-700">
                    Postado {{ $dayjs(newsData?.createdAt).fromNow() }} • {{ $dayjs(newsData?.createdAt).format('DD/MM/YYYY') }}
                </p>
            </div>
        </div>
    </NuxtLink>
    
</template>