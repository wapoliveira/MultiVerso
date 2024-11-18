<script setup>
useHead({
    title: 'MultiVerso - Admin - Categorias',
})

definePageMeta({
    layout: "admin",
    name: "MultiVerso - Admin - Categorias",
})

const isOpenDelete = ref(false)
const open = ref(false)
const key = ref(1)
const categoryData = ref()
const categories = ref()

// Função para carregar a lista de categorias da API
const listCategory = async () => {
    try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        categories.value = data // Atualiza a lista de categorias com os dados da API
    } catch (error) {
        console.error('Erro ao carregar categorias:', error)
    }
}

// Chama a função de listar categorias quando a página é montada
onMounted(() => {
    listCategory()
})
</script>

<template>
    <div>
        <div class="bg-white p-2 rounded-lg flex justify-between">
            <div class="flex justify-end">
                <button 
                    @click="open = true, key++, categoryData = ''" 
                    type="button" 
                    class="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm px-4 py-1.5 text-center">
                    Cadastrar Categoria
                </button>
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
                                <th scope="col" class="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="category in categories" :key="category.id" class="odd:bg-white even:bg-gray-200 border-b">
                                <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
                                    {{ category?.name }}
                                </th>
                                <td class="px-6 py-4 flex">
                                    <Icon 
                                        @click="open = true, key++, categoryData = category" 
                                        name="material-symbols:edit-square" 
                                        class="text-gray-500 cursor-pointer hover:text-orange-500 h-10 mr-2" 
                                    />
                                    <Icon 
                                        @click="isOpenDelete = true, key++, categoryData = category" 
                                        name="material-symbols:delete-rounded" 
                                        class="text-gray-500 cursor-pointer hover:text-orange-500 h-10" 
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <ModalCreateUpdateCategory 
        :open="open" 
        :category="categoryData" 
        :key="key" 
        @closed="open = false, key++" 
        @update="open = false, key++, listCategory()"
    />
    <ModalDeleteCategory 
        :isOpen="isOpenDelete" 
        :category="categoryData" 
        :key="key" 
        @closed="isOpenDelete = false, key++" 
        @update="isOpenDelete = false, key++, listCategory()"
    />
</template>
