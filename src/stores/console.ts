// Utilities
import { defineStore } from 'pinia'

export const useConsoleStore = defineStore('console', {
  state: () => ({
    connected:false,
    connecting: false,
    disconnecting: false,

    lines: 0,
    messages: ['disconnected'],
  }),
})
