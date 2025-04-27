<template>
  <Toolbar
    @click:connect="() => toggleConsole(state.connected)"
    @click:clear="resetTerminal"
    @click:download="downloadContents"
  />
  <v-main height="calc(100dvh - var(--v-layout-top))" max-height="100%">
    <div ref="xterm" class="xterm-container xterm-full" />
  </v-main>
  <v-divider/>
  <v-footer class="gc-3">
    <v-icon
      :icon="state.connected ? 'mdi-play-circle' : 'mdi-stop-circle'"
      size="small"
      :color="state.connected ? 'green' : 'red'"
    />
    <v-divider vertical />
    <span>{{ statusText }}</span>
    <v-spacer />
    <span>{{ state.lines }} lines</span>
  </v-footer>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import "@xterm/xterm/css/xterm.css";
import "source-code-pro/source-code-pro.css";
import Toolbar from "./Toolbar.vue";

import Log from "@/utils/log";
import SerialManager, {
  getPortMetadata,
  SerialPortMetadata,
} from "@/utils/serial-port-manager";
import { SerialPortConsole } from "@/utils/serial-port-console";
import { TerminalPlatform } from "@/utils/xterm-extended";
import { fauxLink } from "@/utils/fauxLink";
import { useConsoleStore } from "@/stores/console";
import { useSettingsStore } from "@/stores/settings";
import { serializeBufferAsPlain } from '@/utils/serialize';


const state = useConsoleStore();
const settings = useSettingsStore();

const log = new Log("console");

const xterm = ref<HTMLDivElement>();
const platform = new TerminalPlatform({
  cursorStyle: settings.cursorStyle,
  bellSound: settings.bellSound,
  //bellStyle: settings.bellStyle,
  fontFamily: settings.fontFamily,
  scrollback: settings.scrollback,
  theme: settings.getTheme(),
  allowProposedApi: true,
});

const statusText = computed(() => state.messages.slice(-1).pop());

const serialConsole = new SerialPortConsole(platform.terminal, {
  onConnecting: (options) => {
    log.info("connecting", options);
    state.connecting = true;

    platform.terminal.reset();
  },
  onConnected: (port) => {
    log.info("connected");
    state.connecting = false;
    state.connected = true;

    state.messages.push(`connected to ${getPortMetadata(port).label}`);
  },
  onDisconnecting: (data) => {
    log.info("disconnecting", data);
    state.disconnecting = true;
  },
  onDisconnected: (data) => {
    log.info("disconnected", data);
    state.disconnecting = false;
    state.connected = false;

    state.messages.push(`disconnected`);
  },
  onConnectError: (error) => {
    log.error("connect error", error);
  },
  onDisconnectError: (error) => {
    log.error("disconnect error", error);
  },
});

const onSettingsChange = useDebounceFn((mutation, state) => {
  platform.terminal.options.theme = settings.getTheme();
  platform.terminal.options.cursorStyle = state.cursorStyle;
  platform.terminal.options.bellStyle = state.bellStyle;
  platform.terminal.options.cursorBlink = state.cursorBlink;

  serialConsole.echo = settings.localEcho;
  serialConsole.flushOnEnter = settings.flushOnEnter;

  if (state.ports.length === 0) {
    // no ports available, force value
    state.portIndex = null;
  }
}, 500);

settings.$subscribe(onSettingsChange);

async function toggleConsole(connected: boolean): Promise<void> {
  const port = SerialManager.getPort(settings.portIndex);

  if (!port) {
    alert("please select a port");
    return;
  }

  if (connected) {
    serialConsole.disconnect();
  } else {
    //serialConsole.echo = settings.localEcho;
    //serialConsole.flushOnEnter = settings.flushOnEnter;

    serialConsole.connect(port, {
      baudRate: settings.baudRate,
      dataBits: settings.dataBits,
      parity: settings.parity,
      stopBits: settings.stopBits,
      flowControl: settings.flowControl,
    });
  }
}
function downloadContents(mode: 'raw' | 'text' | 'html'): void {
  if (mode === 'raw') {
    const content = platform.serializeAddon.serialize()
    fauxLink(content).click();
  } else if (mode === 'text') {
    const content = serializeBufferAsPlain(platform.terminal)
    fauxLink(content).click();
  } else if (mode === 'html') {
    const originalFont = platform.terminal.options.fontFamily
    platform.terminal.options.fontFamily = 'monospace'
    const content = platform.serializeAddon.serializeAsHTML()
    platform.terminal.options.fontFamily = originalFont;
    fauxLink(content, 'text/html').click();
  }
}
function resetTerminal(): void {
  platform.terminal.reset();
  state.lines = 0;
}

onMounted(async () => {
  await settings.updatePorts();

  SerialManager.on(
    "connect",
    (data: { port: SerialPort; metadata: SerialPortMetadata }) => {
      state.messages.push(`${data.metadata.label} connected`);
    }
  );

  SerialManager.on(
    "disconnect",
    (data: { port: SerialPort; metadata: SerialPortMetadata }) => {
      state.messages.push(`${data.metadata.label} disconnected`);
    }
  );

  platform.terminal.onTitleChange((title: string) => {
    document.title = `${title}`;
  });
  platform.terminal.onLineFeed(() => {
    state.lines++;
  });

  platform.terminal.open(xterm.value);
  nextTick(() => {
    setInterval(() => platform.fitAddon.fit(), 100);
  })

  platform.writeTestPattern();

  window.addEventListener("resize", () => {
    platform.fitAddon.fit();
  });

  log.info("terminal ready");
});

const fontFamily = computed(() => settings.fontFamily);
</script>

<style scoped lang="scss">
.xterm-container {
  font-family: v-bind(fontFamily);
  width: 100%;
  height: 100%;
}

.xterm-full:deep() {
  .terminal {
    height: 100%;
    display: flex;
    padding: 0.5rem;

    .xterm-viewport {
      //scrollbar-width: thin;          // "auto" or "thin"
      scrollbar-color: transparent; // scroll thumb and track

      &::-webkit-scrollbar {
        width: 1rem; // width of the entire scrollbar
      }

      &::-webkit-scrollbar-track {
        @apply transition-colors;
        background-color: rgba(0, 0, 0, 0.1); // color of the tracking area
        border-left: 1px solid rgba(255, 255, 255, 0.3);
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.5); // color of the scroll thumb
        //border-radius: 20px;       // roundness of the scroll thumb
        //border: 3px solid orange;  // creates padding around scroll thumb

        &:hover {
          background-color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .xterm-screen {
      //margin-top: auto;
    }
  }
}
</style>
