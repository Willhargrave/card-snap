export function useCSVExport() {
  function exportToCSV(front: string, back: string) {
    const escapeField = (field: string) => {
      const stripped = field.replace(/<[^>]*>/g, ' ').trim()
      return `"${stripped.replace(/"/g, '""')}"`
    }

    const row = `${escapeField(front)},${escapeField(back)}`
    const blob = new Blob([row], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'anki-cards.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return { exportToCSV }
}
