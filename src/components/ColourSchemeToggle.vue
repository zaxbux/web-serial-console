<template>
  <v-btn title="toggle colour scheme" :icon="theme.global.current.value.dark ? 'mdi-brightness-4' : 'mdi-brightness-6'" @click="toggle"/>
</template>
<script setup lang="ts">
import { useTheme } from 'vuetify';

const theme = useTheme()

function toggle() {
	theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
