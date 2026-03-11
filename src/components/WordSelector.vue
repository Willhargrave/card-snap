<script setup lang="ts">
import {computed, ref} from 'vue'

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  selectWords: [words: string[], sentence: string]
  back: []
}>()



const selectedWords = ref<string[]>([])

const punctuation = /^[。、！？「」『』（）・…\s]+$/

const words = computed(() => {
  const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })
  return [...segmenter.segment(props.text)]
    .map((s) => s.segment)
    .filter((word) => !punctuation.test(word))
})

function handleWordClick(word: string) {
  if (selectedWords.value.includes(word)) {
    selectedWords.value = selectedWords.value.filter((w) => w !== word)
  } else {
    selectedWords.value.push(word)
  }
}

function handleProceed() {
  if (selectedWords.value.length > 0) {
    emit('selectWords', selectedWords.value, props.text)
  }
}

</script>

<template>
  <div>
    <p>Click your target words:</p>
    <div>
      <span
        v-for="(word, index) in words"
        :key="index"
        @click="handleWordClick(word)"
        :class="{ selected: selectedWords.includes(word) }"
      >
        {{ word }}
      </span>
    </div>
    <div class="button-row">
      <button class="back-btn" @click="emit('back')">← Back</button>
    <button
      class="proceed-btn"
      :disabled="selectedWords.length === 0"
      @click="handleProceed"
    >
      Create Flashcard →
    </button>
    </div>
  </div>
</template>


<style scoped>
span {
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 2px;
  display: inline-block;
}
span:hover {
  border-color: #ffd700;
}
.selected {
  background-color: #ffd700;
  border-color: #ffd700;
}
.button-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.back-btn {
  padding: 10px 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.back-btn:hover {
  border-color: #999;
}
.proceed-btn {
  padding: 10px 20px;
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.proceed-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.proceed-btn:hover:not(:disabled) {
  background-color: #f0c800;
}
</style>
