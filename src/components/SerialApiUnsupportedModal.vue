<template>
	<Dialog as="div" static class="modal" :open="true">
		<div class="modal-wrapper">
			<DialogOverlay class="overlay" />

			<!-- This element is to trick the browser into centering the modal contents. -->
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

			<div class="modal-contents">
				<div class="body">
					<div class="sm:flex sm:items-start">
						<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							
							<Icon :path="mdiAlert" class="text-red-600"/>
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<DialogTitle as="h3" class="title">Error!</DialogTitle>
							<div class="mt-2">
								<p class="text-sm text-gray-700 dark:text-gray-200">This browser does not support the Web Serial API.</p>
							</div>
						</div>
					</div>
				</div>
				<div class="footer">
					<a class="btn" href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serial#browser_compatibility" target="_blank" rel="noopener">
						Learn more&nbsp;<Icon :path="mdiArrowRight" class="my-auto"/>
					</a>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
	Dialog,
	DialogOverlay,
	DialogTitle,
} from "@headlessui/vue";
import { mdiAlert, mdiArrowRight } from '@mdi/js';

export default defineComponent({
	components: {
		Dialog,
		DialogOverlay,
		DialogTitle,
	},
	data: () => ({ mdiAlert, mdiArrowRight }),
});
</script>