<script setup>
useHead({
    title: 'MultiVerso - Categorias',
})

definePageMeta({
    layout: "default",
    name: "MultiVerso - Categorias",
})

const route = useRouter()
const categoryData = ref()

onMounted(() => {
  if (route?.currentRoute?.value?.params?.id) {
    showCategory()
  }
})

const showCategory = async () => {
  const categoryId = route?.currentRoute?.value?.params?.id;

  if (categoryId) {
    try {
      // Ajuste a URL para rota dinâmica
      const response = await fetch(`/api/categories?id=${categoryId}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar categorias: ${response.statusText}`);
      }

      const data = await response.json();
      categoryData.value = data;
    } catch (error) {
      console.error('Erro ao carregar a categorias:', error);
    }
  } else {
    console.warn('Nenhum ID fornecido.');
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
            <h3 class="font-semibold text-4xl my-8">
                {{ categoryData?.name }}
            </h3>
            <div class="grid grid-cols-2 gap-3">
                <MainCard v-for="data in categoryData?.news" :key="data.id" :newsData="data" :category="categoryData"/>
            </div>
        </div>
    </div>
</template>