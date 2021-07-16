<template>
	<span :title="text" class="opacity-60"><Icon :path="mdiHelpCircleOutline" size="1rem" class="inline-block align-baseline"/></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mdiHelpCircleOutline } from '@mdi/js';

export default defineComponent({
	props: [
		'text',
	],
	data: () => ({mdiHelpCircleOutline}),
})
</script>
