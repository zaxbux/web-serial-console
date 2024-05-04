<template>
  <v-dialog v-model="dialog">
    <template #activator="{ props }">
      <v-btn v-bind="props" title="Settings" icon="mdi-cog" />
    </template>
    <template #default>
      <v-card title="Settings">
        <v-card-text>
          <v-row>
            <v-col><v-select v-model="consoleState.cursorStyle" label="Cursor Style" :items="cursorStyleItems"/></v-col>
            <v-col cols="2"><v-checkbox label="Blink" v-model="consoleState.cursorBlink"/></v-col>
          </v-row>

          <v-text-field type="number" label="Scrollback" min="0" max="10000" v-model="consoleState.scrollback"/>

          <v-row>
            <!-- <v-col><v-file-input label="Bell Style" accept="audio/*" v-model="consoleState.bellStyle"/></v-col> -->
            <v-col cols="2"><v-checkbox label="Bell" v-model="consoleState.bell"/></v-col>
          </v-row>

          <v-select label="Font" v-model="consoleState.fontFamily" :items="['Source Code Pro']"/>

          <v-card subtitle="Theme">
            <v-card-item>
              <v-row>
                <v-col v-for="(label, color) in colors" :key="color" cols="4">
                  <v-row>
                    <v-col cols="4">{{label}}</v-col>
                    <v-col >
                      <color-picker v-model="theme[color]"/>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row>
                <v-col v-for="(label, color) in ansi" :key="color" cols="6">
                  <v-row>
                    <v-col cols="4">
                      {{label}}
                    </v-col>
                    <v-col>
                      <color-picker v-model="theme[color]"/>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="resetSettings">Reset</v-btn>
          <v-spacer/>
          <v-btn @click="() => dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ColorPicker from './ColorPicker.vue';
import { useConsoleStore } from '../stores/console';

const $emit = defineEmits<{
	(event: 'close'): void
}>()

const consoleState = useConsoleStore()

const dialog = ref(false);

const cursorStyleItems = [
  { value: 'block', title: 'block' },
  { value: 'underline', title: 'underline' },
  { value: 'bar', title: 'bar' },
];

const colors = {
	selection:     'selection',
	cursor:        'cursor',
	cursorAccent:  'cursor accent',
};
const ansi = {
  background:    'background',
	foreground:    'foreground',
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

const theme = computed({
  get: () => consoleState.themes[consoleState.theme],
  set: (value) => consoleState.themes[consoleState.theme] = value
})

watch(dialog, (dialog) => {
  if (!dialog) {
    $emit('close');
  }
})

function resetSettings() {
	if (confirm('Are you sure you want to reset all settings?')) {
		consoleState.reset();
	}
}
</script>

