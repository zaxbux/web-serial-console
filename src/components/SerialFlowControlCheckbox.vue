<template>
	<input type="checkbox" v-model="value">
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Settings from '../settings';

const value = computed({
	get: () => Settings.flowControl === 'hardware',
	set: (v) => Settings.flowControl = !v ? 'none' : 'hardware',
});
</script>