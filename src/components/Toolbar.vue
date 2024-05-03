<template>
	<div class="p-4 w-full">
		<div class="flex flex-wrap gap-4">
			<div class="form-group">
				<label for="serial-port-selector" class="block">serial port</label>

				<div class="flex">
					<select id="serial-port-selector" class="form-control w-48 rounded-r-none min-h-full" :disabled="disableInputs" v-model.number="serialPort">
						<option value="-1" disabled selected>{{ ports.length > 0 ? 'select a port...' : 'no ports available' }}</option>
						<option v-for="(port, index) in ports" :key="index" :value="index">{{ port[1].label ?? `Unlabeled Port ${index}` }}</option>
					</select>
					<button class="btn border-l-0 rounded-l-none min-h-full" title="add port" @click="$emit('request-port')" :disabled="disableInputs"><font-awesome-icon :icon="['far', 'plus']" fixed-width /></button>
				</div>
			</div>

			<div class="mt-auto">
				<button class="btn"
					:title="connected ? 'disconnect' : 'connect'" @click="$emit('connect')"
					:disabled="connecting || disconnecting || !isPort"
				>
						<font-awesome-icon v-if="connected" :icon="['far', 'times-octagon']" fixed-width />
						<font-awesome-icon v-else :icon="['far', 'plug']" fixed-width />
				</button>
			</div>

			<div class="mt-auto">
				<button class="btn" title="clear" @click="$emit('clear')" :disabled="connecting || disconnecting"><font-awesome-icon :icon="['far', 'times-square']" fixed-width /></button>
			</div>

			<div class="divider-v opacity-20 mt-6"></div>

			<div class="form-group">
				<label for="serial-baud-rate" class="block">baud rate <HelpIcon text="The speed at which communication should be established." /></label>
					<select v-model.number="serialBaudRate" id="serial-baud-rate" class="form-control" :disabled="disableInputs">
						<option v-for="option, key in baudRateOptions" :key="key" :value="option.value">
							{{ option.text }}
						</option>
					</select>
			</div>

			<div class="divider-v opacity-20 mt-6"></div>

			<div class="mt-auto">
			<Popover class="relative">
				<PopoverButton class="btn" title="advanced options" :disabled="connecting || disconnecting">Advanced&nbsp;<font-awesome-icon :icon="['far', 'chevron-down']" fixed-width /></PopoverButton>

				<PopoverPanel class="absolute z-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-4 min-w-max">
					<div class="flex flex-wrap gap-4">
						<div class="form-group">
							<label for="serial-data-bits" class="block">data bits <HelpIcon text="The number of data bits in each character." /></label>
							<select id="serial-data-bits" class="form-control w-full" :disabled="disableInputs" v-model.number="serialDataBits">
								<option v-for="option, key in serialDataBitsOptions" :key="key" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>

						<div class="form-group">
							<label for="serial-parity" class="block">parity <HelpIcon text="The method of error detection to use." /></label>
							<select id="serial-parity" class="form-control w-full" :disabled="disableInputs" v-model="serialParity">
								<option v-for="option, key in serialParityOptions" :key="key" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>

						<div class="form-group">
							<label for="serial-stop-bits" class="block">stop bits <HelpIcon text="The number of stop bits at the end of each frame." /></label>
							<select id="serial-stop-bits" class="form-control w-full" :disabled="disableInputs" v-model="serialStopBits">
								<option v-for="option, key in stopBitsOptions" :key="key" :value="option.value">
									{{ option.text }}
								</option>
							</select>
						</div>
					</div>

					<div class="divider-h my-4 opacity-20"></div>

					<div class="flex flex-wrap gap-2">

						<div class="form-group">
							<label for="serial-echo-checkbox" class="block">echo <HelpIcon text="Enable local echo." /></label>
							<input id="serial-echo-checkbox" :disabled="disableInputs" type="checkbox" v-model="serialLocalEcho">
						</div>

						<div class="form-group">
							<label for="serial-flow-control-checkbox" class="block">flow control <HelpIcon text="Enable hardware-based flow control." /></label>
							<input id="serial-flow-control-checkbox" :disabled="disableInputs" type="checkbox" v-model="serialFlowControl">
						</div>
						
						<div class="form-group">
							<label for="serial-flush-on-enter-checkbox" class="block">flush on enter <HelpIcon text="Flush the buffer on enter instead of every key-press." /></label>
							<input id="serial-flush-on-enter-checkbox" :disabled="disableInputs" type="checkbox" v-model="serialFlushOnEnter">
						</div>
					</div>
				</PopoverPanel>
			</Popover>

			</div>

			<div class="mt-auto ml-auto flex gap-2">
				<button class="btn" title="download contents of terminal" @click="$emit('download')" :disabled="connecting || disconnecting">export <font-awesome-icon :icon="['far', 'save']" fixed-width /></button>

				<SettingsModal @close="$emit('change')"/>

				<colour-scheme-toggle/>

				<FullScreenToggle v-if="fullscreenEnabled" :fullscreen="fullscreen" @fullscreen="$emit('fullscreen')" />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { inject, ref, watch, onMounted, computed } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

