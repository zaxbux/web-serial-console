<template>
	<button class="btn" title="toggle colour scheme" @click="toggleColourScheme()">
		
		
		<Icon :path="darkMode ? mdiBrightness6 : mdiBrightness4"/>
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mdiBrightness4, mdiBrightness6 } from '@mdi/js';

export default defineComponent({
	data() {
		return {
			mdiBrightness4,
			mdiBrightness6,
			darkMode: document.documentElement.classList.contains('dark'),
		};
	},
	computed: {
		icon(): string[] {
			return ['far', this.$data.darkMode ? 'star-and-crescent' : 'sun'];
		}
	},
	methods: {
		toggleColourScheme() {
			this.$data.darkMode = !this.$data.darkMode;

			window.localStorage.setItem('theme', (this as any).$data.darkMode ? 'dark' : 'light');

			document.documentElement.classList.toggle('dark', this.$data.darkMode);
		}
	},
})
</script>
