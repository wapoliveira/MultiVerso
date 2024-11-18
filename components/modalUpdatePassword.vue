<script setup>
const props = defineProps({
  isOpen: Boolean,
  user: Object,
})

const isOpen = ref(props.isOpen)
const password = ref('')
const passwordConfirm = ref('')
const passwordError = ref('')
const isSubmitting = ref(false)

const emit = defineEmits(['closed', 'update'])

const closedModal = () => {
  props.isOpen = false
  isOpen.value = false
  emit('closed')
}

const updatePassword = async () => {
  if (password.value !== passwordConfirm.value) {
    passwordError.value = 'As senhas não coincidem.'
    return
  }

  passwordError.value = '' // Reset error message

  isSubmitting.value = true

  try {
    const response = await fetch(`/api/users?id=${props.user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      passwordError.value = data.message || 'Erro ao atualizar a senha. Tente novamente.'
    } else {
      closedModal()
      emit('update') // Emitir evento para o componente pai
    }
  } catch (error) {
    passwordError.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal v-model="isOpen" class="bg-slate-900">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-900', overlay: {background: 'bg-slate-800'} }" class="bg-slate-800">
      <template #header>
        <div class="flex justify-between">
          <h3 class="font-bold text-white">Atualizar Senha</h3>
          <div class="flex justify-end items-center">
            <Icon name="material-symbols:cancel-rounded" class="mr-1 text-orange-500 cursor-pointer" @click="closedModal"/>
          </div>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="updatePassword">
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-white">Nova Senha</label>
          <input
            type="password"
            v-model="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label for="password_confirmar" class="block mb-2 text-sm font-medium text-white">Confirmação da Senha</label>
          <input
            type="password"
            v-model="passwordConfirm"
            id="password_confirmar"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Atualizar Senha
        </button>
      </form>
    </UCard>
  </UModal>
</template>
