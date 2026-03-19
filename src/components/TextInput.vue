<script setup lang="ts">
import { ref } from 'vue'
import { useAzureOCR } from '../composables/useAzureOCR'

const emit = defineEmits<{
  submit: [text: string, image?: File]
}>()

const { extractText, loading: ocrLoading } = useAzureOCR()
const inputText = ref('')

function handleTextSubmit() {
  if (!inputText.value.trim()) return
  emit('submit', inputText.value)
}

async function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  console.log('File selected:', file)
  if (!file) {
    console.log('No file selected')
    return
  }
  console.log('File name:', file.name)
  console.log('File size:', file.size)
  console.log('File type:', file.type)
  const text = await extractText(file)
  console.log('Extracted text:', text)
  if (text) {
    emit('submit', text, file)
  } else {
    console.log('No text extracted from image')
  }
}
</script>

<template>
  <div class="options-wrapper">
      <div class="option-card">
      <h2>Upload Image</h2>
      <p>Extract text from a photo</p>
      <label class="upload-label" :class="{ loading: ocrLoading }">
        <input type="file" accept="image/*" @change="handleImageUpload" :disabled="ocrLoading" />
        {{ ocrLoading ? 'Extracting text...' : 'Choose Image or Take Photo' }}
      </label>
    </div>
    <div class="divider">or</div>
    <div class="option-card">
      <h2>Paste Text</h2>
      <p>Paste Japanese text directly</p>
      <textarea v-model="inputText" placeholder="Paste your Japanese text here..." rows="6" />
      <button @click="handleTextSubmit" :disabled="!inputText.trim()">Analyse Text →</button>
    </div>
  </div>
</template>

<style scoped>
.options-wrapper {
  display: flex;
  align-items: stretch;
  gap: 24px;
}
.option-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.upload-label {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  color: #999;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}
.option-card p {
  color: #999;
  margin: 0;
  font-size: 0.9rem;
}
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}
button {
  padding: 10px 20px;
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button:hover {
  background-color: #f0c800;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.divider {
  display: flex;
  align-items: center;
  color: #999;
  padding-top: 60px;
  font-size: 0.9rem;
}

.upload-label:hover {
  border-color: #ffd700;
  color: #333;
}
.upload-label input {
  display: none;
}
.upload-label.loading {
  border-color: #ffd700;
  color: #333;
}
  @media (max-width: 768px) {
  .options-wrapper {
    flex-direction: column;
  }
  .divider {
    padding-top: 0;
    justify-content: center;
  }
  .upload-label {
    min-height: 120px;
  }
}

</style>
