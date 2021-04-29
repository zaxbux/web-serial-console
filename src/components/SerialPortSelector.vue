<template>
	<select @input="onInput">
		<option disabled selected v-if="!(ports.length > 0)">no ports available</option>
		<option disabled selected v-else>select a port...</option>
		<option v-for="(port, index) in ports" v-bind:key="index" :value="index">{{ port[1].label }}</option>
	</select>
</template>

<script lang="ts">
import { inject, defineComponent } from 'vue';
import SerialManager from '../serial-port-manager';
import Settings from '../settings';

export default defineComponent({
	emits: [
		'update:value'
	],
	data() {
		return {
			ports: [],
		}
	},
	async mounted() {
		SerialManager.on('update', (data) => {
			console.log('update ports');

			this.$data.ports = Array.from(data.ports);
		});

		await SerialManager.getPorts();

		this.$el.value = Settings.portIndex;
	},
	methods: {
		onInput($event: Event) {
			const portIndex = Number.parseInt($event.target.value);
			const port = this.$data.ports[portIndex];

			Settings.portIndex = portIndex;

			this.$emit('update:value', port);
		}
	}
})
</script>
