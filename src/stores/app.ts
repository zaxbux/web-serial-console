// Utilities
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: useLocalStorage('theme', 'dark'),
    showWelcome: useLocalStorage('welcome', true),
  }),
})
