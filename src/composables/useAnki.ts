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
async function createDeck(deckName: string) {
  const response = await fetch('http://localhost:8765', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'createDeck',
      version: 6,
      params: { deck: deckName }
    }),
  })
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data.result
}
async function addNote(front: string, back: string, deckName: string) {
  await createDeck(deckName)
  console.log('Sending to AnkiConnect with deck:', deckName)
  const body = JSON.stringify({
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
  })
  console.log('Request body:', body)
  const response = await fetch('http://localhost:8765', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  const data = await response.json()
  console.log('AnkiConnect response:', data)
  if (data.error) throw new Error(data.error)
  return data.result
}


  return { addNote, getDecks }
}
