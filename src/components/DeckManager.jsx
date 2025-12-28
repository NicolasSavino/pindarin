import { useState } from 'react'
import './DeckManager.css'
import { speakChinese } from '../utils/tts'

function DeckManager({ decks, onAddDeck, onUpdateDeck, onDeleteDeck }) {
  const [selectedDeck, setSelectedDeck] = useState(null)
  const [isCreatingDeck, setIsCreatingDeck] = useState(false)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  const [newDeckName, setNewDeckName] = useState('')
  const [cardForm, setCardForm] = useState({
    chinese: '',
    pinyin: '',
    english: ''
  })

  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      const newDeck = {
        id: `deck-${Date.now()}`,
        name: newDeckName,
        cards: []
      }
      onAddDeck(newDeck)
      setNewDeckName('')
      setIsCreatingDeck(false)
    }
  }

  const handleAddCard = () => {
    if (selectedDeck && cardForm.chinese && cardForm.pinyin && cardForm.english) {
      const newCard = {
        id: `card-${Date.now()}`,
        chinese: cardForm.chinese,
        pinyin: cardForm.pinyin,
        english: cardForm.english,
        interval: 0,
        repetition: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString()
      }

      const updatedDeck = {
        ...selectedDeck,
        cards: [...selectedDeck.cards, newCard]
      }

      onUpdateDeck(selectedDeck.id, updatedDeck)
      setSelectedDeck(updatedDeck)
      setCardForm({ chinese: '', pinyin: '', english: '' })
      setIsAddingCard(false)
    }
  }

  const handleUpdateCard = () => {
    if (selectedDeck && editingCard && cardForm.chinese && cardForm.pinyin && cardForm.english) {
      const updatedCard = {
        ...editingCard,
        chinese: cardForm.chinese,
        pinyin: cardForm.pinyin,
        english: cardForm.english
      }

      const updatedDeck = {
        ...selectedDeck,
        cards: selectedDeck.cards.map(c => c.id === editingCard.id ? updatedCard : c)
      }

      onUpdateDeck(selectedDeck.id, updatedDeck)
      setSelectedDeck(updatedDeck)
      setEditingCard(null)
      setCardForm({ chinese: '', pinyin: '', english: '' })
    }
  }

  const handleDeleteCard = (cardId) => {
    if (selectedDeck && confirm('Delete this card?')) {
      const updatedDeck = {
        ...selectedDeck,
        cards: selectedDeck.cards.filter(c => c.id !== cardId)
      }
      onUpdateDeck(selectedDeck.id, updatedDeck)
      setSelectedDeck(updatedDeck)
    }
  }

  const startEditCard = (card) => {
    setEditingCard(card)
    setCardForm({
      chinese: card.chinese,
      pinyin: card.pinyin,
      english: card.english
    })
  }

  const cancelEdit = () => {
    setEditingCard(null)
    setIsAddingCard(false)
    setCardForm({ chinese: '', pinyin: '', english: '' })
  }

  return (
    <div className="deck-manager">
      <div className="manager-sidebar">
        <div className="sidebar-header">
          <h3>Your Decks</h3>
          <button
            className="btn-create"
            onClick={() => setIsCreatingDeck(true)}
          >
            + New Deck
          </button>
        </div>

        {isCreatingDeck && (
          <div className="create-deck-form">
            <input
              type="text"
              placeholder="Deck name"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateDeck()}
              autoFocus
            />
            <div className="form-actions">
              <button onClick={handleCreateDeck} className="btn-save">
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreatingDeck(false)
                  setNewDeckName('')
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="deck-list-sidebar">
          {decks.map(deck => (
            <div
              key={deck.id}
              className={`deck-item ${selectedDeck?.id === deck.id ? 'active' : ''}`}
              onClick={() => setSelectedDeck(deck)}
            >
              <div className="deck-item-name">{deck.name}</div>
              <div className="deck-item-count">{deck.cards.length} cards</div>
              {selectedDeck?.id === deck.id && (
                <button
                  className="btn-delete-deck"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete deck "${deck.name}"?`)) {
                      onDeleteDeck(deck.id)
                      setSelectedDeck(null)
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="manager-content">
        {!selectedDeck ? (
          <div className="empty-selection">
            <p>Select a deck to manage its cards</p>
          </div>
        ) : (
          <>
            <div className="content-header">
              <h2>{selectedDeck.name}</h2>
              <button
                className="btn-add-card"
                onClick={() => setIsAddingCard(true)}
              >
                + Add Card
              </button>
            </div>

            {(isAddingCard || editingCard) && (
              <div className="card-form">
                <h3>{editingCard ? 'Edit Card' : 'New Card'}</h3>
                <div className="form-group">
                  <label>Chinese Characters</label>
                  <input
                    type="text"
                    placeholder="你好"
                    value={cardForm.chinese}
                    onChange={(e) => setCardForm({ ...cardForm, chinese: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Pinyin</label>
                  <input
                    type="text"
                    placeholder="nǐ hǎo"
                    value={cardForm.pinyin}
                    onChange={(e) => setCardForm({ ...cardForm, pinyin: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>English</label>
                  <input
                    type="text"
                    placeholder="hello"
                    value={cardForm.english}
                    onChange={(e) => setCardForm({ ...cardForm, english: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button
                    onClick={editingCard ? handleUpdateCard : handleAddCard}
                    className="btn-save"
                  >
                    {editingCard ? 'Update' : 'Add'}
                  </button>
                  <button
                    onClick={() => cardForm.chinese && speakChinese(cardForm.chinese)}
                    className="btn-test"
                    type="button"
                  >
                    🔊 Test
                  </button>
                  <button onClick={cancelEdit} className="btn-cancel">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="cards-list">
              {selectedDeck.cards.length === 0 ? (
                <div className="empty-cards">
                  <p>No cards yet. Add some cards to get started!</p>
                </div>
              ) : (
                selectedDeck.cards.map(card => (
                  <div key={card.id} className="card-item">
                    <div className="card-item-content">
                      <div className="card-chinese">{card.chinese}</div>
                      <div className="card-pinyin">{card.pinyin}</div>
                      <div className="card-english">{card.english}</div>
                    </div>
                    <div className="card-item-actions">
                      <button
                        onClick={() => startEditCard(card)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DeckManager
