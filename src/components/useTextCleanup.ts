export function useTextCleanup() {
  function removeExtraSpaces(text: string): string {
    return text.replace(/(?<![。、])\s+/g, '')
  }

  function cleanText(text: string): string {
    return removeExtraSpaces(text)
  }

  return { cleanText }
}
