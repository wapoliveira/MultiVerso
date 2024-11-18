<script setup>
const props = defineProps({
  isOpen: Boolean,
  user: Object
})

const isOpen = ref(props.isOpen)

const emit = defineEmits(['closed', 'update'])

const name = ref(props.user?.name || '')
const email = ref(props.user?.email || '')
const role = ref(props.user?.role || '')
const password = ref(props.user?.password || '')
const id = ref(props.user?.id || '')

// Atualiza os valores sempre que as props mudarem (como ao abrir o modal de edição)
watch(() => props.user, (newUser) => {
  name.value = newUser?.name || ''
  email.value = newUser?.email || ''
  role.value = newUser?.role || 'user'
  password.value = newUser?.password || ''
  id.value = newUser?.id || ''
}, { immediate: true })

// Função para criar ou atualizar uma categoria
const saveUsers = async () => {

  const endpoint = id.value ? `/api/users?id=${id.value}` : '/api/users'
  const method = id.value ? 'PUT' : 'POST'

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id.value,
      name: name.value,
      email: email.value,
      role: role.value,
      password: password.value,
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao salvar usuário')
  }

  emit('update');
 

  closedModal() // Fecha o modal após salvar
  
}

const closedModal = () => {
  emit('closed')
}
</script>
<template>
    <UModal v-model="isOpen" class="bg-slate-900">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-900', overlay: {background: 'bg-slate-800'} }" class="bg-slate-800">
            <template #header>
                <div class="flex justify-between">
                    <h3 class="font-bold text-white">
                        {{ user ? 'Editar Usuário' : 'Cadastrar Usuário' }}
                    </h3>
                    <div class="flex justify-end items-center">
                        <Icon name="material-symbols:cancel-rounded" class="mr-1 text-orange-500 cursor-pointer" @click="closedModal()"/>
                    </div>
                </div>
                
            </template>

            <div class="space-y-4" action="#">
                
                <div>
                    <label for="name" class="block mb-2 text-sm font-medium text-white">Nome</label>
                    <input name="name" v-model="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Jhoe" required />
                </div>
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-white">E-mail</label>
                    <input type="email" v-model="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="admin@MultiVerso.com" required />
                </div>
                <div v-if="!user">
                    <label for="password" class="block mb-2 text-sm font-medium text-white">Senha</label>
                    <input type="password" v-model="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                </div>
                <div>
                    <label for="funcao" class="block mb-2 text-sm font-medium text-white">Função</label>
                    <select v-model="role" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2">
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="user">Usuário</option>
                    </select>
                </div>
                <button @click="saveUsers()" type="submit" class="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">{{ user ? 'Editar Usuário' : 'Cadastrar Usuário' }}</button>
            </div>
        </UCard>
    </UModal>
</template>