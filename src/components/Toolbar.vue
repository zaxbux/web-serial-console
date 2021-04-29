<template>
	<div class="p-4 w-full">
		<div class="flex flex-wrap gap-4">
			<div class="form-group">
				<label for="serial-port-selector" class="block">serial port</label>

				<div class="flex">
					<serial-port-selector id="serial-port-selector" class="form-control w-48 rounded-r-none min-h-full" :disabled="disableInputs" />
					<button class="btn border-l-0 rounded-l-none min-h-full" title="add port" @click="$emit('request-port')" :disabled="disableInputs"><font-awesome-icon :icon="['far', 'plus']" fixed-width /></button>
				</div>
			</div>

			<div class="mt-auto">
				<button class="btn"
					:title="connected ? 'disconnect' : 'connect'" @click="$emit('connect')"
					:disabled="connecting || disconnecting"
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
				<serial-baud-rate-selector id="serial-baud-rate" class="form-control"
					:disabled="disableInputs" />
			</div>

			<div class="divider-v opacity-20 mt-6"></div>

			<div class="mt-auto">
			<Popover class="relative">
				<PopoverButton class="btn" title="advanced options" :disabled="connecting || disconnecting">Advanced&nbsp;<font-awesome-icon :icon="['far', 'chevron-down']" fixed-width /></PopoverButton>

				<PopoverPanel class="absolute z-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-4 min-w-max">
					<div class="flex flex-wrap gap-4">
						<div class="form-group">
							<label for="serial-data-bits" class="block">data bits <HelpIcon text="The number of data bits in each character." /></label>
							<serial-data-bits-selector id="serial-data-bits" class="form-control w-full" :disabled="disableInputs" />
						</div>

						<div class="form-group">
							<label for="serial-parity" class="block">parity <HelpIcon text="The method of error detection to use." /></label>
							<serial-parity-selector id="serial-parity" class="form-control w-full" :disabled="disableInputs" />
						</div>

						<div class="form-group">
							<label for="serial-stop-bits" class="block">stop bits <HelpIcon text="The number of stop bits at the end of each frame." /></label>
							<serial-stop-bits-selector id="serial-stop-bits" class="form-control w-full" :disabled="disableInputs" />
						</div>
					</div>

					<div class="divider-h my-4 opacity-20"></div>

					<div class="flex flex-wrap gap-2">

						<div class="form-group">
							<label for="serial-echo-checkbox" class="block">echo <HelpIcon text="Enable local echo." /></label>
							<serial-echo-checkbox id="serial-echo-checkbox" :disabled="disableInputs" />
						</div>

						<div class="form-group">
							<label for="serial-flow-control-checkbox" class="block">flow control <HelpIcon text="Enable hardware-based flow control." /></label>
							<serial-flow-control-checkbox id="serial-flow-control-checkbox" :disabled="disableInputs" />
						</div>
						
						<div class="form-group">
							<label for="serial-flush-on-enter-checkbox" class="block">flush on enter <HelpIcon text="Flush the buffer on enter instead of every key-press." /></label>
							<serial-flush-on-enter-checkbox id="serial-flush-on-enter-checkbox" :disabled="disableInputs" />
						</div>
					</div>
				</PopoverPanel>
			</Popover>

			</div>

			<div class="mt-auto ml-auto flex gap-2">
				<button class="btn" title="download contents of terminal" @click="$emit('download')" :disabled="connecting || disconnecting">export <font-awesome-icon :icon="['far', 'save']" fixed-width /></button>

				<SettingsModal @close="$emit('change')"/>

				<colour-scheme-toggle/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

import SerialPortSelector from './SerialPortSelector.vue';
import SerialBaudRateSelector from './SerialBaudRateSelector.vue';
import SerialDataBitsSelector from './SerialDataBitsSelector.vue';
import SerialParitySelector from './SerialParitySelector.vue';
import SerialStopBitsSelector from './SerialStopBitsSelector.vue';

import SerialEchoCheckbox from './SerialEchoCheckbox.vue';
import SerialFlushOnEnterCheckbox from './SerialFlushOnEnterCheckbox.vue';
import SerialFlowControlCheckbox from './SerialFlowControlCheckbox.vue';

import ColourSchemeToggle from './ColourSchemeToggle.vue';
import HelpIcon from './HelpIcon.vue';
import SettingsModal from './SettingsModal.vue';

export default defineComponent({
	components: {
		SerialPortSelector,
		SerialBaudRateSelector,
		SerialDataBitsSelector,
		SerialParitySelector,
		SerialStopBitsSelector,
		SerialEchoCheckbox,
		SerialFlushOnEnterCheckbox,
		SerialFlowControlCheckbox,
		ColourSchemeToggle,
		HelpIcon,
		Popover, PopoverButton, PopoverPanel,
		SettingsModal,
	},
	props: [
		'connected',
		'connecting',
		'disconnecting',
	],
	emits: [
		'connect',
		'clear',
		'download',
		'request-port',
		'change'
	],
	computed: {
		disableInputs() {
			return this.$props.connecting || this.$props.connected || this.$props.disconnecting;
		}
	},
})
</script>
