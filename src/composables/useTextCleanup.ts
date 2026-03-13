export function useTextCleanup() {
  function removeExtraSpaces(text: string): string {
    return text.replace(/(?<![。、])\s+/g, '')
  }

  function removeLineBreaks(text: string): string {
    return text.replace(/\n+/g, '')
  }

  function cleanText(text: string): string {
    return removeExtraSpaces(removeLineBreaks(text))
  }

  return { cleanText }
}
