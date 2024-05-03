<template>
	<input type="checkbox" v-model="value">
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Settings from '../settings';

const value = computed({
	get: () => Settings.echo,
	set: (v: string) => Settings.echo = v,
});
</script>
