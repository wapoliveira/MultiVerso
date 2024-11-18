<script setup>
useHead({
    title: 'MultiVerso - Admin - Pessoas',
})

definePageMeta({
    layout: "admin",
    name: "MultiVerso - Admin - Pessoas",
})

const isOpenDelete = ref(false)
const isOpen = ref(false)
const isOpenPassword = ref(false)
const userData = ref()
const key = ref(1)
const keyDelete = ref(1)
const keyPassword = ref(1)

const users = ref()

onMounted(()=>{
    listUser()
})

const listUser = async () => {
    try {
        const response = await fetch('/api/users')
        const data = await response.json()
        users.value = data // Atualiza a lista de usuários com os dados da API
    } catch (error) {
        console.error('Erro ao carregar usuários:', error)
    }
}
</script>
<template>
    <div>
        <div class="bg-white p-2 rounded-lg flex justify-between">
            <div class="flex justify-end">
                <button type="button" @click="isOpen = true, key++, userData = ''" class="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm px-4 py-1.5 text-center">Cadastrar Usuário</button>
            </div>
        </div>
        <div class="mt-4 bg-white h-[calc(100vh-270px)] md:overflow-hidden md:hover:overflow-y-visible">
            <div>
                <div class="relative overflow-x-auto rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead class="text-xs text-black uppercase bg-gray-200">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Nome
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Data
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Função
                                </th>
                                <th scope="col" class="px-6 py-3">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id" class="odd:bg-white even:bg-gray-200 border-b">
                                <td class="px-6 py-4">
                                    {{ user?.name }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ $dayjs(user.created_at).format('DD/MM/YYYY') }}
                                </td>
                                <td class="px-6 py-4">
                                    <select disabled :value="user?.role" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2">
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="user">Usuário</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4 flex">
                                    <Icon name="solar:lock-password-bold" @click="isOpenPassword = true, keyPassword++, userData = user" class="text-gray-500 cursor-pointer hover:text-orange-500 h-10 mr-2" />
                                    <Icon name="material-symbols:edit-square" @click="isOpen = true, key++, userData = user" class="text-gray-500 cursor-pointer hover:text-orange-500 h-10 mr-2" />
                                    <Icon name="material-symbols:delete-rounded" @click="isOpenDelete = true, keyDelete++, userData = user" class="text-gray-500 cursor-pointer hover:text-orange-500 h-10 mr-2" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <ModalDeletePessoa :isOpen="isOpenDelete" :user="userData" :key="keyDelete" @closed="isOpenDelete = false, keyDelete++" @update="isOpenDelete = false, keyDelete++, listUser()"/>
    <ModalCreateUpdatePessoa :isOpen="isOpen" :user="userData" :key="key" @closed="isOpen = false, key++" @update="isOpen = false, key++, listUser()"/>
    <ModalUpdatePassword :isOpen="isOpenPassword" :user="userData" :key="keyPassword" @closed="isOpenPassword = false, keyPassword++" @update="isOpenPassword = false, keyPassword++, listUser()"/>
</template>