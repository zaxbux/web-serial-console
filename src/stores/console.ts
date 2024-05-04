// Utilities
import { defineStore } from 'pinia'
import defaultBellSound from '@/utils/default-bell-sound';
import SerialManager, { type SerialPortMap } from "@/utils/serial-port-manager";

export type CursorStyle = 'block' | 'underline' | 'bar';
export type BellStyle = 'none' | 'visual' | 'sound' | 'both';

export const useConsoleStore = defineStore('console', {
  state: () => ({
    connected:false,
    connecting: false,
    disconnecting: false,

    lines: 0,

    ports: [],
    portIndex: null as null | number,
    baudRate: 115200,
    dataBits: 8 as 7 | 8,
    parity: 'none' as ParityType,
    stopBits: 1 as 1 | 2,
    flowControl: 'none' as FlowControlType,

    localEcho: false,
    flushOnEnter: false,

    cursorStyle: 'bar' as CursorStyle,
    cursorBlink: true,
    bellSound: defaultBellSound,
    bell: false,
    bellStyle: 'none' as BellStyle,
    fontFamily: 'Source Code Pro',
    scrollback: 10_000,
    theme: 'default',
    themes: {
      default: {
        background:    '#000000',
        foreground:    '#ffffff',
        selection:     '#ffffff',
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
    },
  }),
  actions: {
    reset() {},
    async updatePorts() {
      SerialManager.on("update", (data: { ports: SerialPortMap }) => {
        console.log("update ports");

        this.ports = Array.from(data.ports);
      });

      await SerialManager.getPorts();
    },
  },
})
