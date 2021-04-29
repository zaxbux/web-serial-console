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
			Settings.baudRate = Number.parseInt($event.target.value);
		},
	},
	data() {
		return {
			options: [
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
			]
		}
	},
	mounted() {
		this.$el.value = Settings.baudRate;
	},
})
</script>
