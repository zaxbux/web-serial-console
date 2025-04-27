<template>
  <v-dialog v-model="dialog">
    <template #activator="{ props }">
      <v-btn v-bind="props" title="Settings" icon="mdi-cog" />
    </template>
    <template #default>
      <v-card title="Settings">
        <v-card-text>
          <v-defaults-provider :defaults="{ VSelect: { density: 'compact'}, VTextField: { density: 'compact'}, VCheckbox: { density: 'compact'}}">
            <v-row>
            <v-col><v-select v-model="settings.cursorStyle" label="Cursor Style" :items="cursorStyleItems"/></v-col>
            <v-col cols="2"><v-checkbox label="Blink" v-model="settings.cursorBlink"/></v-col>
          </v-row>

          <v-text-field type="number" label="Scrollback" min="0" max="10000" v-model="settings.scrollback"/>

          <v-row>
            <v-col><v-select label="Bell Style" :items="bellStyleItems" v-model="settings.bellStyle" prepend-inner-icon="mdi-bell"/></v-col>
            <v-col cols="2"><v-checkbox label="Bell" v-model="settings.bell"/></v-col>
          </v-row>

          <v-select label="Font" v-model="settings.fontFamily" :items="['Source Code Pro']"/>

          <v-select label="Theme" v-model="settings.theme" :items="[{value: 'default', title: 'Dark'}, { value: 'light', title: 'Light'}]"/>
          <v-row no-gutters class="gr-2">
            <v-col v-for="(label, color) in colors" :key="color" cols="6">
              <v-row no-gutters>
                <v-col cols="6">{{label}}</v-col>
                <v-col >
                  <color-picker v-model="theme[color]"/>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-defaults-provider>
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
import { computed, ref } from "vue";
import ColorPicker from './ColorPicker.vue';
import { useSettingsStore } from '../stores/settings';

const settings = useSettingsStore()

const dialog = ref(false);

const cursorStyleItems = [
  { value: 'block', title: 'block' },
  { value: 'underline', title: 'underline' },
  { value: 'bar', title: 'bar' },
];

const bellStyleItems = [
  { value: 'none', title: 'None' },
  { value: 'visual', title: 'Visual' },
  { value: 'sound', title: 'Sound' },
  { value: 'both', title: 'Both' },
];

const colors = {
  selectionForeground:     'selection foreground',
	selectionBackground:     'selection background',
  //selectionInactiveBackground: 'selection inactive',
	cursor:        'cursor',
	cursorAccent:  'cursor accent',

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
  get: () => settings.getTheme(),
  set: (value) => settings.themes[settings.theme] = value
})

function resetSettings() {
	if (confirm('Are you sure you want to reset all settings?')) {
    window.localStorage.clear();
		settings.$reset();
	}
}
</script>

