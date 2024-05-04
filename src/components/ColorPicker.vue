<template>
	<v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn size="small" :color="value" v-bind="props"><v-icon icon="mdi-eyedropper"/></v-btn>
    </template>
    <template #default>
      <v-color-picker v-model="value" v-bind="$attrs"/>
    </template>
  </v-menu>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string
}>()
const $emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (value) => $emit('update:modelValue', value),
})
</script>
