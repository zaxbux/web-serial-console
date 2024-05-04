<template>
	<div ref="xterm" class="xterm-container xterm-full h-100 w-100" />
</template>
<script setup lang="ts">
import '@xterm/xterm/css/xterm.css';
import 'source-code-pro/source-code-pro.css';
import { ref, onMounted, computed } from 'vue';
import { TerminalPlatform } from '@/utils/xterm-extended';
import { ITerminalOptions } from '@xterm/xterm';
import { useConsoleStore } from '@/stores/console';

const $emit = defineEmits<{
	(event: 'ready', payload: TerminalPlatform): void
	(event: 'title-change', payload: string): void
	(event: 'line-feed'): void
}>()

const consoleState = useConsoleStore()

const xterm = ref<HTMLDivElement>()
const platform = ref<TerminalPlatform>();

function focus() {
	platform.value.terminal.focus()
}
function blur() {
	platform.value.terminal.blur()
}
function paste(data: string) {
	platform.value.terminal.paste(data)
}

onMounted(() => {
	platform.value = new TerminalPlatform({
		cursorStyle: consoleState.cursorStyle,
		bellSound: consoleState.bellSound,
		bellStyle: (consoleState.bellStyle as ITerminalOptions['bellStyle']),
		fontFamily: consoleState.fontFamily,
		scrollback: consoleState.scrollback,
		theme: consoleState.themes.default,
		allowProposedApi: true,
	});

	platform.value.terminal.onTitleChange((title: string) => $emit('title-change', title));
	platform.value.terminal.onLineFeed(() => $emit('line-feed'));

	platform.value.terminal.open(xterm.value);
	platform.value.writeTestPattern();
	platform.value.fitAddon.fit();

	window.addEventListener('resize', () => {
		platform.value.fitAddon.fit()
	});

	$emit('ready', platform.value);
})

const fontFamily = computed(() => consoleState.fontFamily)
</script>
<style scoped lang="scss">
.xterm-container {
  font-family: v-bind(fontFamily);
}

.xterm-full {
		.terminal {
			@apply h-full;
			@apply flex;
			@apply p-2;

			.xterm-viewport {
				//scrollbar-width: thin;          // "auto" or "thin"
				scrollbar-color: transparent;   // scroll thumb and track

				&::-webkit-scrollbar {
					width: 1rem;               // width of the entire scrollbar
				}

				&::-webkit-scrollbar-track {
					@apply transition-colors;
					background-color: rgba(0, 0, 0, 0.1);        // color of the tracking area
					border-left: 1px solid rgba(255, 255, 255, 0.3);


				}

				&::-webkit-scrollbar-thumb {
					background-color: rgba(255, 255, 255, 0.5);    // color of the scroll thumb
					//border-radius: 20px;       // roundness of the scroll thumb
					//border: 3px solid orange;  // creates padding around scroll thumb

					&:hover {
						background-color: rgba(255, 255, 255, 0.7);
					}
				}
			}

			.xterm-screen {
				@apply mt-auto;
			}
		}
	}
</style>
