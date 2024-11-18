<script setup>
const props = defineProps({
  isOpen: Boolean,
  category: Object
})

const emit = defineEmits(['closed', 'update'])

const isOpen = ref(props.isOpen)

const deleteStatus = ref(false)

const closedModal = () => {
  props.isOpen = false
  isOpen.value = false
  emit('closed')
}

// Função para deletar uma categoria
const deleteCategory = async () => {
  try {
      const response = await fetch(`/api/categories?id=${props.category.id}`, {
          method: 'DELETE',
      })

      if (!response.ok) {
          throw new Error('Erro ao deletar categoria')
      }

      props.isOpen = false
      emit('update')
  } catch (error) {
      console.error('Erro ao deletar categoria:', error)
  }
}
</script>
<template>
    <UModal v-model="isOpen" class="bg-slate-900">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-900', overlay: {background: 'bg-slate-800'} }" class="bg-slate-800">
            <template #header>
                <div class="flex justify-between">
                    <h3 class="font-bold text-white">
                        Apagar Categoria
                    </h3>
                    <div class="flex justify-end items-center">
                        <Icon name="material-symbols:cancel-rounded" class="mr-1 text-orange-500 cursor-pointer" @click="closedModal()"/>
                    </div>
                </div>
                
            </template>

            <div class="space-y-4" action="#">
                <div class="text-white">
                    Você realmente deseja apagar a categoria <b>{{ category?.name }}</b> do sistema?
                </div>
                <div class="flex justify-between">
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="remember" type="checkbox" v-model="deleteStatus" value="true" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300" required />
                        </div>
                        <label for="remember" class="ms-2 text-sm font-medium text-white">Desejo apagar essa categoria</label>
                    </div>
                </div>
                <button @click="deleteCategory()" type="submit" :disabled="deleteStatus == false" :class="deleteStatus == false ? 'disabled:bg-gray-500 cursor-not-allowed' : ''" class="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Apagar Categoria</button>
            </div>
        </UCard>
    </UModal>
</template>