import ColourSchemeToggle from './ColourSchemeToggle.vue';
import FullScreenToggle from './FullScreenToggle.vue';
import HelpIcon from './HelpIcon.vue';
import SettingsModal from './SettingsModal.vue';

import Settings from '../settings';
import SerialManager, { type SerialPortMap } from '../serial-port-manager';

const props = defineProps<{
	connected: boolean,
	connecting: boolean,
	disconnecting: boolean,
}>()

defineEmits<{
	(event: 'connect'): void
	(event: 'clear'): void
	(event: 'download'): void
	(event: 'request-port'): void
	(event: 'change'): void
	(event: 'fullscreen'): void
}>()

const ports = ref<any>([])
const isPort = ref(false)
const disableInputs = computed(() => props.connecting || props.connected || props.disconnecting);
const fullscreen = computed(() => document.fullscreenElement !== null);
const fullscreenEnabled = computed(() => document.fullscreenEnabled);

const baudRateOptions = [
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

const serialDataBitsOptions = [
	{ value: 7, text: '7' },
	{ value: 8, text: '8' },
];

const serialParityOptions = [
	{ value: 'none', text: 'None' },
	{ value: 'even', text: 'Even' },
	{ value: 'odd', text: 'Odd' },
];

const stopBitsOptions = [
	{ value: 1, text: '1' },
	{ value: 2, text: '2' },
];

const serialPort = computed({
	get: () => Settings.portIndex,
	set: (portIndex: number) => {
		const port = ports.value[portIndex];

		Settings.portIndex = portIndex;

		isPort.value = portIndex >= 0;
	}
});

const serialBaudRate = computed({
	get: () => Settings.baudRate,
	set: (v: number) => Settings.baudRate = v,
});

const serialDataBits = computed({
	get: () => Settings.dataBits,
	set: (v: number) => Settings.dataBits = v,
});

const serialParity = computed({
	get: () => Settings.parity,
	set: (v: string) => Settings.parity = v as ParityType,
});

const serialStopBits = computed({
	get: () => Settings.stopBits,
	set: (v: number) => Settings.stopBits = v
})

const serialLocalEcho = computed({
	get: () => Settings.echo,
	set: (v: string) => Settings.echo = v,
});

const serialFlowControl = computed({
	get: () => Settings.flowControl === 'hardware',
	set: (v) => Settings.flowControl = !v ? 'none' : 'hardware',
});

const serialFlushOnEnter = computed({
	get: () => Settings.flushOnEnter,
	set: (v: string) => Settings.flushOnEnter = v,
});

watch(ports, (ports) => {
	if (!(ports.length > 0)) {
		// no ports available, force value
		serialPort.value = -1;
	}

	isPort.value = serialPort.value >= 0;
})

onMounted(async () => {
	SerialManager.on('update', (data: {ports: SerialPortMap}) => {
		console.log('update ports');

		ports.value = Array.from(data.ports);
	});

	await SerialManager.getPorts();

	if (ports.value.length > 0) {
		isPort.value = serialPort.value >= 0;
	}
})
</script>
