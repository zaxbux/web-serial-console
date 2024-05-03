<template>
	<Toolbar :connected="connected" :connecting="connecting" :disconnecting="disconnecting" @connect="toggleConsole(connected)" @clear="resetTerminal()" @download="downloadContents()" @request-port="requestPort()" @change="setTerminalOptions()" @fullscreen="requestFullscreen()" />

	<Xterm ref="xterm" @ready="onXtermReady" @title-change="onXtermTitle" @line-feed="onXtermLineFeed" />

	<div class="px-2 py-1 bg-gray-600 text-white dark:bg-gray-300 dark:text-black flex gap-2">
		<div>
			<font-awesome-icon v-if="connected" :icon="['far', 'play-circle']" fixed-width class="text-green-500" /><font-awesome-icon v-else :icon="['far', 'stop-circle']" fixed-width class="text-red-500" />
		</div>

		<div class="divider-v my-1 opacity-50"></div>

		<div>{{ statusText }}</div>
		
		<div class="ml-auto">{{ lines }} lines</div>
	</div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, type ComponentPublicInstance } from 'vue';

import Toolbar from './Toolbar.vue';
import Xterm from './Xterm.vue';

import Settings from '../settings';
import Log from '../utils/log';
import SerialManager, { getPortMetadata, SerialPortMetadata } from '../serial-port-manager';
import { SerialPortConsole } from '../serial-port-console';
import { TerminalPlatform } from '../xterm-extended';
import { fauxLink } from '../utils/fauxLink';

const log = new Log('console');

const xterm = ref<ComponentPublicInstance<typeof Xterm>>()
const connected = ref(false)
const connecting = ref(false)
const disconnecting = ref(false)
const statusMessages = ref(['disconnected'])
const lines = ref(0)
const fullscreen = ref(false)

const statusText = computed(() => statusMessages.value.slice(-1).pop())

let platform
let serialConsole

function onXtermReady(platform: TerminalPlatform) {
	log.info('terminal ready');

	platform = platform;

	serialConsole = new SerialPortConsole(platform.terminal, {
		onConnecting: (options) => {
			log.info('connecting', options);
			connecting.value = true;

			platform.terminal.reset();
		},
		onConnected: (port) => {
			log.info('connected');
			connecting.value = false;
			connected.value = true;

			statusMessages.value.push(`connected to ${getPortMetadata(port).label}`);
		},
		onDisconnecting: (data) => {
			log.info('disconnecting', data);
			disconnecting.value = true;
		},
		onDisconnected: (data) => {
			log.info('disconnected', data);
			disconnecting.value = false;
			connected.value = false;

			statusMessages.value.push(`disconnected`);
		},
		onConnectError: (error) => {
			log.error('connect error', error);
		},
		onDisconnectError: (error) => {
			log.error('disconnect error', error);
		}
	});
}
function onXtermTitle(title: string) {
	document.title = `${title}`;
}
function onXtermLineFeed() {
	lines.value = lines.value + 1;
}
function setTerminalOptions() {
	platform.terminal.setOption('theme', Settings.themes.default);
	platform.terminal.setOption('cursorStyle', Settings.cursorStyle);
	platform.terminal.setOption('bellStyle', Settings.bellStyle);
	platform.terminal.setOption('cursorBlink', Settings.cursorBlink);
	
	this.xterm.focus();
}
async function toggleConsole(connected: boolean): Promise<void> {
	const port = SerialManager.getPort(Settings.portIndex);

	if (!port) {
		alert('please select a port');
		return;
	}

	if (!serialConsole) {
		return;
	}

	if (connected) {
		serialConsole.disconnect();
	} else {
		serialConsole.echo = Settings.echo;
		serialConsole.flushOnEnter = Settings.flushOnEnter;

		serialConsole.connect(port, {
			baudRate: Settings.baudRate,
			dataBits: Settings.dataBits,
			parity: Settings.parity,
			stopBits: Settings.stopBits,
			flowControl: Settings.flowControl,
		});
	}
}
function downloadContents(): void {
	fauxLink(platform.serializeAddon.serialize()).click();
}
function resetTerminal(): void {
	platform.terminal.reset();
	lines.value = 0;
}
async function requestPort(): Promise<void> {
	try {
		await SerialManager.requestPort();
	} catch (error) {
		this.statusMessages.push(error.message);
	}
}
function requestFullscreen() {
	try {
		this.xterm.$el.requestFullscreen();
	} catch (error) {
		log.warn('fullscreen rejected', error);
	}
}

onMounted(() => {
	SerialManager.on('connect', (data: { port: SerialPort, metadata: SerialPortMetadata}) => {
		statusMessages.value.push(`${data.metadata.label} connected`);
	});

	SerialManager.on('disconnect', (data: { port: SerialPort, metadata: SerialPortMetadata}) => {
		statusMessages.value.push(`${data.metadata.label} disconnected`);
	});
})
</script>
