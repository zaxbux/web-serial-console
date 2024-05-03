<template>
	<input type="checkbox" v-model="value">
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Settings from '../settings';

const value = computed({
	get: () => Settings.flushOnEnter,
	set: (v: string) => Settings.flushOnEnter = v,
});
</script>