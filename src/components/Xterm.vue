<template>
	<div ref="xterm" class="xterm-container xterm-full" />
</template>
<script setup lang="ts">
import '@xterm/xterm/css/xterm.css';
import 'source-code-pro/source-code-pro.css';
import { provide, ref, onMounted } from 'vue';
import Settings from '../settings';
import { TerminalPlatform } from '../xterm-extended';
import { ITerminalOptions } from '@xterm/xterm';

const $emit = defineEmits<{
	(event: 'ready', payload: TerminalPlatform): void
	(event: 'title-change', payload: string): void
	(event: 'line-feed'): void
}>()

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
		cursorStyle: Settings.cursorStyle,
		bellSound: Settings.bellSound,
		bellStyle: (Settings.bellStyle as ITerminalOptions['bellStyle']),
		fontFamily: Settings.fontFamily,
		scrollback: (Settings.scrollback as number),
		theme: Settings.themes.default,
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
</script>
<style scoped>
.xterm-container {
	@apply w-full;
	@apply h-full;
	@apply font-mono;
}
</style>
