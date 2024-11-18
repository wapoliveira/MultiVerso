<template>
	<div>
		<div class="mb-32">
			<NavigationNavbarAdmin />
		</div>
		<div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
			<slot/>
		</div>
        <div>
			<NavigationFooter />
		</div>
	</div>
</template>