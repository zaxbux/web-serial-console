<template>
	<Toolbar :connected="connected" :connecting="connecting" :disconnecting="disconnecting" @connect="toggleConsole(connected)" @clear="resetTerminal()" @download="downloadContents()" @request-port="requestPort()" @change="setTerminalOptions()" />

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

<script lang="ts">
import { defineComponent } from 'vue';

import Toolbar from './Toolbar.vue';
import Xterm from './Xterm.vue';

import Settings from '../settings';
import Log from '../utils/log';
import SerialManager, { getPortMetadata, SerialPortMetadata } from '../serial-port-manager';
import { SerialPortConsole } from '../serial-port-console';
import { TerminalPlatform } from '../xterm-extended';
import { fauxLink } from '../utils/fauxLink';

const log = new Log('console');

export default defineComponent({
	components: {
		Toolbar,
		Xterm,
	},
	computed: {
		statusText() {
			return (this as any).$data.statusMessages.slice(-1).pop();
		}
	},
	methods: {
		onXtermReady(platform: TerminalPlatform) {
			log.info('terminal ready');

			this.$options.platform = platform;

			this.$options.serialConsole = new SerialPortConsole(platform.terminal, {
				onConnecting: (options) => {
					log.info('connecting', options);
					this.$data.connecting = true;

					this.$options.platform.terminal.reset();
				},
				onConnected: (port) => {
					log.info('connected');
					this.$data.connecting = false;
					this.$data.connected = true;

					this.$data.statusMessages.push(`connected to ${getPortMetadata(port).label}`);
				},
				onDisconnecting: (data) => {
					log.info('disconnecting', data);
					this.$data.disconnecting = true;
				},
				onDisconnected: (data) => {
					log.info('disconnected', data);
					this.$data.disconnecting = false;
					this.$data.connected = false;

					this.$data.statusMessages.push(`disconnected`);
				},
				onConnectError: (error) => {
					log.error('connect error', error);
				},
				onDisconnectError: (error) => {
					log.error('disconnect error', error);
				}
			});
		},
		onXtermTitle(title: string) {
			document.title = `${title}`;
		},
		onXtermLineFeed() {
			this.$data.lines = this.$data.lines + 1;
		},
		setTerminalOptions() {
			this.$options.platform.terminal.setOption('theme', Settings.themes.default);
		},
		async toggleConsole(connected: boolean): Promise<void> {
			const port = SerialManager.getPort(Settings.portIndex);

			if (!port) {
				alert('please select a port');
				return;
			}

			if (!this.$options.serialConsole) {
				return;
			}

			if (connected) {
				this.$options.serialConsole.disconnect();
			} else {
				this.$options.serialConsole.echo = Settings.echo;
				this.$options.serialConsole.flushOnEnter = Settings.flushOnEnter;

				this.$options.serialConsole.connect(port, {
					baudRate: Settings.baudRate,
					dataBits: Settings.dataBits,
					parity: Settings.parity,
					stopBits: Settings.stopBits,
					flowControl: Settings.flowControl,
				});
			}
		},
		downloadContents(): void {
			fauxLink(this.$options.platform.serializeAddon.serialize()).click();
		},
		resetTerminal(): void {
			this.$options.platform.terminal.reset();
			this.$data.lines = 0;
		},
		async requestPort(): Promise<void> {
			try {
				await SerialManager.requestPort();
			} catch (error) {
				this.statusMessages.push(error.message);
			}
		}
	},
	data() {
		return {
			connected: false,
			connecting: false,
			disconnecting: false,
			statusMessages: ['disconnected'],
			lines: 0,
		};
	},
	mounted() {
		SerialManager.on('connect', (data: { port: SerialPort, metadata: SerialPortMetadata}) => {
			(this as any).$data.statusMessages.push(`${data.metadata.label} connected`);
		});

		SerialManager.on('disconnect', (data: { port: SerialPort, metadata: SerialPortMetadata}) => {
			(this as any).$data.statusMessages.push(`${data.metadata.label} disconnected`);
		});
	}
});
</script>
