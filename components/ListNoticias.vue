<script setup>
import { ref, onMounted } from 'vue';

const newsData = ref(null); // Ref para armazenar a notícia mais recente
const newsDataLatestFour = ref(null); 
const newsDataLatestSix = ref(null)
const newsDataMaisAcessadas = ref(null); 
const categories = ref(null);

onMounted(() => {
  listNews(); // Chama a função para buscar a notícia mais recente
  listNewsLatestFour(); // Chama a função para buscar a notícia mais recente
  listNewsLatestSix();
  listNewsMaisAcessadas();
  listCategory();
});

const listNews = async () => {
  try {
    const responseListNews = await fetch('/api/news?latest=true');
    const dataListNews = await responseListNews.json();

    // Verifica se houve erro na resposta
    if (dataListNews.error) {
      console.error(dataListNews.message); 
    } else {
      newsData.value = dataListNews; 
    }
  } catch (error) {
    console.error('Erro ao carregar as notícias:', error); // Exibe erro no console caso ocorra
  }
};

const listNewsLatestFour = async () => {
  try {
    const responseLatestFour = await fetch('/api/news?latestFour=true');
    const dataLatestFour = await responseLatestFour.json();

    // Verifica se houve erro na resposta
    if (dataLatestFour.error) {
      console.error(dataLatestFour.message); 
    } else {
        newsDataLatestFour.value = dataLatestFour; 
    }
  } catch (error) {
    console.error('Erro ao carregar as notícias:', error);
  }
};

const listNewsLatestSix = async () => {
  try {
    const responseLatestSix = await fetch('/api/news?randomSix=true');
    const dataLatestSix = await responseLatestSix.json();

    // Verifica se houve erro na resposta
    if (dataLatestSix.error) {
      console.error(dataLatestSix.message); 
    } else {
        newsDataLatestSix.value = dataLatestSix; 
    }
  } catch (error) {
    console.error('Erro ao carregar as notícias:', error);
  }
};

const listNewsMaisAcessadas = async () => {
  try {
    const responseMaisAcessadas = await fetch('/api/news?mostViewed=true');
    const dataMaisAcessadas = await responseMaisAcessadas.json();

    // Verifica se houve erro na resposta
    if (dataMaisAcessadas.error) {
      console.error(dataMaisAcessadas.message); 
    } else {
        newsDataMaisAcessadas.value = dataMaisAcessadas; 
    }
  } catch (error) {
    console.error('Erro ao carregar as notícias:', error);
  }
};

const listCategory = async () => {
    try {
        const response = await fetch('/api/categories?lastNews=true')
        const data = await response.json()
        categories.value = data // Atualiza a lista de categorias com os dados da API
    } catch (error) {
        console.error('Erro ao carregar categorias:', error)
    }
}

</script>

<template>
    <div>
        <div class="grid grid-cols-4 gap-6 mb-3">
            <div class="col-span-3">
                <MainCard :newsData="newsData"/>
            </div>
            <div>
                <div class="flex justify-between mb-3 ">
                    <h2 class="text-sm font-semibold text-black uppercase">
                        <span class="-mr-1 underline underline-offset-4 decoration-2 decoration-orange-500">
                            PO
                        </span>PULAR
                    </h2>
                </div>
                <CardLeftImage v-for="data in newsDataMaisAcessadas" :key="data.id" :newsData="data"/>
            </div>
        </div>
        <div class="grid grid-cols-4 gap-3 mb-3">
            <div class="col-span-3">
                <div class="inline-flex items-center justify-center w-full">
                    <hr class="w-full h-px my-8 bg-gray-200 border-0">
                    <span class="absolute px-5 font-medium text-gray-900 text-center bg-[#F9F9F9]">Últimas notícias</span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <CardMainSecund v-for="data in newsDataLatestFour" :key="data.id" :newsData="data"/>
                </div>
            </div>
            <div>
                <CardVideo class="mb-2"/>
            </div>
        </div>
        <div>
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-full h-px my-8 bg-gray-200 border-0">
                <span class="absolute px-5 font-medium text-gray-900 text-center bg-[#F9F9F9]">Mais uma novidade</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <CardLeftImage class="mb-1" v-for="data in newsDataLatestSix" :key="data.id" :newsData="data"/>
            </div>
        </div>
        <div v-for="data in categories" :key="data.id" >
            <div v-if="data?.news?.length > 0" class="inline-flex items-center w-full">
                <hr class="w-full h-px my-8 bg-gray-200 border-0">
                <span class="absolute pr-5 font-medium text-gray-900 bg-[#F9F9F9]">{{ data?.name }}</span>
            </div>
            <div class="grid grid-cols-5 gap-3">
                <CardSmall v-for="dataN in data?.news" :key="dataN.id" :category="data" :newsData="dataN" />
            </div>
        </div>
    </div>
</template>