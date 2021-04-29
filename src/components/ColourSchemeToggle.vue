<template>
	<button class="btn" title="toggle colour scheme" @click="toggleColourScheme()">
		<font-awesome-icon v-if="darkMode" :icon="['far', 'lightbulb-slash']" fixed-width />
		<font-awesome-icon v-else :icon="['far', 'lightbulb-on']" fixed-width />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	data() {
		return {
			darkMode: document.documentElement.classList.contains('dark'),
		};
	},
	computed: {
		icon() {
			return ['far', this.darkMode ? 'star-and-crescent' : 'sun'];
		}
	},
	methods: {
		toggleColourScheme() {
			this.$data.darkMode = !this.$data.darkMode;

			window.localStorage.setItem('theme', this.$data.darkMode ? 'dark' : 'light');

			document.documentElement.classList.toggle('dark', this.$data.darkMode);
		}
	},
})
</script>
