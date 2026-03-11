export function useAnki() {
  async function addNote(front: string, back: string, translation: string) {
    try {
      const body = JSON.stringify({
        action: 'addNote',
        version: 6,
        params: {
          note: {
            deckName: 'Default',
            modelName: 'Basic',
            fields: {
              Front: front,
              Back: `${back}<br><br>${translation}`,
            },
            options: {
              allowDuplicate: false,
            },
            tags: ['anki-helper'],
          },
        },
      })

      console.log('Sending to AnkiConnect:', body)

      const response = await fetch('http://localhost:8765', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (data.error) throw new Error(data.error)
      return data.result
    } catch (e) {
      console.error('AnkiConnect error:', e)
      throw e
    }
  }

  return { addNote }
}
