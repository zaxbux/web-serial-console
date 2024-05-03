<template>
	<Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="commitWelcome()" :open="isOpen">
		<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
			<DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

			<!-- This element is to trick the browser into centering the modal contents. -->
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
			<div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
				<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
							<font-awesome-icon :icon="['far', 'plug']" fixed-width class="text-green-600" aria-hidden="true" />
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">Welcome!</DialogTitle>
							<div class="mt-2">
								<p class="text-sm text-gray-700">To get started, click the "Request Port" button.</p>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
					
					<button @click="requestPort">Request Port&nbsp;<font-awesome-icon :icon="['far', 'arrow-right']" fixed-width class="my-auto" /></button>
					
					<button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="commitWelcome()" ref="cancelButtonRef">
						Close
					</button>
					
					
				</div>
			</div>
		</div>
	</Dialog>
</template>
<script setup lang="ts">
import { ref, defineComponent } from "vue";
import {
	Dialog,
	DialogOverlay,
	DialogTitle,
} from "@headlessui/vue";
import SerialManager from '../serial-port-manager';
import {Settings} from '../settings';

const isOpen = ref(true)


async function requestPort() {
	try {
		await SerialManager.requestPort();
	} catch (error) {
		//
	}
}

function commitWelcome() {
	isOpen.value = false;

	Settings.showWelcome = false;
}
</script>