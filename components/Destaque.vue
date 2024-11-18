<script setup>
const newsData = ref(null);

onMounted(() => {
  listNews(); 
});

const listNews = async () => {
  try {
    const responseListNews = await fetch('/api/news?randomTree=true');
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
</script>
<template>
    <div v-if="newsData" class="w-full bg-white h-max p-2 border-t-2 border-orange-500 rounded">
        <h3 class="mb-2 text-center text-black flex items-center justify-center">
            <Icon name="material-symbols-light:kid-star" class="mr-1 text-orange-500"/>
            <span class="mr-0.2 underline underline-offset-4 decoration-2 decoration-orange-500">
                Rec
            </span>omendação
        </h3>
        <CardMainSecund :newsData="newsData[0]"/>
        <CardLeftImage :newsData="newsData[1]" class="mb-2 mt-2"/>
        <CardLeftImage :newsData="newsData[2]"/>
    </div>
</template>