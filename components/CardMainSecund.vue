<script setup>
const props = defineProps({
    newsData: Object
})
</script>
<template>
    <NuxtLink :to="`/${newsData?.id}`" class="mb-2">
        <div class="w-full bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 cursor-pointer">
            <a>
                <img class="rounded-t-lg w-full h-28 object-cover" :src="newsData?.image" alt="" />
            </a>
            <div class="px-5 pb-2 pt-1">
                <div class="flex justify-between mt-1">
                    <span class="text-white text-xs font-medium me-2 px-3 py-1 rounded-md mb-2 bg-green-500 font-bold">
                        {{ newsData?.category?.name }}
                    </span>
                    <div class="flex justify-end text-xs items-center">
                        Postado {{ $dayjs(newsData?.createdAt).fromNow() }} • {{ $dayjs(newsData?.createdAt).format('DD/MM/YYYY') }}
                    </div>
                </div>
                <a>
                    <h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900">{{ newsData?.title }}</h5>
                </a>
            </div>
        </div>
    </NuxtLink>
</template>