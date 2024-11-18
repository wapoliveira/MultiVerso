<script setup>
const props = defineProps({
  open: Boolean,
  category: Object
})

const emit = defineEmits(['closed', 'update'])

const open = ref(props.open)
const name = ref(props.category?.name || '')
const id = ref(props.category?.id || '')

// Atualiza os valores sempre que as props mudarem (como ao abrir o modal de edição)
watch(() => props.category, (newCategory) => {
  name.value = newCategory?.name || ''
  id.value = newCategory?.id || ''
}, { immediate: true })

// Função para criar ou atualizar uma categoria
const saveCategory = async () => {

  const endpoint = id.value ? `/api/categories?id=${id.value}` : '/api/categories'
  const method = id.value ? 'PUT' : 'POST'

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id.value,
      name: name.value
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao salvar categoria')
  }

  emit('update');
 

  closedModal() // Fecha o modal após salvar
  
}

const closedModal = () => {
  emit('closed')
}
</script>

<template>
    <UModal v-model="open" class="bg-slate-900">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-900', overlay: {background: 'bg-slate-800'} }" class="bg-slate-800">
            <template #header>
                <div class="flex justify-between">
                    <h3 class="font-bold text-white">
                        {{ id ? 'Editar Categoria' : 'Cadastrar Categoria' }}
                    </h3>
                    <div class="flex justify-end items-center">
                        <Icon name="material-symbols:cancel-rounded" class="mr-1 text-orange-500 cursor-pointer" @click="closedModal()"/>
                    </div>
                </div>
            </template>

            <div class="space-y-4" action="#">
                <div>
                    <label for="title" class="block mb-2 text-sm font-medium text-white">Título</label>
                    <input name="title" v-model="name" id="title" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Esportes" required />
                </div>

                <button @click="saveCategory" type="submit" class="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {{ id ? 'Editar Categoria' : 'Cadastrar Categoria' }}
                </button>
            </div>
        </UCard>
    </UModal>
</template>
