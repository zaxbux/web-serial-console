<template>
	<input type="checkbox" @change="onInput">
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Settings from '../settings';

export default defineComponent({
	methods: {
		onInput($event: Event) {
			Settings.flushOnEnter = ($event.target as HTMLInputElement).checked;
		},
	},
	mounted() {
		this.$el.checked = Settings.flushOnEnter;
	},
})
</script>