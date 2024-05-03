<template>
	<button class="btn" title="fullscreen" @click="$emit('fullscreen')">
		<font-awesome-icon v-if="fullscreen" :icon="['far', 'compress-wide']" fixed-width />
		<font-awesome-icon v-else :icon="['far', 'expand-wide']" fixed-width />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	props: [
		'fullscreen'
	],
	emits: [
		'fullscreen',
	],
})
</script>