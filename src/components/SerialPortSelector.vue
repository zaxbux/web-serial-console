<template>
	<select @input="onInput">
		<option value="-1" disabled selected>{{ ports.length > 0 ? 'select a port...' : 'no ports available' }}</option>

		<option v-for="(port, index) in ports" v-bind:key="index" :value="index">{{ port[1].label }}</option>
	</select>
</template>

<script lang="ts">
import { inject, defineComponent } from 'vue';
import SerialManager, { SerialPortMap } from '../serial-port-manager';
import Settings from '../settings';

export default defineComponent({
	emits: ['port-selected'],
	data() {
		return {
			ports: [],
		}
	},
	async mounted() {
		SerialManager.on('update', (data: {ports: SerialPortMap}) => {
			console.log('update ports');

			this.$data.ports = Array.from(data.ports);
		});

		await SerialManager.getPorts();

		if (this.$data.ports.length > 0) {
			this.$el.value = Settings.portIndex;

			this.$emit('port-selected', Number.parseInt(this.$el.value) >= 0);
		}
	},
	watch: {
		ports(ports) {
			if (!(ports.length > 0)) {
				// no ports available, force value
				this.$el.value = -1;
			}
			
			this.$emit('port-selected', Number.parseInt(this.$el.value) >= 0);

			return;
		}
	},
	methods: {
		onInput($event: Event) {
			const portIndex = Number.parseInt(($event.target as HTMLInputElement).value);
			const port = this.$data.ports[portIndex];

			Settings.portIndex = portIndex;

			this.$emit('port-selected', portIndex >= 0);
		}
	}
})
</script>
