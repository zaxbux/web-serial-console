<template>
	<button class="btn" title="toggle colour scheme" @click="toggleColourScheme">
		<font-awesome-icon v-if="darkMode" :icon="['far', 'lightbulb-slash']" fixed-width />
		<font-awesome-icon v-else :icon="['far', 'lightbulb-on']" fixed-width />
	</button>
</template>
<script setup lang="ts">
import { computed } from 'vue'

let darkMode = document.documentElement.classList.contains('dark')
const icon = computed(() => (['far', darkMode ? 'star-and-crescent' : 'sun']))

function toggleColourScheme() {
	darkMode = !darkMode;

	window.localStorage.setItem('theme', darkMode ? 'dark' : 'light');

	document.documentElement.classList.toggle('dark', darkMode);
}
</script>
