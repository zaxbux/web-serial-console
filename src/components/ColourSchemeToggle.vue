<template>
  <v-btn
    v-tooltip:bottom="'Toggle colour scheme'"
    :icon="theme.global.current.value.dark ? 'mdi-brightness-4' : 'mdi-brightness-6'"
    @click="toggle"
  />
</template>
<script setup lang="ts">
import { useTheme } from 'vuetify';
import { useSettingsStore } from '@/stores/settings';

const theme = useTheme()
const settings = useSettingsStore()

function toggle() {
	theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  settings.theme = theme.global.current.value.dark ? 'default' : 'light'
}
</script>
