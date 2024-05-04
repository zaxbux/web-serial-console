<template>
  <v-btn title="toggle colour scheme" :icon="darkMode ? 'mdi-brightness-4' : 'mdi-brightness-6'" @click="toggleColourScheme"/>
</template>
<script setup lang="ts">
let darkMode = document.documentElement.classList.contains('dark')

function toggleColourScheme() {
	darkMode = !darkMode;

	window.localStorage.setItem('theme', darkMode ? 'dark' : 'light');

	document.documentElement.classList.toggle('dark', darkMode);
}
</script>
