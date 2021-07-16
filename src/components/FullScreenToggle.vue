<template>
	<button class="btn" title="fullscreen" @click="$emit('fullscreen')">
		
		
		<Icon :path="fullscreen ? mdiFullscreen : mdiFullscreenExit"/>
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';

export default defineComponent({
	props: [
		'fullscreen'
	],
	emits: [
		'fullscreen',
	],
	data: () => ({mdiFullscreen, mdiFullscreenExit}),
})
</script>
