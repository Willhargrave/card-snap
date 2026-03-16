<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTranslation } from '../composables/useTranslation'
import { useAnki } from '../composables/useAnki'
import { useJisho } from '../composables/useJisho'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps<{
  targetWord: string
  sentence: string
  wordCount: number
}>()

const emit = defineEmits<{
  back: []
}>()

type FieldLocation = 'front' | 'back' | 'exclude'

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

const fields = ref(
  props.wordCount === 1
    ? [
        { label: 'Target Word', value: front, location: 'front' as FieldLocation },
        { label: 'Reading', value: reading, location: 'front' as FieldLocation },
        { label: 'Meaning', value: meaning, location: 'back' as FieldLocation },
        { label: 'Sentence', value: back, location: 'back' as FieldLocation },
        { label: 'Translation', value: translation, location: 'back' as FieldLocation },
      ]
    : [
        { label: 'Target Word', value: front, location: 'front' as FieldLocation },
        { label: 'Reading', value: reading, location: 'front' as FieldLocation },
        { label: 'Meaning', value: wordTranslation, location: 'back' as FieldLocation },
        { label: 'Sentence', value: back, location: 'back' as FieldLocation },
        { label: 'Translation', value: translation, location: 'back' as FieldLocation },
      ],
)

onMounted(async () => {
  translate(props.sentence)
  lookupWord(props.targetWord)
  if (props.wordCount > 1) {
    translateWord(props.targetWord)
  }
  try {
    decks.value = await getDecks()
  } catch {
    decks.value = ['Default']
  }
})


function buildSide(location: FieldLocation): string {
  return fields.value
    .filter((f) => f.location === location)
    .map((f) => f.value)
    .join('<br><br>')
}

async function handleExport() {
  exporting.value = true
  error.value = ''
  success.value = false
  try {
    console.log('Exporting with deck:', activeDeck.value)
    console.log('Front:', buildSide('front'))
    console.log('Back:', buildSide('back'))
    await addNote(buildSide('front'), buildSide('back'), activeDeck.value)
    success.value = true
  } catch (e) {
    console.error('Export error:', e)
    error.value = 'Failed to export. Make sure Anki is open with AnkiConnect installed.'
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
      <textarea v-model="field.value" rows="2" :disabled="translationLoading || jishoLoading" />
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
    <p v-if="error" style="color: red">{{ error }}</p>
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


    <button class="back-btn" @click="emit('back')">← Back</button>

    <button
      class="export-btn"
      @click="handleExport"
      :disabled="exporting || translationLoading || jishoLoading"
    >
      {{ exporting ? 'Exporting...' : 'Export to Anki' }}
    </button>
  </div>
</template>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

</style>
