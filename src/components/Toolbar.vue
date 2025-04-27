<template>
  <v-app-bar density="compact">
    <v-defaults-provider
      :defaults="{
        VSelect: {
          rounded: false,
          density: 'compact',
          disabled: connected,
          hideDetails: true,
        },
      }"
    >
      <v-select
        class="pl-1"
        label="Serial Port"
        v-model="settings.portIndex"
        placeholder="select a port..."
        :items="serialPorts"
        prepend-inner-icon="mdi-connection"
      >
        <template #prepend-item>
          <v-list-item
            prepend-icon="mdi-plus"
            title="Request port"
            @click="settings.requestPort"
          />
          <v-divider />
        </template>
        <template #item="{ props: itemProps }">
          <v-list-item v-bind="itemProps" prepend-icon="mdi-usb-port"/>
        </template>
      </v-select>

      <v-select
        label="Baud Rate"
        v-tooltip:bottom="'The speed at which communication should be established.'"
        class="pl-1 flex-grow-0 flex-shrink-0"
        min-width="16ch"
        v-model="settings.baudRate"
        :items="baudRateItems"
        prepend-inner-icon="mdi-square-wave"
      />
    </v-defaults-provider>

    <v-toolbar-items>
      <v-btn
        :icon="'mdi-power-plug'"
        v-tooltip:bottom="state.connected ? 'Disconnect' : 'Connect'"
        :active="state.connected"
        :color="state.connected ? 'green' : undefined"
        :disabled="changing || settings.portIndex === null"
        @click="$emit('click:connect')"
      />

      <v-menu :close-on-content-click="false">
        <template #activator="{ isActive, props }">
          <v-btn
            v-bind="props"
            :disabled="changing"
            icon="mdi-wrench"
            v-tooltip:bottom="'Port options'"
            :append-icon="isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          />
        </template>
        <template #default>
          <v-card>
            <v-card-text>
              <btn-toggle v-model="settings.dataBits" :items="dataBitsItems" label="Data Bits" hint="The number of data bits in each character."/>
              <v-divider class="my-1"/>
              <btn-toggle v-model="settings.parity" :items="parityItems" label="Parity" hint="The method of error detection to use."/>
              <v-divider class="my-1"/>
              <btn-toggle v-model="settings.stopBits" :items="stopBitsItems" label="Stop Bits" hint="The number of stop bits at the end of each frame."/>
              <v-divider class="my-1"/>
              <btn-toggle v-model="settings.localEcho" :items="[{value: false, title: 'Off'}, {value: true, title: 'On'}]" label="Echo" hint="Enable local echo."/>
              <v-divider class="my-1"/>
              <btn-toggle v-model="settings.flowControl" :items="[{value: 'none', title: 'None'}, {value: 'hardware', title: 'Hardware'}]" label="Flow Control" hint="Enable hardware-based flow control."/>
              <v-divider class="my-1"/>
              <btn-toggle v-model="settings.flushOnEnter" :items="[{value: true, title: 'On'}, {value: false, title: 'Off'}]" label="Flush on enter" hint="Flush the buffer on enter instead of every key-press."/>
            </v-card-text>
          </v-card>
        </template>
      </v-menu>

      <v-divider vertical inset />

      <v-btn
        icon="mdi-close-box"
        v-tooltip:bottom="'Clear'"
        :disabled="changing"
        @click="$emit('click:clear')"
      />
    </v-toolbar-items>

    <v-spacer />
    <v-toolbar-items>
      <v-menu>
        <template #activator="{ props: btnProps }">
          <v-btn
          v-bind="btnProps"
            v-tooltip:bottom="'Download contents of terminal'"
            icon="mdi-download"
            :disabled="changing"
          />
        </template>
        <template #default>
          <v-list :items="downloadItems"/>
        </template>
      </v-menu>

      <colour-scheme-toggle />

      <v-btn
        v-if="isFullscreenSupported"
        v-tooltip:bottom="'Fullscreen'"
        :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
        @click="toggleFullscreen"
      />

      <SettingsModal />
    </v-toolbar-items>
  </v-app-bar>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useFullscreen } from "@vueuse/core";
import ColourSchemeToggle from "./ColourSchemeToggle.vue";
import SettingsModal from "./SettingsModal.vue";
import BtnToggle from './BtnToggle.vue'
import { useConsoleStore } from "@/stores/console";
import { useSettingsStore } from "@/stores/settings";

const emit = defineEmits<{
  (event: "click:connect"): void;
  (event: "click:clear"): void;
  (event: "click:download", mode: 'raw' | 'text' | 'html'): void;
}>();

const state = useConsoleStore();
const settings = useSettingsStore();

const connected = computed(
  () => state.connecting || state.connected || state.disconnecting
);
const changing = computed(() => state.connecting || state.disconnecting);

const {
  isSupported: isFullscreenSupported,
  isFullscreen,
  toggle: toggleFullscreen,
} = useFullscreen();

const serialPorts = computed(() => settings.ports.map(([port, info], index) => ({
    value: index,
    title: info.label,
  }))
);

const baudRateItems = [
  { value: 9600, title: "9600" },
  { value: 14400, title: "14400" },
  { value: 19200, title: "19200" },
  { value: 28800, title: "28800" },
  { value: 38400, title: "38400" },
  { value: 57600, title: "57600" },
  { value: 115200, title: "115200" },
  { value: 230400, title: "230400" },
  { value: 460800, title: "460800" },
  { value: 921600, title: "921600" },
];

const dataBitsItems = [
  { value: 7, title: "7" },
  { value: 8, title: "8" },
];

const parityItems = [
  { value: "none", title: "None" },
  { value: "even", title: "Even" },
  { value: "odd", title: "Odd" },
];

const stopBitsItems = [
  { value: 1, title: "1" },
  { value: 2, title: "2" },
];

const downloadItems = [
  { title: 'Raw', props: { prependIcon: 'mdi-code-block-tags', onClick: () => emit('click:download', 'raw') }},
  { title: 'Text', props: { prependIcon: 'mdi-format-size', onClick: () => emit('click:download', 'text') }},
  { title: 'HTML', props: { prependIcon: 'mdi-xml', onClick: () => emit('click:download', 'html') }},
];
</script>
<style lang="scss" scoped>
.v-checkbox.v-input--density-compact {
  --v-input-control-height: 28px;
}
</style>
