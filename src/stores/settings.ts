// Utilities
import { defineStore } from 'pinia'
import defaultBellSound from '@/utils/default-bell-sound';
import SerialManager, { type SerialPortMap } from "@/utils/serial-port-manager";
import { useConsoleStore } from './console';
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

export type CursorStyle = 'block' | 'underline' | 'bar';
export type BellStyle = 'none' | 'visual' | 'sound' | 'both';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    ports: [],
    portIndex: useSessionStorage<null | number>('portIndex',  null),
    baudRate: useLocalStorage('baudRate', 115200),
    dataBits: useLocalStorage<7 | 8>('dataBits', 8),
    parity: useLocalStorage<ParityType>('parity', 'none'),
    stopBits: useLocalStorage<1 | 2>('stopBits', 1),
    flowControl: useLocalStorage<FlowControlType>('flowControl', 'none'),

    localEcho: useLocalStorage('localEcho', false),
    flushOnEnter: useLocalStorage('flushOnEnter', false),

    cursorStyle: useLocalStorage<CursorStyle>('cursorStyle', 'bar'),
    cursorBlink: useLocalStorage('cursorBlink', true),
    bellSound: defaultBellSound,
    bell: useLocalStorage('bell', false),
    bellStyle: useLocalStorage<BellStyle>('bellStyle', 'none'),
    fontFamily: useLocalStorage('fontFamily', 'Source Code Pro'),
    scrollback: useLocalStorage('scrollback', 10_000),
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
        await SerialManager.requestPort();
      } catch (error) {
        state.messages.push(error.message);
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
