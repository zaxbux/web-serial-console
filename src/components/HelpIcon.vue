<template>
	<span :title="text" class="opacity-60"><font-awesome-icon :icon="['far', 'question-circle']" size="sm" fixed-width /></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: [
		'text',
	],
})
</script>
