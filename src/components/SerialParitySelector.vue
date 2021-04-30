<template>
	<select @input="onInput">
		<option v-for="option in options" v-bind:key="option.value" :value="option.value">
			{{ option.text }}
		</option>
	</select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Settings from '../settings';

export default defineComponent({
	methods: {
		onInput($event: Event) {
			Settings.parity = (($event.target as HTMLInputElement).value as ParityType);
		},
	},
	data() {
		return {
			options: [
				{ value: 'none', text: 'None' },
				{ value: 'even', text: 'Even' },
				{ value: 'odd', text: 'Odd' },
			],
		};
	},
	mounted() {
		this.$el.value = Settings.parity;
	},
})
</script>
