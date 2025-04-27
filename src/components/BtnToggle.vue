<script setup lang="ts">
const modelValue = defineModel()

defineProps<{
  label?: string
  hint?: string
  items: { value: any, title: string }[]
}>()
</script>
<template>
	<div>
    <div v-if="label" class="text-subtitle-2">{{ label }}</div>
    <v-btn-toggle v-model="modelValue" mandatory divided density="compact" variant="outlined">
      <v-btn v-for="item, key in items" :key="key" :value="item.value" :text="item.title" size="small" slim/>
    </v-btn-toggle>
    <div v-if="hint" class="text-caption text-medium-emphasis">{{ hint }}</div>
  </div>
</template>
