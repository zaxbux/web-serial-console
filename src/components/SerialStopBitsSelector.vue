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
			Settings.stopBits = Number.parseInt($event.target.value);
		},
	},
	data() {
		return {
			options: [
				{ value: 1, text: '1' },
				{ value: 2, text: '2' },
			],
		};
	},
	mounted() {
		this.$el.value = Settings.stopBits;
	},
})
</script>