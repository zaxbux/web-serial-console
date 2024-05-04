<template>
  <v-app-bar density="compact">
    <v-select
    class="pl-1"
    :rounded="false"
      hide-details
      label="Serial Port"
      density="compact"
      :disabled="disableInputs"
      v-model="consoleStore.portIndex"
      placeholder="select a port..."
      :items="serialPortsItems"
    >
      <template #prepend-item>
        <v-list-item
          append-icon="mdi-plus"
          title="Add Port"
          @click="$emit('request-port')"
        />
        <v-divider/>
      </template>
    </v-select>

    <v-select
      hide-details
      :rounded="false"
      label="Baud Rate"
      density="compact"
      class="pl-1 flex-0-0"
      v-model="consoleStore.baudRate"
      :disabled="disableInputs"
      :items="baudRateItems"
    >
      <!-- <template #prepend-inner>
        <help-icon
          text="The speed at which communication should be established."
        />
      </template> -->
    </v-select>


    <v-toolbar-items>
    <v-btn
      class="btn"
      :icon="consoleStore.connected ? 'mdi-close-octagon' : 'mdi-power-plug'"
      :title="consoleStore.connected ? 'disconnect' : 'connect'"
      :disabled="consoleStore.connecting || consoleStore.disconnecting || !(consoleStore.portIndex > 0)"
      @click="$emit('connect')"
    />

    <v-menu :close-on-content-click="false">
      <template #activator="{ isActive, props }">
        <v-btn
          v-bind="props"
          :disabled="consoleStore.connecting || consoleStore.disconnecting"
          icon="mdi-wrench"
          :append-icon="isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        />
      </template>
      <template #default>
        <v-card>
          <v-card-text>
            <v-select
              persistent-hint
              density="compact"
              label="Data Bits"
              hint="The number of data bits in each character."
              :disabled="disableInputs"
              v-model="consoleStore.dataBits"
              :items="dataBitsItems"
            />
            <v-select
              persistent-hint
              density="compact"
              label="Parity"
              hint="The method of error detection to use."
              :disabled="disableInputs"
              v-model="consoleStore.parity"
              :items="parityItems"
            />
            <v-select
              persistent-hint
              density="compact"
              label="Stop Bits"
              hint="The number of stop bits at the end of each frame."
              :disabled="disableInputs"
              v-model="consoleStore.stopBits"
              :items="stopBitsItems"
            />
            <v-checkbox
              persistent-hint
              density="compact"
              label="Echo"
              hint="Enable local echo"
              :disabled="disableInputs"
              v-model="consoleStore.localEcho"
            />
            <v-checkbox
              persistent-hint
              density="compact"
              label="Flow Control"
              hint="Enable hardware-based flow control"
              :disabled="disableInputs"
              v-model="consoleStore.flowControl"
            />
            <v-checkbox
              persistent-hint
              density="compact"
              label="Flush on enter"
              hint="Flush the buffer on enter instead of every key-press"
              :disabled="disableInputs"
              v-model="consoleStore.flushOnEnter"
            />
          </v-card-text>
        </v-card>
      </template>
    </v-menu>
    <v-divider vertical inset/>

    <v-btn
      icon="mdi-close-box"
      title="clear"
      :disabled="consoleStore.connecting || consoleStore.disconnecting"
      @click="$emit('clear')"
    />
  </v-toolbar-items>

    <v-spacer />
<v-toolbar-items>
    <v-btn
      title="download contents of terminal"
      icon="mdi-download"
      @click="$emit('download')"
      :disabled="consoleStore.connecting || consoleStore.disconnecting"
    />

    <colour-scheme-toggle />

    <v-btn
      v-if="fullscreenEnabled"
      title="fullscreen"
      :icon="fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
      @click="toggleFullscreen"
    />

    <SettingsModal @close="$emit('change')" />
  </v-toolbar-items>
  </v-app-bar>
</template>
<script setup lang="ts">
import { watch, onMounted, computed } from "vue";

import ColourSchemeToggle from "./ColourSchemeToggle.vue";
import SettingsModal from "./SettingsModal.vue";
import { useConsoleStore } from '@/stores/console';

defineEmits<{
  (event: "connect"): void;
  (event: "clear"): void;
  (event: "download"): void;
  (event: "request-port"): void;
  (event: "change"): void;
  (event: "fullscreen"): void;
}>();

const consoleStore = useConsoleStore()

const disableInputs = computed(
  () => consoleStore.connecting || consoleStore.connected || consoleStore.disconnecting
);
const fullscreen = computed(() => document.fullscreenElement !== null);
const fullscreenEnabled = computed(() => document.fullscreenEnabled);

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

const serialPortsItems = computed(() => consoleStore.ports.map((port, index) => ({ value: index, title: port[1].label ?? `Unlabeled Port ${index}`})))

watch(() => consoleStore.ports, (ports) => {
  if (!(ports.length > 0)) {
    // no ports available, force value
    consoleStore.portIndex = null;
  }
});

onMounted(async () => {
  await consoleStore.updatePorts()
});

async function toggleFullscreen() {
  if (fullscreen.value) {
    await document.exitFullscreen()
    return
  }
	try {
		await document.documentElement.requestFullscreen();
	} catch (error) {
		//log.warn('fullscreen rejected', error);
	}
}
</script>
