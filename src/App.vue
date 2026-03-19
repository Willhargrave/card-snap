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
    <header class="header">
    <div class="header-content">
      <h1 class="header-logo">CardSnap</h1>
      <div class="header-links">
      <a
      href="mailto:cardsnap26@gmail.com"
      class="email-btn">
        <svg height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
        Contact
      </a>
      <a
        href="https://github.com/Willhargrave/anki-helper"
        target="_blank"
        class="github-btn"
      >
    <svg height="16" width="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
        Source Code
      </a>
    </div>
    </div>
  </header>
  <div class="app">
    <div class="content">
      <div v-if="currentStep === 'input'" class="explainer">
      <h1>How it works</h1>
      <ul>
        <li>Take a picture of Japanese text or upload a photo choose your target word or sentence to create a card</li>
        <li>Double-check the English translations and choose what content you want on the front and back of your card</li>
        <li>Add cards to your CSV download basket</li>
        <li>Download and import to your favourite SRS app (this app is primarly designed for use with Anki)</li>
        <li>Follow the link to the GitHub repo to run the app locally and connect directly with AnkiConnect on desktop</li>
      </ul>
    </div>
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

    <div class="csv-bar" v-if="cardStore.cards.length > 0">
      <span>{{ cardStore.cards.length }} card{{ cardStore.cards.length !== 1 ? 's' : '' }} ready to export</span>
      <button @click="exportToCSV">Download CSV</button>
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
  width: 100%;
  border-bottom: 1px solid #eee;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  background: black;
  z-index: 10;
  margin-bottom: 10px;
}
.header-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  color: white;
  justify-content: space-between;
  align-items: center;
}
.header-logo {
  margin: 0;
  font-size: 1.2rem;
}
.github-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #24292e;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.85rem;
}
.github-btn:hover {
  background: #3a3f45;
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

.explainer {
  background: #fffdf0;
  border: 1px solid #ffd700;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
}
.explainer h1 {
  margin: 0 0 16px 0;
  font-weight: bold;
}
.explainer ul {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.explainer li {
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
}
.header-links {
  display: flex;
  align-items: center;
  gap: 12px;
}
.email-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.85rem;
  background: #24292e;
  color: white;
}
.email-btn:hover {
  border-color: #999;
}

</style>
