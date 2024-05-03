<template>
	<span :title="text" class="opacity-60"><font-awesome-icon :icon="['far', 'question-circle']" size="sm" fixed-width /></span>
</template>
<script setup lang="ts">
defineProps<{
	text: string
}>()
</script>
