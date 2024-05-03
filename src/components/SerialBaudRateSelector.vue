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
	{ value: 9600, text: '9600' },
	{ value: 14400, text: '14400' },
	{ value: 19200, text: '19200' },
	{ value: 28800, text: '28800' },
	{ value: 38400, text: '38400' },
	{ value: 57600, text: '57600' },
	{ value: 115200, text: '115200' },
	{ value: 230400, text: '230400' },
	{ value: 460800, text: '460800' },
	{ value: 921600, text: '921600' },
];

const value = computed({
	get: () => Settings.baudRate,
	set: (v: number) => Settings.baudRate = v,
});
</script>
