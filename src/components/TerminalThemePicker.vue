<template>
	<div class="grid grid-cols-3 gap-2">
		<div v-for="(label, color) in colors" v-bind:key="color">
			<label :for="`terminal-theme-${color}`" class="block">{{ label }}</label>
			<input type="color" :id="`terminal-theme-${color}`" :value="getThemeColor(color)" @change="setThemeColor(color, $event)">
		</div>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div v-for="(label, color) in ansi" v-bind:key="color">
			<label :for="`terminal-theme-${color}`" class="block">{{ label }}</label>
			<input type="color" :id="`terminal-theme-${color}`" :value="getThemeColor(color)" @change="setThemeColor(color, $event)">
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ITheme } from 'xterm';

export default defineComponent({
	methods: {
		setThemeColor(color: keyof ITheme, $event: Event): void {
			const theme = this.$settings.themes.default;

			theme[color] = ($event.target as HTMLInputElement).value;

			this.$settings.themes = {
				default: theme,
			};
		},

		getThemeColor(color: keyof ITheme): string {
			const theme = this.$settings.themes.default;

			return theme[color];
		},
	},
	data() {
		return {
			colors: {
				background:    'background',
				foreground:    'foreground',
				selection:     'selection',
				cursor:        'cursor',
				cursorAccent:  'cursor accent',
			},
			ansi: {
				black:         'black',          // 0
				brightBlack:   'bright black',   // 8
				red:           'red',            // 1
				brightRed:     'bright red',     // 9
				green:         'green',          // 2
				brightGreen:   'bright green',   // 10
				yellow:        'yellow',         // 3
				brightYellow:  'bright yellow',  // 11
				blue:          'blue',           // 4
				brightBlue:    'bright blue',    // 12
				magenta:       'magenta',        // 5
				brightMagenta: 'bright magenta', // 13
				cyan:          'cyan',           // 6
				brightCyan:    'bright cyan',    // 14
				white:         'white',          // 7
				brightWhite:   'bright white',   // 15
			},
		};
	},
	setup() {
		
	},
})
</script>
