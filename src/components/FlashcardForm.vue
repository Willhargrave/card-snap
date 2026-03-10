<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTranslation } from './useTranslation';
import { useAnki } from './useAnki';
const props = defineProps<{
  targetWord: string
  sentence: string
}>()

const front = ref(props.targetWord)
const back = ref(props.sentence)
const {translation, loading, translate} = useTranslation()
const {addNote} = useAnki()
const exporting = ref(false)
const success = ref(false)
const error = ref('')



onMounted(() => {
  translate(props.sentence)
})

async function handleExport() {
  exporting.value = true
  error.value = ''
  success.value = false
  try {
    await addNote(front.value, back.value, translation.value)
    success.value = true
  } catch (e) {
    error.value = 'Failed to export, make sure Anki is open with AnkiConnect installed'
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div>
    <h2>Flashcard Preview</h2>
    <div>
      <label>Front (Target Word)</label>
      <input v-model="front" type="text" />
    </div>

    <div>
      <label>Back (sentence)</label>
      <textarea v-model="back" rows="3" />
    </div>

   <div>
      <label>Translation</label>
      <textarea
        v-model="translation"
        rows="3"
        :placeholder="loading ? 'Translating...' : 'Translation'"
        :disabled="loading"
      />
    </div>



    <p v-if="success" style="color: green">Card added to Anki!</p>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <button @click="handleExport" :disabled="exporting || loading">
      {{ exporting ? 'Exporting....' : 'Export to Anki' }}
    </button>
  </div>


</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
label {
  font-weight: bold;
}
input, textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
textarea:disabled {
  background-color: #f5f5f5;
  color: #999;
}
button {
  padding: 10px 20px;
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button:hover {
  background-color: #f0c800;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

