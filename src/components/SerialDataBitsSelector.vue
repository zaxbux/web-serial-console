<template>
	<select v-model.number="value">
		<option v-for="option, key in options" :key="key" :value="option.value">
			{{ option.text }}
		</option>
	</select>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Settings from '../settings';

const options = [
	{ value: 7, text: '7' },
	{ value: 8, text: '8' },
];

const value = computed({
	get: () => Settings.dataBits,
	set: (v: number) => Settings.dataBits = v,
});
</script>
