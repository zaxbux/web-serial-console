<template>
	<select v-model="value">
		<option v-for="option, key in options" :key="key" :value="option.value">
			{{ option.text }}
		</option>
	</select>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Settings from '../settings';

const options = [
	{ value: 'none', text: 'None' },
	{ value: 'even', text: 'Even' },
	{ value: 'odd', text: 'Odd' },
];

const value = computed({
	get: () => Settings.parity,
	set: (v: string) => Settings.parity = v as ParityType,
});
</script>
