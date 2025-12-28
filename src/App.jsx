import { useState, useEffect } from 'react'
import './App.css'
import FlashcardView from './components/FlashcardView'
import DeckManager from './components/DeckManager'
import { loadDecks, saveDecks } from './utils/storage'

function App() {
  const [decks, setDecks] = useState([])
  const [currentDeck, setCurrentDeck] = useState(null)
  const [view, setView] = useState('deck-select') // 'deck-select', 'study', 'manage'

  useEffect(() => {
    const savedDecks = loadDecks()
    setDecks(savedDecks)
  }, [])

  useEffect(() => {
    saveDecks(decks)
  }, [decks])

  const addDeck = (deck) => {
    setDecks([...decks, deck])
  }

  const updateDeck = (deckId, updatedDeck) => {
    setDecks(decks.map(d => d.id === deckId ? updatedDeck : d))
  }

  const deleteDeck = (deckId) => {
    setDecks(decks.filter(d => d.id !== deckId))
    if (currentDeck?.id === deckId) {
      setCurrentDeck(null)
      setView('deck-select')
    }
  }

  const startStudying = (deck) => {
    setCurrentDeck(deck)
    setView('study')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>拼大人 Pindarin</h1>
        <p>Mandarin Vocabulary Trainer with Spaced Repetition</p>
      </header>

      <nav className="app-nav">
        <button
          className={view === 'deck-select' ? 'active' : ''}
          onClick={() => setView('deck-select')}
        >
          Study
        </button>
        <button
          className={view === 'manage' ? 'active' : ''}
          onClick={() => setView('manage')}
        >
          Manage Decks
        </button>
      </nav>

      <main className="app-main">
        {view === 'deck-select' && (
          <div className="deck-select">
            <h2>Select a Deck</h2>
            {decks.length === 0 ? (
              <div className="empty-state">
                <p>No decks yet! Create one in the Manage Decks tab.</p>
              </div>
            ) : (
              <div className="deck-list">
                {decks.map(deck => (
                  <div key={deck.id} className="deck-card">
                    <h3>{deck.name}</h3>
                    <p>{deck.cards.length} cards</p>
                    <button onClick={() => startStudying(deck)}>
                      Study Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'study' && currentDeck && (
          <FlashcardView
            deck={currentDeck}
            onUpdateDeck={(updated) => updateDeck(currentDeck.id, updated)}
            onExit={() => setView('deck-select')}
          />
        )}

        {view === 'manage' && (
          <DeckManager
            decks={decks}
            onAddDeck={addDeck}
            onUpdateDeck={updateDeck}
            onDeleteDeck={deleteDeck}
          />
        )}
      </main>
    </div>
  )
}

export default App
