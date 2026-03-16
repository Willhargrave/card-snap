export function useAnki() {
  async function getDecks(): Promise<string[]> {
    const response = await fetch('http://localhost:8765', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deckNames', version: 6 }),
    })
    const data = await response.json()
    if (data.error) throw new Error(data.error)
    return data.result
  }

  async function addNote(front: string, back: string, deckName: string) {
    const response = await fetch('http://localhost:8765', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addNote',
        version: 6,
        params: {
          note: {
            deckName,
            modelName: 'Basic',
            fields: { Front: front, Back: back },
            options: { allowDuplicate: false },
            tags: ['anki-helper'],
          },
        },
      }),
    })
    const data = await response.json()
    if (data.error) throw new Error(data.error)
    return data.result
  }

  return { addNote, getDecks }
}
