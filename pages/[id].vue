<script setup>
useHead({
    title: 'MultiVerso - Noticia',
})

definePageMeta({
    layout: "default",
    name: "MultiVerso - Noticia",
})

const route = useRouter()
const newData = ref()
const newDataTwo = ref()

onMounted(() => {
  if (route?.currentRoute?.value?.params?.id) {
    showNew()
    listNews()
  }
})

const showNew = async () => {
  const newsId = route?.currentRoute?.value?.params?.id;

  if (newsId) {
    try {
      // Ajuste a URL para rota dinâmica
      const response = await fetch(`/api/news?id=${newsId}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar notícia: ${response.statusText}`);
      }

      const data = await response.json();
      newData.value = data;
    } catch (error) {
      console.error('Erro ao carregar a notícia:', error);
    }
  } else {
    console.warn('Nenhum ID fornecido.');
  }
};

const listNews = async () => {
  try {
    const response = await fetch('/api/news?randomTwo=true');
    const data = await response.json();

    // Verifica se houve erro na resposta
    if (data.error) {
      console.error(data.message); 
    } else {
        newDataTwo.value = data; 
    }
  } catch (error) {
    console.error('Erro ao carregar as notícias:', error);
  }
};
</script>
<template>
    <div class="grid grid-cols-4 gap-3">
        <div>
            <div class="w-full mb-4 h-40 bg-gray-500 font-bold text-white grid content-center justify-items-center rounded-lg">
                ADS
            </div>
            <Destaque class="mb-3"/>
            <Patrocinados />
        </div>
        <div class="col-span-3">
            <h3 class="font-semibold text-4xl">
                {{ newData?.title }}
            </h3>
            <div class="flex text-gray-500 text-xs mt-1">
                <p class="mr-2">
                    Postado em {{ $dayjs(newData?.createdAt).fromNow() }} • {{ $dayjs(newData?.createdAt).format('DD/MM/YYYY') }}
                </p>
                •
                <p class="mx-2">
                    <span class="text-white text-xs font-medium px-2 py-0.5 rounded-md mb-2 bg-green-500">
                        {{ newData?.category?.name }}
                    </span>
                </p>
                •
                <p class="ml-2">
                    Por <span class="text-orange-500">{{ newData?.user?.name }}</span>
                </p>
            </div>
            <div class="mt-4 text-md inline-flex items-end w-full">
                <img class="rounded-lg w-full h-80 object-cover" :src="newData?.image" alt="" />
                <div class="absolute h-20 bg-black/40 w-[58.313rem] object-cover rounded-b-lg p-2 text-white">
                    <div class="font-bold">
                        {{ newData?.title }}
                    </div>
                    <div class="mt-2 text-xs">
                        {{ $dayjs(newData?.createdAt).fromNow() }}
                    </div>
                </div>
            </div>
            <p class="leading-7 break-words whitespace-pre-wrap" v-html="newData?.content"></p>

            <div class="inline-flex items-center justify-center w-full my-3">
                <hr class="w-full h-px my-8 bg-gray-200 border-0">
                <span class="absolute px-5 font-medium text-gray-900 text-center bg-[#F9F9F9]">Ultimas Noticias</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <MainCard v-for="data in newDataTwo" :key="data.id" :newsData="data"/>
            </div>
        </div>

    </div>
</template>