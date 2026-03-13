import { ref } from 'vue'

export function useAzureOCR() {
  const loading = ref(false)
  const error = ref('')

  async function extractText(file: File): Promise<string> {
    loading.value = true
    error.value = ''

    try {
      const endpoint = import.meta.env.VITE_AZURE_VISION_ENDPOINT
      const key = import.meta.env.VITE_AZURE_VISION_KEY

      const url = `${endpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=read`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Content-Type': 'application/octet-stream',
        },
        body: file,
      })

      const data = await response.json()
      console.log('Azure OCR response:', data)

      const lines = data.readResult.blocks
        .flatMap((block: any) => block.lines)
        .map((line: any) => line.text)
        .join('')

      return lines
    } catch (e) {
      console.error('Azure OCR error:', e)
      error.value = 'Failed to extract text from image.'
      return ''
    } finally {
      loading.value = false
    }
  }

  return { extractText, loading, error }
}
