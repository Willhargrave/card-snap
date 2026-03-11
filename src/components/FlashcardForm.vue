<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTranslation } from './useTranslation';
import { useAnki } from './useAnki';
import { useJisho } from './useJisho';

const props = defineProps<{
  targetWord: string
  sentence: string
}>()

const front = ref(props.targetWord)
const back = ref(props.sentence)
const {translation, loading: translationLoading, translate} = useTranslation()
const {reading, meaning, loading: jishoLoading, lookupWord} = useJisho()
const {addNote} = useAnki()
const exporting = ref(false)
const success = ref(false)
const error = ref('')



onMounted(() => {
  translate(props.sentence)
  lookupWord(props.targetWord)
})

async function handleExport() {
  exporting.value = true
  error.value = ''
  success.value = false
  try {
    await addNote(front.value, reading.value, meaning.value, back.value, translation.value)
    success.value = true
  } catch (e) {
    error.value = 'Failed to export. Make sure Anki is open with AnkiConnect installed.'
  } finally {
    exporting.value = false
  }
}

</script>

<template>
  <div>
    <h2>Flashcard Preview</h2>
    <div>
      <label>Target Word</label>
      <input v-model="front" type="text" />
    </div>
  <div>
      <label>Reading</label>
      <input
        v-model="reading"
        type="text"
        :placeholder="jishoLoading ? 'Loading...' : 'Reading'"
        :disabled="jishoLoading"
      />
  </div>

  <div>
      <label>Meaning</label>
      <input
      v-model="meaning"
      type="text"
      :placeholder="jishoLoading ? 'Loading...' : 'Meaning'"
      :disabled="jishoLoading"
    />
  </div>


    <div>
      <label>Sentence</label>
      <textarea v-model="back" rows="3" />
    </div>

   <div>
      <label>Translation</label>
      <textarea
        v-model="translation"
        rows="3"
        :placeholder="translationLoading ? 'Translating...' : 'Translation'"
        :disabled="translationLoading"
      />
    </div>



    <p v-if="success" style="color: green">Card added to Anki!</p>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <button @click="handleExport" :disabled="exporting || translationLoading || jishoLoading">
      {{ exporting ? 'Exporting...' : 'Export to Anki' }}
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

