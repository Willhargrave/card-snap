import { ref } from "vue";

export function useJisho() {
  const reading = ref('')
  const meaning = ref('')
  const loading = ref(false)

  async function lookupWord(word: string) {
    loading.value = true
    const res = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`
    )
    const data = await res.json()
    const firstResult = data.data[0]

    if (firstResult) {
      reading.value = firstResult.japanese[0].reading ?? ''
      meaning.value = firstResult.senses[0].english_definitions.join(', ')
    }

    loading.value = false
  }

  return { reading, meaning, loading, lookupWord }
}

