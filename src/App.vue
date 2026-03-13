<script setup lang="ts">
import { ref } from 'vue'
import TextInput from './components/TextInput.vue'
import WordSelector from './components/WordSelector.vue'
import FlashcardForm from './components/FlashcardForm.vue'
import { useTextCleanup } from './composables/useTextCleanup'

type Step = 'input' | 'select' | 'form'
const currentStep = ref('input' as Step)
const japaneseText = ref('')
const targetWord = ref('')
const sentence = ref('')
const wordCount = ref(0)
const { cleanText } = useTextCleanup()

function handleTextSubmit(text: string) {
  japaneseText.value = cleanText(text)
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
</style>
