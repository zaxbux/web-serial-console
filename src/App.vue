<template>
	<template v-if="webAPISerialSupport">
		<Console />
		
		<WelcomeModal v-if="$settings.showWelcome" />
	</template>
	<template v-else>
		<SerialApiUnsupportedModal />
	</template>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import Console from './components/Console.vue';
import SerialApiUnsupportedModal from './components/SerialApiUnsupportedModal.vue';
import WelcomeModal from './components/WelcomeModal.vue';

const webAPISerialSupport = "serial" in navigator;

if (!webAPISerialSupport) {
	console.error('The Web Serial API is not supported.');
}

//const showWelcome: boolean = (window.localStorage.getItem('welcome') !== 'no');

onMounted(() => {
	document.body.classList.remove('loading');
})
</script>

<style lang="scss">
#app {
	height: 100vh;
	@apply flex;
	@apply flex-col;
}
</style>
