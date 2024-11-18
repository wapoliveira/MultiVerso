<script setup>

    const showTedencia = ref(false)
    const showCategiria = ref(false)
    const isOpen = ref(false)
    const isLogin = ref(true)
    const categories = ref()
    const userStore = useUserStore()
    const router = useRouter()

    const password = ref()
    const email = ref()
    const name = ref()

    onMounted(()=>{
        listCategory()
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

    const login = async () => {

        try {
            const { data, error: fetchError } = await useFetch('/api/auth', {
                method: 'POST',
                body: { email: email.value, password: password.value },
            });

            if (fetchError.value) {
                
                throw new Error(fetchError.data.message);
            }

            if(data.value.user.role == 'admin'){
                userStore.name = data.value.user.name 
                userStore.role = data.value.user.role
                userStore.userData = data.value.user
                
                router.push('/admin/')
            }   

            if(data.value.user.role == 'editor'){
                userStore.name = data.value.user.name 
                userStore.role = data.value.user.role
                userStore.userData = data.value.user
                
                router.push('/editor/')
            } 

            if(data.value.user.role == 'user'){
                userStore.name = data.value.user.name 
                userStore.role = data.value.user.role
                userStore.userData = data.value.user
                
                router.push('/')
            } 
            
            isOpen.value = false
        } catch (err) {
            console.log('Erro', err)
            err.value = err;
        }
    };

    const saveUsers = async () => {

        const endpoint = '/api/users'
        const method = 'POST'

        const response = await fetch(endpoint, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            role: 'user',
            password: password.value,
        }),
        })

        if (!response.ok) {
        throw new Error('Erro ao salvar usuário')
        }

        
        login()

        isOpen.value = false

    }

    const logout = () => {
        userStore.name = '' 
        userStore.role = ''
        userStore.userData = ''
        
        router.push('/')
    }

    const clearData = () => {
        name.value = ''
        email.value = ''
        password.value = ''
    }
