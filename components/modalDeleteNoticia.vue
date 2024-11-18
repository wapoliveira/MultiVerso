<script setup>
const props = defineProps({
  isOpen: Boolean,
  news: Object
})

const emit = defineEmits(['closed', 'update'])

const isOpen = ref(props.isOpen)

const deleteStatus = ref(false)

const closedModal = () => {
  props.isOpen = false
  isOpen.value = false
  emit('closed')
}

// Função para deletar uma noticia
const deleteNews = async () => {
  try {
    const response = await fetch(`/api/news?id=${props.news.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar notícia');
    }

    props.isOpen = false;
    emit('update');
  } catch (error) {
    console.error('Erro ao deletar notícia:', error);
  }
};

</script>
<template>
  <UModal v-model="isOpen" class="bg-slate-900">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-900', overlay: {background: 'bg-slate-800'} }" class="bg-slate-800">
          <template #header>
              <div class="flex justify-between">
                  <h3 class="font-bold text-white">
                    Apagar Noticia
                  </h3>
                  <div class="flex justify-end items-center">
                      <Icon name="material-symbols:cancel-rounded" class="mr-1 text-orange-500 cursor-pointer" @click="closedModal()"/>
                  </div>
              </div>
              
          </template>

          <div class="space-y-4" action="#">
              <div class="text-white">
                Você realmente deseja apagar a noticia <b>{{ news?.title }}</b> do sistema?
              </div>
              <div class="flex justify-between">
                  <div class="flex items-start">
                      <div class="flex items-center h-5">
                          <input id="remember" type="checkbox" v-model="deleteStatus" value="true" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300" required />
                      </div>
                      <label for="remember" class="ms-2 text-sm font-medium text-white">Desejo apagar essa noticia</label>
                  </div>
              </div>
              <button type="submit" @click="deleteNews()" :disabled="deleteStatus == false" :class="deleteStatus == false ? 'disabled:bg-gray-500 cursor-not-allowed' : ''" class="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Apagar Noticia</button>
          </div>
      </UCard>
  </UModal>
</template>