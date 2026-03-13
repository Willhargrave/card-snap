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
  <h1>Anki Helper</h1>
  <p>Language Reader Tool and card maker</p>
  <TextInput v-if="currentStep === 'input'" @submit="handleTextSubmit" />
  <WordSelector
    v-if="currentStep === 'select'"
    :text="japaneseText"
    @selectWords="handleWordsSelect"
    @back="currentStep = 'input'"
  ></WordSelector>
  <FlashcardForm
    v-if="currentStep === 'form'"
    :targetWord="targetWord"
    :sentence="sentence"
    :wordCount="wordCount"
    @back="currentStep = 'select'"
  />
</template>

<style scoped></style>
