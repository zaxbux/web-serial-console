<template>
  <v-dialog v-model="modal" >
    <v-card title="Welcome!">
      <v-card-text>
        To get started, click the "Request Port" button.
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn text="Close" @click="() => modal = false"/>
        <v-btn text="Request Port" append-icon="mdi-arrow-right" @click="requestPort"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import SerialManager from '@/utils/serial-port-manager';
import { useAppStore } from '@/stores/app';

const appState = useAppStore()

const modal = ref(true)

async function requestPort() {
	try {
		await SerialManager.requestPort();
	} catch (error) {
		//
	}
}

watch(modal, (modal) => {
  if (!modal) {
    appState.showWelcome = false;
  }
})
</script>
