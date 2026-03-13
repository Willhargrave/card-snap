import { ref } from "vue";

export function useTranslation() {
  const translation = ref('')
  const loading = ref(false)


  async function translate(text: string) {
    loading.value = true
    console.log('Translating:', text)
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`
    )
    const data = await res.json()
    console.log('Translation response:', data)
    translation.value = data.responseData.translatedText
    loading.value = false
  }

  return {translation, loading, translate}
}
