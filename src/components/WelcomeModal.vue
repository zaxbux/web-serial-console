<template>
	<Dialog as="div" class="modal" @close="commitWelcome()" :open="isOpen">
		<div class="modal-wrapper">
			<DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

			<!-- This element is to trick the browser into centering the modal contents. -->
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

			<div class="modal-contents">
				<div class="body">
					<div class="sm:flex sm:items-start">
						<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
							<font-awesome-icon :icon="['far', 'plug']" fixed-width class="text-green-600" aria-hidden="true" />
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<DialogTitle as="h3" class="title">Welcome!</DialogTitle>
							<div class="mt-2">
								<p class="text-sm text-gray-700 dark:text-gray-200">To get started, click the "Request Port" button.</p>
							</div>
						</div>
					</div>
				</div>
				<div class="footer">
					<button @click="requestPort" class="btn sm:ml-3">Request Port&nbsp;<font-awesome-icon :icon="['far', 'arrow-right']" fixed-width class="my-auto" /></button>
					<button type="button" class="btn" @click="commitWelcome()" ref="cancelButtonRef">Close</button>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import {
	Dialog,
	DialogOverlay,
	DialogTitle,
} from "@headlessui/vue";
import SerialManager from '../serial-port-manager';

export default defineComponent({
	components: {
		Dialog,
		DialogOverlay,
		DialogTitle,
	},
	methods: {
		async requestPort() {
			try {
				await SerialManager.requestPort();

				this.commitWelcome();
			} catch (error) {
				//
			}
		},
		commitWelcome() {
			this.isOpen = false;

			this.$settings.showWelcome = false;
		}
	},
	setup() {
		const isOpen = ref(true)

		return {
			isOpen,
		}
	},
});
</script>