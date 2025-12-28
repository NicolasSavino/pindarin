import { HSK_DECKS } from '../data/index.js'

const DECKS_KEY = 'pindarin_decks'

export const loadDecks = () => {
  try {
    const saved = localStorage.getItem(DECKS_KEY)
    if (saved) {
      const userDecks = JSON.parse(saved)

      // Merge default HSK decks with user decks
      // This preserves user progress on HSK decks while ensuring they always exist
      const hskIds = new Set(['hsk-1', 'hsk-2', 'hsk-3'])
      const userCustomDecks = userDecks.filter(d => !hskIds.has(d.id))

      // Use saved progress for HSK decks if exists, else use defaults
      const hskDecksWithProgress = HSK_DECKS.map(hskDeck => {
        const savedDeck = userDecks.find(d => d.id === hskDeck.id)
        return savedDeck || hskDeck
      })

      return [...hskDecksWithProgress, ...userCustomDecks]
    }
  } catch (error) {
    console.error('Error loading decks:', error)
  }
  return HSK_DECKS
}

export const saveDecks = (decks) => {
  try {
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks))
  } catch (error) {
    console.error('Error saving decks:', error)
  }
}
