<template>
	<v-main  height="100%" max-height="100%">
    <Toolbar @connect="toggleConsole(connected)" @clear="resetTerminal()" @download="downloadContents()" @request-port="requestPort()" @change="setTerminalOptions()" />
    <Xterm ref="xterm" @ready="onXtermReady" @title-change="onXtermTitle" @line-feed="onXtermLineFeed" />
    <v-footer>
    <v-row>
      <v-col cols="auto">
        <v-icon v-if="consoleState.connected" icon="mdi-play-circle" color="green"/>
        <v-icon v-if="!consoleState.connected" icon="mdi-stop-circle" color="red"/>
      </v-col>
      <v-divider vertical/>
      <v-col cols="auto">
        {{ statusText }}
      </v-col>
      <v-spacer/>
      <v-col cols="auto">
        {{ consoleState.lines}} lines
      </v-col>
    </v-row>
  </v-footer>
  </v-main>


</template>
<script setup lang="ts">
import { ref, computed, onMounted, type ComponentPublicInstance } from 'vue';

import Toolbar from './Toolbar.vue';
import Xterm from './Xterm.vue';

import Log from '@/utils/log';
import SerialManager, { getPortMetadata, SerialPortMetadata } from '@/utils/serial-port-manager';
import { SerialPortConsole } from '@/utils/serial-port-console';
import { TerminalPlatform } from '@/utils/xterm-extended';
import { fauxLink } from '@/utils/fauxLink';
import { useConsoleStore } from '@/stores/console';

const consoleState = useConsoleStore()

const log = new Log('console');

const xterm = ref<ComponentPublicInstance<typeof Xterm>>()
const statusMessages = ref(['disconnected'])

const statusText = computed(() => statusMessages.value.slice(-1).pop())

let platform
let serialConsole

function onXtermReady(_platform: TerminalPlatform) {
	log.info('terminal ready');

	platform = _platform;

	serialConsole = new SerialPortConsole(platform.terminal, {
		onConnecting: (options) => {
			log.info('connecting', options);
			consoleState.connecting = true;

			platform.terminal.reset();
		},
		onConnected: (port) => {
			log.info('connected');
			consoleState.connecting = false;
			consoleState.connected = true;

			statusMessages.value.push(`connected to ${getPortMetadata(port).label}`);
		},
		onDisconnecting: (data) => {
			log.info('disconnecting', data);
			consoleState.disconnecting = true;
		},
		onDisconnected: (data) => {
			log.info('disconnected', data);
			consoleState.disconnecting = false;
			consoleState.connected = false;

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
	consoleState.lines++;
}
function setTerminalOptions() {
	platform.terminal.setOption('theme', consoleState.themes.default);
	platform.terminal.setOption('cursorStyle', consoleState.cursorStyle);
	platform.terminal.setOption('bellStyle', consoleState.bellStyle);
	platform.terminal.setOption('cursorBlink', consoleState.cursorBlink);

	xterm.value?.focus();
}
async function toggleConsole(connected: boolean): Promise<void> {
	const port = SerialManager.getPort(consoleState.portIndex);

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
		serialConsole.echo = consoleState.echo;
		serialConsole.flushOnEnter = consoleState.flushOnEnter;

		serialConsole.connect(port, {
			baudRate: consoleState.baudRate,
			dataBits: consoleState.dataBits,
			parity: consoleState.parity,
			stopBits: consoleState.stopBits,
			flowControl: consoleState.flowControl,
		});
	}
}
function downloadContents(): void {
	fauxLink(platform.serializeAddon.serialize()).click();
}
function resetTerminal(): void {
	platform.terminal.reset();
	consoleState.lines = 0;
}
async function requestPort(): Promise<void> {
	try {
		await SerialManager.requestPort();
	} catch (error) {
		this.statusMessages.push(error.message);
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
