<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const router = useRouter();
const route = useRouter();

const userStore = useUserStore();

// Definição dos campos
const id = ref(null);
const title = ref('');
const content = ref('');
const imageFile = ref(null); // Para o arquivo de imagem
const imageName = ref('')
const imageUrl = ref(''); // URL da imagem após upload
const status = ref('pending');
const category_id = ref('');
const user_id = ref(userStore?.userData?.id); // Fixo para teste; ajuste conforme necessário

const categories = ref([]);

const options = ref({
  theme: 'snow',
  modules: {
    toolbar: '#toolbar',
  },
});

onMounted(() => {
  if (route?.currentRoute?.value?.params?.id) {
    showNews();
  }
  listCategory();
});

// Função para listar categorias
const listCategory = async () => {
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    categories.value = data;
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
};

// Função para exibir detalhes de uma notícia
const showNews = async () => {
  const newsId = route?.currentRoute?.value?.params?.id;

  if (newsId) {
    try {
      const response = await fetch(`/api/news?id=${newsId}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar notícia: ${response.statusText}`);
      }

      const data = await response.json();
      id.value = data.id;
      title.value = data.title;
      content.value = data.content;
      imageUrl.value = data.image;
      status.value = data.status;
      category_id.value = data.categoryId;
      user_id.value = data.userId;
    } catch (error) {
      console.error('Erro ao carregar a notícia:', error);
    }
  } else {
    console.warn('Nenhum ID fornecido.');
  }
};

async function uploadFile(e) {
  const formData = new FormData();
  const file = e?.type === 'change' ? e.target.files[0] : e.dataTransfer.files[0];
  imageName.value = e?.type == 'change' ? e.target.files[0].name : e.dataTransfer.files[0].name
  formData.append('file', file);

  // Logando os dados do FormData
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem.');
    }

    console.log(response);
    const data = await response.json();
    imageUrl.value = data.url; // Atualiza URL da imagem após sucesso.
  } catch (error) {
    console.error('Erro no upload da imagem:', error);
  }
}


// Função para salvar uma notícia
const saveNews = async () => {
  if (!title.value || !content.value || !category_id.value || !status.value) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // // Upload da imagem
  // if (imageFile.value) {
  //   const uploadedImageUrl = await uploadImage();
  //   console.log('erro 01 ' + uploadedImageUrl)
  //   if (!uploadedImageUrl) {
  //     alert('Erro ao fazer upload da imagem.');
  //     return;
  //   }
  //   imageUrl.value = uploadedImageUrl;
  // }

  const payload = {
    title: title.value,
    content: content.value,
    image: imageUrl.value,
    status: status.value,
    categoryId: Number(category_id.value),
    userId: user_id.value,
  };

  try {
    let response;
    if (id.value) {
      response = await fetch(`/api/news?id=${id.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }

    if (response.ok) {
      if (userStore?.userData?.role == 'admin') {
        router.push('/admin/noticias');
      } 
      if (userStore?.userData?.role == 'editor')  {
        router.push('/editor/noticias');
      }
      if (userStore?.userData?.role == 'user')  {
        router.push('/noticias');
      }
    } else {
      const result = await response.json();
      alert('Erro ao salvar a notícia: ' + result.message);
    }
  } catch (error) {
    console.error('Erro ao salvar a notícia:', error);
    alert('Erro ao salvar a notícia.');
  }
};
</script>

<template>
  <div class="h-[calc(100vh-270px)] md:overflow-hidden md:hover:overflow-y-visible">
    <div class="mb-4">
      <label for="Titulo" class="block mb-2 text-sm font-medium text-gray-800">Titulo</label>
      <input v-model="title" name="titulo" id="titulo" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500" required />
    </div>
    <div class="mb-4">
      <label for="ImageFile" class="block mb-2 text-sm font-medium text-gray-800">Imagem</label>
      <div class="mt-3 w-full grid" :class="imageUrl ? 'grid-cols-2 gap-3' : 'grid-cols-1'">
        <div class="flex items-center justify-center w-full ">
          <label for="dropzone-file" v-cloak @drop.prevent="uploadFile" @dragover.prevent 
            class="grid content-center justify-items-center w-full h-[21.688rem] border-2 border-dashed rounded-lg cursor-pointer border-ed-orange-500 bg-ed-orange-50">
            <div class="grid content-center justify-items-center pt-5 pb-6 text-ed-orange-500">
              <p>
                <Icon name="material-symbols:attach-file" class="w-5 h-5" /> 
              </p>
              <p v-if="!imageName">
                <span class="font-semibold text-sm">ESCOLHA UM ARQUIVO DO SEU COMPUTADOR</span>
              </p>
              <p v-if="!imageName" class="mb-2 text-sm">ou navegue pelo arquivo do dispositivo</p>
              <p v-if="imageName">
                <span class="font-semibold text-sm">{{ imageName }}</span>
              </p>
            </div>
            <input id="dropzone-file" draggable="true" type="file" class="hidden" accept="image/*" @change="uploadFile"/>
          </label>
        </div>
        <div>
          <img :src="imageUrl" class="h-[21.688rem] rounded-lg object-cover" :key="imageUrl" alt="">
        </div>
      </div>
    </div>
    <div class="mb-4">
      <label for="Categorias" class="block mb-2 text-sm font-medium text-gray-800">Categorias</label>
      <select v-model="category_id" id="Categorias" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2">
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category?.name }}</option>
      </select>
    </div>
    <div class="mb-4" v-if="userStore?.userData?.role == 'admin' || userStore?.userData?.role == 'editor'">
      <label for="Status" class="block mb-2 text-sm font-medium text-gray-800">Status</label>
      <select id="Status" v-model="status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2">
        <option value="pending">Em Análise</option>
        <option value="approved">Postado</option>
        <option value="rejected">Reprovado</option>
      </select>
    </div>
    <div class="mb-4">
      <label for="Conteudo" class="block mb-2 text-sm font-medium text-gray-800">Conteúdo</label>
      <div class="w-full mb-4">
        <div id="toolbar" class="flex border border-gray-200 rounded-t-lg bg-ed-gray-100">
          <button class="ql-bold text-black"></button>
          <button class="ql-italic text-black"></button>
          <button class="ql-underline text-black"></button>
          <button class="ql-code-block text-black"></button>
          <button class="ql-image text-black"></button>
          <button class="ql-video text-black"></button>
          <button class="ql-link text-black"></button>
        </div>
        <QuillEditor 
          v-model:content="content"
          :options="options"
          contentType="html"
          class="rounded-b-lg text-black" />
      </div>
    </div>
  </div>
  <div class="flex items-center justify-end gap-2">
    <button type="button" @click="saveNews" class="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm px-4 py-1.5 text-center">
      {{ route?.currentRoute?.value?.params?.id ? 'Editar' : 'Publicar' }}
    </button>
  </div>
</template>

<style scoped>
/* Estilos adicionais */
</style>
