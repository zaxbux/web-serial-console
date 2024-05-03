<template>
	<div class="grid grid-cols-3 gap-2">
		<div v-for="(label, color) in colors" :key="color">
			<label :for="`terminal-theme-${color}`" class="block">{{ label }}</label>
			<input type="color" :id="`terminal-theme-${color}`" :value="getThemeColor(color)" @change="($event) => setThemeColor(color, $event)">
		</div>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div v-for="(label, color) in ansi" :key="color">
			<label :for="`terminal-theme-${color}`" class="block">{{ label }}</label>
			<input type="color" :id="`terminal-theme-${color}`" :value="getThemeColor(color)" @change="($event) => setThemeColor(color, $event)">
		</div>
	</div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { ITheme } from '@xterm/xterm';
import { Settings } from '../settings'

const colors = {
	background:    'background',
	foreground:    'foreground',
	selection:     'selection',
	cursor:        'cursor',
	cursorAccent:  'cursor accent',
};
const ansi = {
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
};

function setThemeColor(color: keyof ITheme, $event: Event): void {
	const theme = Settings.themes.default;

	theme[color] = ($event.target as HTMLInputElement).value;

	Settings.themes.default = theme
}

function getThemeColor(color: keyof ITheme): string {
	const theme = Settings.themes.default;

	return theme[color];
}
</script>
