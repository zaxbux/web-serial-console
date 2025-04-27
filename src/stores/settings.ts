// Utilities
import { defineStore } from 'pinia'
import SerialManager, { type SerialPortMap } from "@/utils/serial-port-manager";
import { useConsoleStore } from './console';
import { StorageSerializers, useLocalStorage, useSessionStorage } from '@vueuse/core'

export type CursorStyle = 'block' | 'underline' | 'bar';
export type BellStyle = 'none' | 'visual' | 'sound' | 'both';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    ports: [],
    portIndex: useSessionStorage<null | number>('portIndex',  null, { serializer: StorageSerializers.number }),
    baudRate: useLocalStorage('baudRate', 115200, { serializer: StorageSerializers.number }),
    dataBits: useLocalStorage<7 | 8>('dataBits', 8, { serializer: StorageSerializers.number }),
    parity: useLocalStorage<ParityType>('parity', 'none'),
    stopBits: useLocalStorage<1 | 2>('stopBits', 1, { serializer: StorageSerializers.number }),
    flowControl: useLocalStorage<FlowControlType>('flowControl', 'none'),

    localEcho: useLocalStorage('localEcho', false, { serializer: StorageSerializers.boolean }),
    flushOnEnter: useLocalStorage('flushOnEnter', false, { serializer: StorageSerializers.boolean }),

    cursorStyle: useLocalStorage<CursorStyle>('cursorStyle', 'bar'),
    cursorBlink: useLocalStorage('cursorBlink', true, { serializer: StorageSerializers.boolean }),
    bell: useLocalStorage('bell', true, { serializer: StorageSerializers.boolean }),
    bellStyle: useLocalStorage<BellStyle>('bellStyle', 'visual'),
    fontFamily: useLocalStorage('fontFamily', 'Source Code Pro'),
    scrollback: useLocalStorage('scrollback', 10_000, { serializer: StorageSerializers.number }),
    theme: useLocalStorage('consoleTheme', 'default'),
    themes: useLocalStorage('consoleThemes', {
      default: {
        background:    '#000000',
        foreground:    '#ffffff',
        selectionForeground:     '#000000',
        selectionBackground:     '#ffffff',
        //selectionInactiveBackground: '',
        cursor:        '#ffffff',
        cursorAccent:  '#000000',
        black:         '#2e3436',
        brightBlack:   '#555753',
        red:           '#cc0000',
        brightRed:     '#ef2929',
        green:         '#4e9a06',
        brightGreen:   '#8ae234',
        yellow:        '#c4a000',
        brightYellow:  '#fce94f',
        blue:          '#3465a4',
        brightBlue:    '#729fcf',
        magenta:       '#75507b',
        brightMagenta: '#ad7fa8',
        cyan:          '#06989a',
        brightCyan:    '#34e2e2',
        white:         '#d3d7cf',
        brightWhite:   '#eeeeec',
      },
      light: {
        background:    '#ffffff',
        foreground:    '#000000',
        selectionForeground:     '#ffffff',
        selectionBackground:     '#000000',
        //selectionInactiveBackground: '',
        cursor:        '#ffffff',
        cursorAccent:  '#000000',
        black:         '#2e3436',
        brightBlack:   '#555753',
        red:           '#cc0000',
        brightRed:     '#ef2929',
        green:         '#4e9a06',
        brightGreen:   '#8ae234',
        yellow:        '#c4a000',
        brightYellow:  '#fce94f',
        blue:          '#3465a4',
        brightBlue:    '#729fcf',
        magenta:       '#75507b',
        brightMagenta: '#ad7fa8',
        cyan:          '#06989a',
        brightCyan:    '#34e2e2',
        white:         '#d3d7cf',
        brightWhite:   '#eeeeec',
      }
    }),
  }),
  actions: {
    getTheme() {
      const theme = this.themes[this.theme];

      return { ...theme }
    },
    async requestPort() {
      const state = useConsoleStore()

      try {
        const port = await SerialManager.requestPort();

        if (SerialManager.ports.size === 1) {
          this.portIndex = 0;
        }

        return port;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'NotFoundError') {
          state.messages.push('Error: No port selected by the user.');
        } else if (error instanceof Error) {
          state.messages.push(error.message);
        } else {
          state.messages.push('requestPort() unknown error');
        }
      }
    },
    async updatePorts() {
      SerialManager.on("update", (data: { ports: SerialPortMap }) => {
        console.log("update ports");

        this.ports = Array.from(data.ports);
      });

      await SerialManager.getPorts();
    },
  },
})
