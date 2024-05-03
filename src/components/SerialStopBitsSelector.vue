<template>
	<select v-model="value">
		<option v-for="option in options" v-bind:key="option.value" :value="option.value">
			{{ option.text }}
		</option>
	</select>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Settings from '../settings';

const options = [
	{ value: 1, text: '1' },
	{ value: 2, text: '2' },
]

const value = computed({
	get: () => Settings.stopBits,
	set: (v: number) => Settings.stopBits = v
})
</script>