<script setup lang="ts">
import {computed, ref} from 'vue'

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  selectWord: [word: string, sentence: string]
  back: []
}>()



const selectedWord = ref('')

const punctuation = /^[。、！？「」『』（）・…\s]+$/

const words = computed(() => {
  const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })
  return [...segmenter.segment(props.text)]
    .map((s) => s.segment)
    .filter((word) => !punctuation.test(word))
})

function handleWordClick(word: string) {
  selectedWord.value = word
  emit('selectWord', word, props.text)
}
</script>

<template>
  <div>
    <p>Click your target word:</p>
    <div>
      <span v-for="(word, index) in words"
      :key="index"
      @click="handleWordClick(word)"
      :class="{selected: word === selectedWord}"
      >
      {{ word }}
      </span>
    </div>
  </div>
  <button class="back-btn" @click="emit('back')">← Back</button>

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
</style>

