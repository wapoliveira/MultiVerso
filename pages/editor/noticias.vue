<script setup>
useHead({
    title: 'MultiVerso - editor - Noticias',
})

definePageMeta({
    layout: "editor",
    name: "MultiVerso - editor - Noticias",
})

const isOpenDelete = ref(false)
const key = ref(1)
const userStore = useUserStore()
const news = ref()
const newsData = ref()
const newStatus = ref()

onMounted(()=>{
    listNews()
})

const listNews = async () => {
    try {
        const response = await fetch(`/api/news`)
        const data = await response.json()
        news.value = data // Atualiza a lista de categorias com os dados da API
    } catch (error) {
        console.error('Erro ao carregar as noticias:', error)
    }
}
</script>
<template>
    <div>
        <div class="bg-white p-2 rounded-lg flex justify-between">
            <!-- <form>   
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input class="block w-80 p-1 ps-10 text-sm text-black border border-slate-900 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500" placeholder="Pesquisar" required />
                </div>
            </form> -->
            <div class="flex justify-end">
                <NuxtLink to="/editor/novo">
                    <button type="button" class="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm px-4 py-1.5 text-center">Cadastrar Noticia</button>
                </NuxtLink>
            </div>
        </div>
        <div class="mt-4 bg-white h-[calc(100vh-270px)] md:overflow-hidden md:hover:overflow-y-visible">
            <div>
                <div class="relative overflow-x-auto rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead class="text-xs text-black uppercase bg-gray-200">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Titulo
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Categoria
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Autor
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Data
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(newData, index) in news" :key="newData.id" class="odd:bg-white even:bg-gray-200 border-b">
                                <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap corte">
                                    {{ newData?.title }}
                                </th>
                                <td class="px-6 py-4">
                                    <span class="text-orange-500 bg-orange-300/20 text-xs font-medium me-2 px-2.5 py-0.5 rounded border mb-2 border-orange-500">
                                        {{ newData?.category?.name }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    {{ newData?.user?.name }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ $dayjs(newData.created_at).format('DD/MM/YYYY') }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2">
                                        <p v-if="newData?.status == 'pending'">
                                            Em Análise
                                        </p>
                                        <p v-if="newData?.status == 'approved'">
                                            Postado
                                        </p>
                                        <p v-if="newData?.status == 'rejected'">
                                            Reprovado
                                        </p>
                                    </div>
                                </td>
                                <td class="px-6 py-4 flex">
                                    <NuxtLink :to="'/editor/novo/'+newData?.id">
                                        <Icon name="material-symbols:edit-square" class="text-gray-500 cursor-pointer hover:text-orange-500 h-10 mr-2" />
                                    </NuxtLink>
                                    <Icon @click="isOpenDelete = true, key++, newsData = newData" name="material-symbols:delete-rounded" class="text-gray-500 cursor-pointer hover:text-orange-500 h-10" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <ModalDeleteNoticia :isOpen="isOpenDelete" :news="newsData" :key="key" @closed="isOpenDelete = false, key++" @update="isOpenDelete = false, key++, listNews()"/>
</template>
<style scoped>
.corte {
  max-width: 50ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>