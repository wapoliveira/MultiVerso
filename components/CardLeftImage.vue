<script setup>
const props = defineProps({
    newsData: Object
})
</script>
<template>
    <div class="mb-2">
        <NuxtLink :to="`/${newsData?.id}`">
            <a class="flex flex-col items-center bg-white rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100">
                <img class="object-cover rounded-t-lg w-[6.25rem] h-[6.25rem] md:rounded-none md:rounded-s-lg" :src="newsData?.image" alt="">
                <div class="flex flex-col justify-between px-2 leading-normal">
                    <h5 class="mb-2 text-sm font-bold tracking-tight text-gray-900">{{ newsData?.title }}</h5>
                </div>
            </a>
        </NuxtLink>
    </div>
</template>