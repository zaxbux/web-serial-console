<script lang="ts" setup>
import { onMounted } from 'vue';
import Console from '@/components/Console.vue';
import SerialApiUnsupportedModal from '@/components/SerialApiUnsupportedModal.vue';
import WelcomeModal from '@/components/WelcomeModal.vue';
import {useAppStore} from '@/stores/app'

const appState = useAppStore()

onMounted(() => {
	document.body.classList.remove('loading');
})
</script>
<template>
  <template v-if="appState.webAPISerialSupport">
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
  overflow-y: hidden;
}
</style>
