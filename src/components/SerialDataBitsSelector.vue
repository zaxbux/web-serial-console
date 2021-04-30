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
			Settings.dataBits = Number.parseInt(($event.target as HTMLInputElement).value);
		},
	},
	data() {
		return {
			options: [
				{ value: 7, text: '7' },
				{ value: 8, text: '8' },
			],
		};
	},
	mounted() {
		this.$el.value = Settings.dataBits;
	},
})
</script>
