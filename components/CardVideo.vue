<template>
    <div class="w-full bg-white h-max p-2 border-t-2 border-orange-500 rounded">
        <h3 class=" text-center text-black flex items-center justify-center">
            <Icon name="ph:film-slate-fill" class="mr-1 text-orange-500"/>
            <span class="mr-0.2 underline underline-offset-4 decoration-2 decoration-orange-500">
                Vid
            </span>eos
        </h3>
        <video class="w-full h-40 rounded-lg max-w-full mb-1" controls>
            <source src="~/assets/video/nossaescola.mp4" type="video/mp4">
        </video>
    </div>
</template>