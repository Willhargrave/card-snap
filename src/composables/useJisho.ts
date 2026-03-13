import { ref } from 'vue'

export function useJisho() {
  const reading = ref('')
  const meaning = ref('')
  const loading = ref(false)

  async function lookupWord(word: string) {
    loading.value = true
    try {
      const url = `/jisho/api/v1/search/words?keyword=${encodeURIComponent(word)}`
      const res = await fetch(url)
      const data = await res.json()
      const firstResult = data.data[0]
      if (firstResult) {
        reading.value = firstResult.japanese[0].reading ?? word
        meaning.value = firstResult.senses[0].english_definitions.join(', ')
      }
    } catch (e) {
      console.error('Jisho error:', e)
    } finally {
      loading.value = false
    }
  }

  async function getPhraseReading(phrase: string): Promise<string> {
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })
    const segments = [...segmenter.segment(phrase)].map(s => s.segment)
    const isKanji = (text: string) => /[一-龯]/.test(text)

    const parts = await Promise.all(
      segments.map(async (segment) => {
        if (isKanji(segment)) {
          try {
            const url = `/jisho/api/v1/search/words?keyword=${encodeURIComponent(segment)}`
            const res = await fetch(url)
            const data = await res.json()
            const firstResult = data.data[0]
            if (firstResult) {
              return firstResult.japanese[0].reading ?? segment
            }
          } catch {
            return segment
          }
        }
        return segment
      })
    )

    return parts.join('')
  }

  return { reading, meaning, loading, lookupWord, getPhraseReading }
}
