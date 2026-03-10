export function useAnki() {
  async function addNote(front: string, back: string, translation: string) {
    const response = await fetch('http://localhost:8765', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      }),
    })
    const data = await response.json()
    if (data.error) throw new Error(data.error)
    return data.result
  }

  return { addNote }
}
