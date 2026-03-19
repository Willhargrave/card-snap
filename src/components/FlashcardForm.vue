<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useTranslation } from '../composables/useTranslation'
import { useAnki } from '../composables/useAnki'
import { useJisho } from '../composables/useJisho'
import LoadingSpinner from './LoadingSpinner.vue'
import { useCardStore } from '@/stores/useCardStore'
import type { Ref }  from 'vue'


type FieldLocation = 'front' | 'back' | 'exclude'
type Field = {
  label: string
  value: Ref<string>
  location: FieldLocation
  isImage?: boolean
}

const props = defineProps<{
  targetWord: string
  sentence: string
  wordCount: number
  image?: File | null
}>()

const emit = defineEmits<{
  back: []
}>()


const front = ref(props.targetWord)
const back = ref(props.sentence)
const { translation, loading: translationLoading, translate } = useTranslation()
const {
  translation: wordTranslation,
  loading: wordTranslationLoading,
  translate: translateWord,
} = useTranslation()
const { reading, meaning, loading: jishoLoading, lookupWord, getPhraseReading } = useJisho()
const { addNote, getDecks } = useAnki()
const exporting = ref(false)
const success = ref(false)
const error = ref('')
const decks = ref<string[]>([])
const selectedDeck = ref('Default')
const newDeckName = ref('')
const showNewDeck = ref(false)
const activeDeck = computed(() => showNewDeck.value ? newDeckName.value : selectedDeck.value)
const cardStore = useCardStore()
const addedToQueue = ref(false)
const imageUrl = computed(() =>
  props.image ? URL.createObjectURL(props.image) : null
)
const isLocal = window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1'
const imageFields = props.image
  ? [{ label: 'Image', value: ref(''), location: 'back' as FieldLocation, isImage: true }]
  : []

const fields = ref<Field[]>(
  props.wordCount === 1
    ? [
        { label: 'Target Word', value: front, location: 'front' as FieldLocation },
        { label: 'Reading', value: reading, location: 'front' as FieldLocation },
        { label: 'Meaning', value: meaning, location: 'back' as FieldLocation },
        { label: 'Sentence', value: back, location: 'back' as FieldLocation },
        { label: 'Translation', value: translation, location: 'back' as FieldLocation },
        ...imageFields,
      ]
    : [
        { label: 'Target Word', value: front, location: 'front' as FieldLocation },
        { label: 'Reading', value: reading, location: 'front' as FieldLocation },
        { label: 'Meaning', value: wordTranslation, location: 'back' as FieldLocation },
        { label: 'Sentence', value: back, location: 'back' as FieldLocation },
        { label: 'Translation', value: translation, location: 'back' as FieldLocation },
        ...imageFields,
      ]
)

onMounted(async () => {
  translate(props.sentence)
  if (props.wordCount === 1) {
    lookupWord(props.targetWord)
  } else {
    translateWord(props.targetWord)
    reading.value = await getPhraseReading(props.targetWord)
  }
  try {
    decks.value = await getDecks()
  } catch {
    decks.value = ['Default']
  }
})


onUnmounted(() => {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})

async function handleCSVExport() {
  const front = await buildSideWithImage('front')
  const back = await buildSideWithImage('back')
  cardStore.addCard(front, back)
  addedToQueue.value = true
}

async function buildSideWithImage(location: FieldLocation): Promise<string> {
  const parts = await Promise.all(
    fields.value
      .filter((f) => f.location === location)
      .map(async (f) => {
        if (f.isImage && props.image) {
          const base64 = await fileToBase64(props.image)
          return `<img src="${base64}" />`
        }
        return f.value
      })
  )
  return parts.join('<br><br>')
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handleExport() {
  exporting.value = true
  error.value = ''
  success.value = false
  try {
    const front = await buildSideWithImage('front')
    const back = await buildSideWithImage('back')
    await addNote(front, back, activeDeck.value)
    success.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div v-if="translationLoading || jishoLoading || wordTranslationLoading">
    <LoadingSpinner />
  </div>

  <div v-else class="form-wrapper">
    <h2>Flashcard Preview</h2>

<div v-for="field in fields" :key="field.label" class="field">
  <label>{{ field.label }}</label>
  <div v-if="field.isImage && imageUrl" class="image-preview">
    <img :src="imageUrl" alt="Uploaded image" />
  </div>
  <textarea v-else v-model="field.value" rows="2" />
  <div class="toggle-group">
    <button
      v-for="option in ['front', 'back', 'exclude']"
      :key="option"
      :class="{ active: field.location === option }"
      @click="field.location = option as FieldLocation"
    >
      {{ option }}
    </button>
  </div>
</div>

    <p v-if="success" style="color: green">Card added to Anki successfully!</p>
    <div v-if="error">
      <p style="color: red">Failed to export. Make sure Anki is open with AnkiConnect installed.</p>
      <p style="color: red; font-size: 0.85rem;">{{ error }}</p>
    </div>

<button class="back-btn" @click="emit('back')">← Back</button>
<div v-if="isLocal">
  <label>Deck</label>
  <div class="deck-row">
    <select v-if="!showNewDeck" v-model="selectedDeck">
      <option v-for="deck in decks" :key="deck" :value="deck">{{ deck }}</option>
    </select>
    <input
      v-else
      v-model="newDeckName"
      type="text"
      placeholder="New deck name..."
    />
    <button class="new-deck-btn" @click="showNewDeck = !showNewDeck">
      {{ showNewDeck ? 'Use existing' : '+ New deck' }}
    </button>
  </div>

  <div class="export-buttons">
    <button
      class="export-btn"
      @click="handleExport"
      :disabled="exporting || translationLoading || jishoLoading"
    >
      {{ exporting ? 'Exporting...' : 'Export to Anki' }}
    </button>
  </div>
</div>

<button
  class="csv-btn"
  @click="handleCSVExport"
  :disabled="translationLoading || jishoLoading"
>
  {{ addedToQueue ? '✓ Added to CSV queue' : 'Add to CSV' }}
</button>
</div>

</template>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
label {
  font-weight: bold;
}
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}
textarea:disabled {
  background-color: #f5f5f5;
  color: #999;
}
.toggle-group {
  display: flex;
  gap: 8px;
}
.toggle-group button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  text-transform: capitalize;
  font-size: 0.85rem;
}
.toggle-group button.active {
  background-color: #ffd700;
  border-color: #ffd700;
  font-weight: bold;
}
.toggle-group button:hover:not(.active) {
  border-color: #999;
}
.export-btn {
  padding: 10px 20px;
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.export-btn:hover {
  background-color: #f0c800;
}
.export-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.back-btn {
  padding: 10px 20px;
  background: rgb(242, 240, 240);
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.back-btn:hover {
  border-color: #999;
}

.deck-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.deck-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.new-deck-btn {
  padding: 8px 12px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
}
.new-deck-btn:hover {
  border-color: #999;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  border: 1px solid #ccc;
  object-fit: contain;
}

.export-buttons {
  display: flex;
  gap: 12px;
}
.csv-btn {
  padding: 10px 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.csv-btn:hover {
  border-color: #999;
}
.csv-btn:disabled {
  color: #999;
  cursor: not-allowed;
}

</style>
