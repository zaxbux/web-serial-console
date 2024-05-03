<template>
	<select v-model.number="value">
		<option value="-1" disabled selected>{{ ports.length > 0 ? 'select a port...' : 'no ports available' }}</option>
		<option v-for="(port, index) in ports" :key="index" :value="index">{{ port[1].label ?? `Unlabeled Port ${index}` }}</option>
	</select>
</template>
<script setup lang="ts">
import { inject, ref, watch, onMounted, computed } from 'vue';
import SerialManager, { type SerialPortMap } from '../serial-port-manager';
import Settings from '../settings';

const $emit = defineEmits<{
	(event: 'port-selected', payload: boolean): void
}>()

const ports = ref<any>([])

const value = computed({
	get: () => Settings.portIndex,
	set: (portIndex: number) => {
		const port = ports.value[portIndex];

		Settings.portIndex = portIndex;

		$emit('port-selected', portIndex >= 0);
	}
})

watch(ports, (ports) => {
	if (!(ports.length > 0)) {
		// no ports available, force value
		value.value = -1;
	}

	$emit('port-selected', value.value >= 0);
})

onMounted(async () => {
	SerialManager.on('update', (data: {ports: SerialPortMap}) => {
		console.log('update ports');

		ports.value = Array.from(data.ports);
	});

	await SerialManager.getPorts();

	if (ports.value.length > 0) {
		$emit('port-selected', value.value >= 0);
	}
})
</script>
