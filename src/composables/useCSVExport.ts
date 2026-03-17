import { useCardStore } from "@/stores/useCardStore"

export function useCSVExport() {
  const store = useCardStore()

  function exportToCSV() {
    const escapeField = (field: string) => {
      const stripped = field.replace(/<[^>]*>/g, ' ').trim()
      return `"${stripped.replace(/"/g, '""')}"`
    }

    const rows = store.cards
      .map(card => `${escapeField(card.front)},${escapeField(card.back)}`)
      .join('\n')

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'anki-cards.csv'
    link.click()
    URL.revokeObjectURL(url)
    store.clearCards()
  }


  return { exportToCSV }
}
