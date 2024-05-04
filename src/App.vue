<template>
      <router-view />
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { onMounted, watch } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme()
const appState = useAppStore()

watch(theme.global.name, (theme) => {
  appState.theme = theme
})

onMounted(() => {
  theme.global.name.value = appState.theme
})
</script>
