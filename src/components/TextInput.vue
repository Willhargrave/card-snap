<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  submit: [text: string]
}>()

const inputText = ref('')

function handleSubmit() {
  if (!inputText.value.trim()) return
  emit('submit', inputText.value)
}
</script>

<template>
  <div>
    <textarea
      v-model="inputText"
      placeholder="Paste your Japanese text here..."
      rows="6"
    />
    <button @click="handleSubmit">Analyse Text</button>
  </div>
</template>

<style scoped></style>
