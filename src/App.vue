<script setup lang="ts">
import { ref } from 'vue'
import TextInput from './components/TextInput.vue'
import WordSelector from './components/WordSelector.vue'
import FlashcardForm from './components/FlashcardForm.vue'
import { useCardStore } from './stores/useCardStore'
import { useCSVExport } from './composables/useCSVExport'
const cardStore = useCardStore()
const { exportToCSV } = useCSVExport()
import { useTextCleanup } from './composables/useTextCleanup'

type Step = 'input' | 'select' | 'form'
const currentStep = ref('input' as Step)
const japaneseText = ref('')
const targetWord = ref('')
const sentence = ref('')
const wordCount = ref(0)
const uploadedImage = ref<File | null>(null)
const { cleanText } = useTextCleanup()

function handleTextSubmit(text: string, image?: File) {
  japaneseText.value = cleanText(text)
  uploadedImage.value = image ?? null
  currentStep.value = 'select'
}

function handleWordsSelect(words: string[], fullSentence: string) {
  targetWord.value = words.join('')
  wordCount.value = words.length
  sentence.value = fullSentence
  currentStep.value = 'form'
}
</script>

<template>
  <div class="app">
    <div class="header">
      <h1>Automatic Anki Card Maker</h1>
      <p>Language Reader Tool and card maker for Japanese text and images</p>
      <div class="csv-bar" v-if="cardStore.cards.length > 0">
        <span>{{ cardStore.cards.length }} card{{ cardStore.cards.length !== 1 ? 's' : '' }} ready to export</span>
        <button @click="exportToCSV">Download CSV</button>
      </div>
    </div>
    <div class="content">
      <TextInput v-if="currentStep === 'input'" @submit="handleTextSubmit" />
      <WordSelector
        v-if="currentStep === 'select'"
        :text="japaneseText"
        @selectWords="handleWordsSelect"
        @back="currentStep = 'input'"
      />
    <FlashcardForm
      v-if="currentStep === 'form'"
      :targetWord="targetWord"
      :sentence="sentence"
      :wordCount="wordCount"
      :image="uploadedImage"
      @back="currentStep = 'select'"
    />
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}
.header {
  text-align: center;
  margin-bottom: 40px;
}
.header h1 {
  margin: 0 0 8px 0;
}
.header p {
  margin: 0;
  color: #999;
}
.content {
  width: 100%;
  max-width: 900px;
}

@media (max-width: 768px) {
  .app {
    padding: 24px 16px;
  }
  .header {
    margin-bottom: 24px;
  }
  .header h1 {
    font-size: 1.5rem;
  }
}
.csv-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffd700;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.csv-bar button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.csv-bar button:hover {
  border-color: #999;
}
</style>
