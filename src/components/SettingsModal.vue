<template>
	<button class="btn" title="settings" type="button" @click="openModal"><font-awesome-icon :icon="['far', 'cog']" fixed-width /></button>

	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" static class="modal" :open="isOpen" @close="closeModal">
			<div class="modal-wrapper">
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100"
					leave-to="opacity-0"
				><DialogOverlay class="overlay" /></TransitionChild>

				<!-- This element is to trick the browser into centering the modal contents. -->
				<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0 scale-95"
					enter-to="opacity-100 scale-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-95"
				>
				<div class="modal-contents">
					<div class="body">
							<div class="mt-3 text-center sm:mt-0 sm:text-left">
								<DialogTitle as="h3" class="title">Settings</DialogTitle>
								<div class="mt-2 space-y-4">
									<div class="flex gap-4">
										<div class="form-group w-full">
											<label for="terminal-cursor-style">cursor style</label>
											<div class="flex gap-2 items-center">
												<select id="terminal-cursor-style" class="form-control w-full" v-model="$settings.cursorStyle">
													<option value="block">block</option>
													<option value="underline">underline</option>
													<option value="bar">bar</option>
												</select>
												<label for="terminal-cursor-blink" class="flex-none"><input type="checkbox" id="terminal-cursor-blink" class="form-control" v-model="$settings.cursorBlink"> blink</label>
											</div>
										</div>
									</div>

									<div class="form-group">
										<label for="terminal-scrollback" class="block">scrollback</label>
										<input type="number" id="terminal-scrollback" class="form-control w-full" min="0" max="10000" v-model="$settings.scrollback">
									</div>

									<div class="form-group">
										<label for="terminal-bell-style" class="block">bell</label>
										<input type="file" id="" accept="audio/*">
										<input type="checkbox" id="terminal-bell-style" class="form-control" v-model="$settings.bell">
									</div>

									<div class="form-group">
										<label for="terminal-cursor-style" class="block">font</label>
										<select id="terminal-cursor-style" class="form-control w-full" v-model="$settings.fontFamily">
											<option value="Source Code Pro" class="font-mono">Source Code Pro</option>
										</select>
									</div>

									theme
									
									<TerminalThemePicker />

								</div>
						</div>
					</div>
					<div class="footer">
						<button class="btn" @click="closeModal">Close</button>
						<button class="btn sm:mr-auto" @click="resetSettings">Reset</button>
					</div>
				</div>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogOverlay,
	DialogTitle,
} from "@headlessui/vue";
import TerminalThemePicker from './TerminalThemePicker.vue';
import Settings from '../settings';

export default defineComponent({
	components: {
		TransitionRoot,
		TransitionChild,
		Dialog,
		DialogOverlay,
		DialogTitle,
		TerminalThemePicker,
	},
	emits: ['close'],
	methods: {
		closeModal() {
			this.isOpen = false;

			this.$emit('close');
		},
		openModal() {
			this.isOpen = true;
		},
		resetSettings() {
			if (confirm('Are you sure you want to reset all settings?')) {
				Settings.reset();
			}
		}
	},
	setup() {
		const isOpen = ref(false);

		return {
			isOpen,
		};
	},
});
</script>

