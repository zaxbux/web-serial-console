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
      >
        <template #prepend-item>
          <v-list-item
            append-icon="mdi-plus"
            title="Connect"
            @click="settings.requestPort"
          />
          <v-divider />
        </template>
      </v-select>

      <v-select
        label="Baud Rate"
        hint="The speed at which communication should be established."
        class="pl-1 flex-grow-0 flex-shrink-0"
        min-width="16ch"
        v-model="settings.baudRate"
        :items="baudRateItems"
      />
    </v-defaults-provider>

    <v-toolbar-items>
      <v-btn
        :icon="state.connected ? 'mdi-close-octagon' : 'mdi-power-plug'"
        :title="state.connected ? 'disconnect' : 'connect'"
        :disabled="changing || settings.portIndex === null"
        @click="$emit('click:connect')"
      />

      <v-menu :close-on-content-click="false">
        <template #activator="{ isActive, props }">
          <v-btn
            v-bind="props"
            :disabled="changing"
            icon="mdi-wrench"
            :append-icon="isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          />
        </template>
        <template #default>
          <v-card>
            <v-card-text>
              <v-defaults-provider
                :defaults="{
                  VCheckbox: {
                    persistentHint: true,
                    density: 'compact',
                    disabled: connected,
                  },
                  VSelect: {
                    persistentHint: true,
                    density: 'compact',
                    disabled: connected,
                  },
                }"
              >
                <v-select
                  label="Data Bits"
                  hint="The number of data bits in each character."
                  v-model="settings.dataBits"
                  :items="dataBitsItems"
                />
                <v-select
                  label="Parity"
                  hint="The method of error detection to use."
                  v-model="settings.parity"
                  :items="parityItems"
                />
                <v-select
                  label="Stop Bits"
                  hint="The number of stop bits at the end of each frame."
                  v-model="settings.stopBits"
                  :items="stopBitsItems"
                />

                <v-checkbox
                  label="Echo"
                  hint="Enable local echo"
                  v-model="settings.localEcho"
                />
                <v-checkbox
                  label="Flow Control"
                  hint="Enable hardware-based flow control"
                  v-model="settings.flowControl"
                />
                <v-checkbox
                  label="Flush on enter"
                  hint="Flush the buffer on enter instead of every key-press"
                  v-model="settings.flushOnEnter"
                />
              </v-defaults-provider>
            </v-card-text>
          </v-card>
        </template>
      </v-menu>
      <v-divider vertical inset />

      <v-btn
        icon="mdi-close-box"
        title="clear"
        :disabled="changing"
        @click="$emit('click:clear')"
      />
    </v-toolbar-items>

    <v-spacer />
    <v-toolbar-items>
      <v-btn
        title="download contents of terminal"
        icon="mdi-download"
        @click="$emit('click:download')"
        :disabled="changing"
      />

      <colour-scheme-toggle />

      <v-btn
        v-if="isFullscreenSupported"
        title="fullscreen"
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
import { useConsoleStore } from "@/stores/console";
import { useSettingsStore } from "@/stores/settings";

defineEmits<{
  (event: "click:connect"): void;
  (event: "click:clear"): void;
  (event: "click:download"): void;
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

const serialPorts = computed(() =>
  settings.ports.map((port, index) => ({
    value: index,
    title: port[1].label ?? `Unlabeled Port ${index}`,
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
</script>