</script>
<template>
    <nav class="bg-slate-800 w-full fixed top-0 start-0 border-b-4 border-orange-500 z-50">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a class="flex items-center space-x-3 rtl:space-x-reverse">
                <NuxtLink to="/">
                    <img src="~/assets/img/LOGOMULTIVERSO.svg" class="h-14" alt="MultiVerso">
                </NuxtLink>
            </a>
            <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse" v-if="!userStore.name">
                <button type="button" @click="isOpen = true, isLogin = true" class="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm px-4 py-1.5 text-center">Entrar</button>
            </div>
            <div v-else class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <NuxtLink v-if="userStore?.userData?.role == 'user'" to="/">
                    <p class="text-white font-semibold mr-2 mt-1">
                        {{ userStore?.name }}
                    </p>
                </NuxtLink>
                <NuxtLink v-if="userStore?.userData?.role == 'admin'" to="/admin/">
                    <p class="text-white font-semibold mr-2 mt-1">
                        {{ userStore?.name }}
                    </p>
                </NuxtLink>
                <NuxtLink v-if="userStore?.userData?.role == 'editor'" to="/editor/">
                    <p class="text-white font-semibold mr-2 mt-1">
                        {{ userStore?.name }}
                    </p>
                </NuxtLink>
                
                <p class="text-white font-semibold mt-1">| </p>
                <p @click="logout()" class="hover:text-orange-500 font-semibold cursor-pointer mt-1 pl-2 hover:underline underline-offset-4 hover:decoration-orange-500 hover:decoration-2 ">
                    Sair
                </p>
            </div>
        </div>
        <div class="bg-slate-900">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div class="items-center justify-between hidden w-screen md:flex md:order-1" id="navbar-sticky">
                    <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium text-white border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-slate-900">
                        <li>
                            <NuxtLink to="/" active-class="font-bold text-orange-500 underline decoration-orange-500">
                                <a class="block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer" aria-current="page">Home</a>
                            </NuxtLink>
                        </li>
                        <!-- <li>
                            <a href="#" class="block py-2 px-3 text-white rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer">Menu</a>
                        </li> -->
                        <li v-if="userStore?.userData?.role == 'editor' || userStore?.userData?.role == 'user' || userStore">
                            <a @click="showCategiria == false ? (showCategiria = true, showTedencia = false) : showCategiria = false" :class="showCategiria == true ? 'text-orange-500 underline decoration-orange-500 font-bold' : 'text-white'" class="cursor-pointer block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500">Categorias</a>
                        </li>
                        
                        <li v-if="userStore?.userData?.role == 'user'">
                            <NuxtLink to="/noticias" class="inline-flex" active-class="font-bold text-orange-500 underline decoration-orange-500">
                                <a class="block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer" aria-current="page">Noticias</a>
                            </NuxtLink>
                        </li>

                        <li v-if="userStore?.userData?.role == 'editor'">
                            <NuxtLink to="/editor/noticias" class="inline-flex" active-class="font-bold text-orange-500 underline decoration-orange-500">
                                <a class="block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer" aria-current="page">Noticias</a>
                            </NuxtLink>
                        </li>

                        <li v-if="userStore?.userData?.role == 'admin'">
                            <NuxtLink to="/admin/categorias" class="inline-flex" active-class="font-bold text-orange-500 underline decoration-orange-500">
                                <a class="block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer" aria-current="page">Categorias</a>
                            </NuxtLink>
                        </li>
                        <li v-if="userStore?.userData?.role == 'admin'">
                            <NuxtLink to="/admin/noticias" class="inline-flex" active-class="font-bold text-orange-500 underline decoration-orange-500">
                                <a class="block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer" aria-current="page">Noticias</a>
                            </NuxtLink>
                        </li>
                        <li v-if="userStore?.userData?.role == 'admin'">
                            <NuxtLink to="/admin/pessoas" active-class="font-bold text-orange-500 underline decoration-orange-500">
                                <a class="block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer" aria-current="page">Pessoas</a>
                            </NuxtLink>
                        </li>
                        <!-- <li>
                            <a @click="showTedencia == false ? (showTedencia = true, showCategiria = false) : showTedencia = false" :class="showTedencia == true ? 'text-orange-500 underline decoration-orange-500 font-bold' : 'text-white'" class="cursor-pointer block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500">Tendências</a>
                        </li> -->
                    </ul>
                    <!-- <div class="flex justify-end items-center">
                        <form>   
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input class="block w-full p-1 ps-10 text-sm text-white border border-slate-900 rounded-lg bg-slate-500 focus:ring-orange-500 focus:border-orange-500" placeholder="Pesquisar" required />
                            </div>
                        </form>
                    </div> -->
                </div>
                
            </div>
        </div>
        <!-- <div v-if="showTedencia == true" @mouseleave="showTedencia = false" id="mega-menu-full-dropdown" class="mt-1 border-gray-200 shadow-sm bg-gray-50 md:bg-white border-y">
            <div class="grid max-w-screen-xl px-4 py-2 mx-auto text-gray-900 sm:grid-cols-3 md:px-6">
                <ul class="">
                    <h2 class="text-sm font-semibold text-black uppercase mb-3 mt-2">
                        <span class="-mr-1 underline underline-offset-4 decoration-2 decoration-orange-500">
                            Ten
                        </span>dências
                    </h2>
                    <li class="border-b">
                        <a href="#" class="block p-2 rounded-lg hover:bg-gray-100">
                            <div class="font-semibold">Mega menu is a new feature</div>
                        </a>
                    </li>
                    <li class="border-b">
                        <a href="#" class="block p-2 rounded-lg hover:bg-gray-100">
                            <div class="font-semibold">This is an example</div>
                        </a>
                    </li>
                    <li class="border-b">
                        <a href="#" class="block p-2 rounded-lg hover:bg-gray-100">
                            <div class="font-semibold">For a submenu item</div>
                        </a>
                    </li>
                    <li class="border-b">
                        <a href="#" class="block p-2 rounded-lg hover:bg-gray-100">
                            <div class="font-semibold">You can add</div>
                        </a>
                    </li>
                    <li class="border-b">
                        <a href="#" class="block p-2 rounded-lg hover:bg-gray-100">
                            <div class="font-semibold">Your own items</div>
                        </a>
                    </li>
                </ul>
                <ul class="col-span-2 ml-4">
                    <h2 class="text-sm font-semibold text-black uppercase mb-3 mt-2">
                        <span class="-mr-1 underline underline-offset-4 decoration-2 decoration-orange-500">
                            Des
                        </span>taque
                    </h2>
                    <div class="grid grid-cols-3 gap-3 mb-3">
                        <CardSmall />
                        <CardSmall />
                        <CardSmall />
                    </div>
                </ul>
            </div>
        </div> -->

        <div v-if="showCategiria == true" @mouseleave="showCategiria = false" id="mega-menu-full-dropdown" class="mt-1 border-gray-200 shadow-sm bg-gray-50 md:bg-white border-y">
            <div class="grid max-w-screen-xl px-4 py-2 mx-auto text-gray-900 gap-10 md:px-6">
                <ul class="">
                    <li class="border-b" v-for="category in categories" :key="category.id">
                        <NuxtLink :to="`/categorias/${category?.id}`" >
                            <a href="#" class="block p-2 rounded-lg hover:bg-gray-100">
                                <div class="font-semibold">
                                    {{ category?.name }}
                                </div>
                            </a>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>

        <UModal v-model="isOpen" class="bg-slate-900">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-900', overlay: {background: 'bg-slate-800'} }" class="bg-slate-800">
                <template #header>
                    <div class="flex justify-between">
                        <h3 class="font-bold text-white">
                            {{ isLogin ? 'Fazer Login' : 'Criar Conta' }}
                        </h3>
                        <div class="flex justify-end items-center">
                            <Icon name="material-symbols:cancel-rounded" class="mr-1 text-orange-500 cursor-pointer" @click="isOpen = false"/>
                        </div>
                    </div>
                    
                </template>

                <div class="space-y-4" v-if="isLogin == true">
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-white">E-mail</label>
                        <input type="email" v-model="email"name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="admin@MultiVerso.com" required />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-white">Senha</label>
                        <input type="password" v-model="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                    </div>
                    <!-- <div class="flex justify-between">
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300" required />
                            </div>
                            <label for="remember" class="ms-2 text-sm font-medium text-white">Manter Logado</label>
                        </div>
                        <a href="#" class="text-sm text-orange-500 hover:underline">Perdeu a senha?</a>
                    </div> -->
                    <button type="submit" @click="login()" class="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Faça login na sua conta</button>
                    <div class="text-sm font-medium text-white">
                        Não está registrado? <a class="text-orange-500 hover:underline" @click="isLogin = false, clearData()">Criar uma conta</a>
                    </div>
                </div>

                <div class="space-y-4" v-else>
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium text-white">Nome</label>
                        <input name="name" v-model="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Jhoe" required />
                    </div>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-white">E-mail</label>
                        <input type="email" v-model="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="admin@MultiVerso.com" required />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-white">Senha</label>
                        <input type="password" v-model="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                    </div>
        
                    <button @click="saveUsers()" type="submit" class="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Criar conta</button>
                    <div class="text-sm font-medium text-white">
                        Já tem uma conta? <a class="text-orange-500 hover:underline" @click="isLogin = true, clearData()">Entrar em sua conta</a>
                    </div>
                </div>

                <!-- <template #footer>
                <Placeholder class="h-8" />
                </template> -->
            </UCard>
        </UModal>

   </nav>
    
</template>