import { ref } from 'vue'

export function useAzureOCR() {
  const loading = ref(false)
  const error = ref('')

  async function extractText(file: File): Promise<string> {
  loading.value = true
  error.value = ''
  console.log('Starting Azure OCR extraction...')
  console.log('Endpoint:', import.meta.env.VITE_AZURE_VISION_ENDPOINT)
  console.log('Key exists:', !!import.meta.env.VITE_AZURE_VISION_KEY)

  try {
    const endpoint = import.meta.env.VITE_AZURE_VISION_ENDPOINT
    const key = import.meta.env.VITE_AZURE_VISION_KEY
    const url = `${endpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=read`
    console.log('Requesting URL:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/octet-stream',
      },
      body: file,
    })

    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Azure response:', data)

    const lines = data.readResult.blocks
      .flatMap((block: any) => block.lines)
      .map((line: any) => line.text)
      .join('')

    console.log('Extracted text:', lines)
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
