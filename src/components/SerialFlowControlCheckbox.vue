<template>
	<input type="checkbox" @change="onInput">
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Settings from '../settings';

export default defineComponent({
	methods: {
		onInput($event: Event) {
			Settings.flowControl = !$event.target.checked ? 'none' : 'hardware';
		},
	},
	mounted() {
		this.$el.checked = Settings.flowControl === 'hardware';
	},
})
</script>