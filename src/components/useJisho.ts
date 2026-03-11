import { ref } from 'vue'

export function useJisho() {
  const reading = ref('')
  const meaning = ref('')
  const loading = ref(false)

  async function lookupWord(word: string) {
    loading.value = true
    try {
      const url = `/jisho/api/v1/search/words?keyword=${encodeURIComponent(word)}`
      console.log('Fetching URL:', url)

      const res = await fetch(url)
      const data = await res.json()
      const firstResult = data.data[0]

      if (firstResult) {
        reading.value = firstResult.japanese[0].reading ?? ''
        meaning.value = firstResult.senses[0].english_definitions.join(', ')
      } else {
        console.log('No results found for:', word)
      }
    } catch (e) {
      console.error('Jisho error:', e)
    } finally {
      loading.value = false
    }
  }

  return { reading, meaning, loading, lookupWord }
}
