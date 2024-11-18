<script setup>

    const showTedencia = ref(false)
    const showCategiria = ref(false)
    const isOpen = ref(false)
    const isLogin = ref(true)
    const router = useRouter()

    const userStore = useUserStore()

    const categories = ref()

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

    const logout = () => {
        userStore.name = '' 
        userStore.role = ''
        userStore.userData = ''
        
        router.push('/')
    }
</script>
<template>
    <nav class="bg-slate-800 w-full fixed top-0 start-0 border-b-4 border-orange-500 z-50">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a class="flex items-center space-x-3 rtl:space-x-reverse">
                <NuxtLink to="/editor/">
                    <img src="~/assets/img/LOGOMULTIVERSO.svg" class="h-14" alt="MultiVerso">
                </NuxtLink>
            </a>
            <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <p class="text-white font-semibold mr-2 mt-1">
                    {{ userStore?.name }}
                </p>
                <p class="text-white font-semibold mt-1">| </p>
                <p @click="logout()" class="hover:text-orange-500 font-semibold cursor-pointer mt-1 pl-2 hover:underline underline-offset-4 hover:decoration-orange-500 hover:decoration-2 ">
                    Sair
                </p>
            </div>
        </div>
        <div class="bg-slate-900">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div class="items-center justify-between hidden w-screen md:flex md:order-1" id="navbar-sticky">
                    <ul class="flex flex-col text-white p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-slate-900">
                        <li>
                            <NuxtLink to="/editor/" active-class="font-bold text-orange-500 underline decoration-orange-500">
                                <a class="block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer" aria-current="page">Home</a>
                            </NuxtLink>
                        </li>
                        <!-- <li>
                            <a href="#" class="block py-2 px-3 text-white rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer">Menu</a>
                        </li> -->
                        <li>
                            <a @click="showCategiria == false ? (showCategiria = true, showTedencia = false) : showCategiria = false" :class="showCategiria == true ? 'text-orange-500 underline decoration-orange-500 font-bold' : 'text-white'" class="cursor-pointer block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500">Categorias</a>
                        </li>
                        <!-- <li>
                            <a @click="showTedencia == false ? (showTedencia = true, showCategiria = false) : showTedencia = false" :class="showTedencia == true ? 'text-orange-500 underline decoration-orange-500 font-bold' : 'text-white'" class="cursor-pointer block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500">Tendências</a>
                        </li> -->
                        <li>
                            <NuxtLink to="/editor/noticias" class="inline-flex" active-class="font-bold text-orange-500 underline decoration-orange-500">
                                <a class="block py-2 px-3 rounded md:p-0 hover:text-orange-500 hover:underline hover:decoration-orange-500 cursor-pointer" aria-current="page">Noticias</a>
                            </NuxtLink>
                        </li>
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
   </nav>
    
</template>