<script setup>

const categories = ref()
const newsDataMaisAcessadas = ref()

const social = ref({
    whatsapp: useRuntimeConfig().public.whatsapp,
    instagram: useRuntimeConfig().public.instagram,
    facebook: useRuntimeConfig().public.facebook,
    x: useRuntimeConfig().public.x,
})

onMounted(()=>{
    listCategory()
    listNewsMaisAcessadas()
})

const listCategory = async () => {
    try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        categories.value = data // Atualiza a lista de categorias com os dados da API
    } catch (error) {
        console.error('Erro ao carregar categorias:', error)
    }
}

const listNewsMaisAcessadas = async () => {
  try {
    const responseMaisAcessadas = await fetch('/api/news?randomFour=true');
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
</script>
<template>
    <footer class="bg-slate-800 border-t-2 border-orange-500">
        <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
            <div class="md:flex md:justify-between">
            <div class="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
                <div>
                    <a href="#" class="flex items-center">
                    <img src="~/assets/img/LOGOMULTIVERSO.svg" class="h-25" alt="MultiVerso" />
                </a>
                </div>
                <div>
                    <h2 class="mb-4 text-sm font-semibold text-white uppercase">
                        <span class="-mr-1 underline underline-offset-4 decoration-2 decoration-orange-500">
                            Ca
                        </span>tegorias Populares
                    </h2>
                    <div class="flex flex-wrap">
                        <span v-for="category in categories" :key="category.id" class="bg-slate-800 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded border mb-2 hover:border-orange-500 hover:text-orange-500 cursor-pointer">
                            <NuxtLink :to="`/categorias/${category?.id}`" >
                                {{ category?.name }}
                            </NuxtLink>
                        </span>
                    </div>
                </div>
                <div>
                    <h2 class="mb-4 text-sm font-semibold text-white uppercase ">
                        <span class="-mr-1 underline underline-offset-4 decoration-2 decoration-emerald-500">
                            Últ
                        </span>imas Notícias</h2>
                    <ul class="text-white font-medium">
                        <li class="mb-2" v-for="newData in newsDataMaisAcessadas" :key="newData.id">
                            <NuxtLink :to="`/${newData?.id}`" >
                                <a  class="flex flex-col items-center rounded-lg md:flex-row md:max-w-xl hover:bg-slate-900">
                                    <img class="object-cover w-full rounded-t-lg h-10 md:w-14 md:rounded-none md:rounded-s-lg" :src="newData?.image" alt="">
                                    <div class="flex flex-col justify-between px-4 leading-normal">
                                        <p class="mb-3 text-xs text-white">{{ newData?.title }}</p>
                                    </div>
                                </a>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 class="mb-4 text-sm font-semibold text-white uppercase ">
                        <span class="-mr-1 underline underline-offset-4 decoration-2 decoration-pink-500">
                            Sig
                        </span>a-Nos</h2>
                    <ul class="text-white font-medium">
                        <li class="mb-2">
                            <a :href="social?.instagram" target="_blank" class="hover:underline decoration-pink-500">Instagram</a>
                        </li>
                        <li class="mb-2">
                            <a :href="social?.facebook" target="_blank" class="hover:underline decoration-pink-500">Facebook</a>
                        </li>
                        <li class="mb-2">
                            <a :href="social?.x" target="_blank" class="hover:underline decoration-pink-500">X</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <hr class="border-gray-200 sm:mx-auto" />
        <div class="sm:flex sm:items-center sm:justify-between mt-6">
            <span class="text-sm text-white sm:text-center">
                © 2024 <a href="#" class="hover:underline">MultiVerso</a>. Todos os direitos reservados.
            </span>
            <div>
                <a :href="social?.whatsapp" target="_blank" class="bg-green-500 px-3 py-2 rounded-full font-bold text-white">
                    <icon name="mdi:whatsapp" class="-mb-0.5"/>
                    Fale conosco
                </a>
            </div>
        </div>
        </div>
    </footer>
</template>