<template>
	<div class="xterm-container xterm-full" />
</template>
<script lang="ts">
import 'xterm/css/xterm.css';
import 'source-code-pro/source-code-pro.css';
import { provide, ref, defineComponent } from 'vue';
import Settings from '../settings';
import { TerminalPlatform } from '../xterm-extended';
import { ITerminalOptions } from 'xterm';


export default defineComponent({
	name: 'Xterm',
	emits: [
		'ready',
		'title-change',
		'line-feed'
	],
	setup() {
		const platform = ref();

		return { platform };
	},
	mounted(): void {
		this.platform = new TerminalPlatform({
			cursorStyle: this.$settings.cursorStyle,
			bellSound: Settings.bellSound,
			bellStyle: (Settings.bellStyle as ITerminalOptions['bellStyle']),
			fontFamily: Settings.fontFamily,
			scrollback: (Settings.scrollback as number),
			theme: Settings.themes.default,
		});

		this.platform.terminal.onTitleChange((title: string) => this.$emit('title-change', title));
		this.platform.terminal.onLineFeed(() => this.$emit('line-feed'));

		this.platform.terminal.open(this.$el);
		this.platform.writeTestPattern();
		this.platform.fitAddon.fit();

		window.addEventListener('resize', () => {
			this.platform.fitAddon.fit()
		});

		this.$emit('ready', this.platform);
	},
	
	methods: {
		focus() {
			this.platform.terminal.focus()
		},
		blur() {
			this.platform.terminal.blur()
		},
		paste(data: string) {
			this.platform.terminal.paste(data)
		},
	}
})
</script>
<style scoped>
.xterm-container {
	@apply w-full;
	@apply h-full;
	@apply font-mono;
}
</style>
