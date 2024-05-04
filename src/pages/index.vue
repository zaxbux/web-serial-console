<script lang="ts" setup>
import { onMounted } from 'vue';
import Console from '@/components/Console.vue';
import SerialApiUnsupportedModal from '@/components/SerialApiUnsupportedModal.vue';
import WelcomeModal from '@/components/WelcomeModal.vue';
import {useAppStore} from '@/stores/app'

const appState = useAppStore()

const webAPISerialSupport = "serial" in navigator;

if (!webAPISerialSupport) {
	console.error('The Web Serial API is not supported.');
}

//const showWelcome: boolean = (window.localStorage.getItem('welcome') !== 'no');

onMounted(() => {
	document.body.classList.remove('loading');
})
</script>
<template>
  <template v-if="webAPISerialSupport">
		<Console />

		<WelcomeModal v-if="appState.showWelcome" />
	</template>
	<template v-else>
		<SerialApiUnsupportedModal />
	</template>
</template>
<style>
html, body {
  height: 100%;
  /* overflow-y: hidden; */
}
</style>
